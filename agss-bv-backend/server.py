from flask import Flask, request, jsonify
import os
import cv2
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv
import uuid
from datetime import datetime
from scipy.fftpack import fft, ifft
from flask_cors import CORS
from twilio.rest import Client
from datetime import datetime, timezone
import pytz
import os

# ================== FLASK APP SETUP ==================
app = Flask(__name__)
CORS(app)
load_dotenv()
# Twilio Config (use env vars in real deployment)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_WHATSAPP_FROM")

# example SMS: "+1XXXXXXXXXX"
# example WhatsApp: "whatsapp:+14155238886"

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
# ================== CONFIGURATION ==================
client = MongoClient("mongodb://localhost:27017/")
db = client["AGSS_BV"]
students = db["students"]
counters = db["counters"]   # 🔹 ADDED (for auto studentId)

UPLOAD_FOLDER = r"D:\AGSS-BV\Uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Accuracy Constants (UNCHANGED)
RADIAL_RES = 64
ANGULAR_RES = 256
HAMMING_THRESHOLD = 0.32
ROTATION_SHIFTS = 10
ENROLL_SAMPLES = 3
GLARE_THRESHOLD = 245
SHADOW_THRESHOLD = 30

# =========================================================
# 🔹 STUDENT ID GENERATOR (BTBTC23xxx)
# =========================================================
def generate_student_id():
    counter = counters.find_one_and_update(
        {"key": "studentId"},
        {"$inc": {"count": 1}},
        upsert=True,
        return_document=True
    )

    num = str(counter["count"]).zfill(3)
    return f"BTBTC23{num}"

# =========================================================
# 1️⃣ IMAGE PREPROCESSING & QUALITY
# =========================================================
def enhance_iris(img):
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    return clahe.apply(img)

def check_quality(img):
    lap = cv2.Laplacian(img, cv2.CV_64F).var()
    if lap < 800:
        return False, "Image too blurry"
    return True, "Good quality"

# =========================================================
# 2️⃣ ROBUST SEGMENTATION
# =========================================================
def segment_iris(img):
    blurred = cv2.medianBlur(img, 11)

    circles = cv2.HoughCircles(
        blurred, cv2.HOUGH_GRADIENT, dp=1, minDist=50,
        param1=100, param2=30, minRadius=25, maxRadius=160
    )

    if circles is None:
        raise Exception("Iris not found. Ensure eye is centered and open.")

    circles = np.uint16(np.around(circles[0]))
    circles = sorted(circles, key=lambda x: x[2])

    pupil = circles[0]
    iris = circles[-1] if len(circles) > 1 else [pupil[0], pupil[1], int(pupil[2] * 2.8)]

    return pupil, iris

# =========================================================
# 3️⃣ NORMALIZATION WITH DYNAMIC MASKING
# =========================================================
def normalize_and_mask(img, pupil, iris):
    px, py, pr = pupil
    ix, iy, ir = iris

    norm = np.zeros((RADIAL_RES, ANGULAR_RES), dtype=np.float32)
    mask = np.ones((RADIAL_RES, ANGULAR_RES), dtype=np.uint8)

    for t in range(ANGULAR_RES):
        theta = 2 * np.pi * t / ANGULAR_RES
        xp, yp = px + pr * np.cos(theta), py + pr * np.sin(theta)
        xi, yi = ix + ir * np.cos(theta), iy + ir * np.sin(theta)

        for r in range(RADIAL_RES):
            r_norm = r / (RADIAL_RES - 1)
            x = int((1 - r_norm) * xp + r_norm * xi)
            y = int((1 - r_norm) * yp + r_norm * yi)

            if 0 <= x < img.shape[1] and 0 <= y < img.shape[0]:
                val = img[y, x]
                norm[r, t] = val
                if val > GLARE_THRESHOLD or val < SHADOW_THRESHOLD:
                    mask[r, t] = 0
            else:
                mask[r, t] = 0

    return norm, mask

# =========================================================
# 4️⃣ PHASE ENCODING & MATCHING
# =========================================================
def log_gabor_encode(norm, mask):
    rows, cols = norm.shape
    f = fft(norm, axis=1)

    freqs = np.fft.fftfreq(cols)
    radius = np.abs(freqs)
    radius[radius == 0] = 1e-6

    log_gabor = np.exp(-(np.log(radius / 0.25) ** 2) / (2 * np.log(0.5) ** 2))

    code = np.zeros((rows, cols), dtype=np.uint8)
    for r in range(rows):
        filtered = ifft(f[r] * log_gabor)
        code[r] = np.real(filtered) > 0

    return code.flatten(), mask.flatten()

def masked_rotated_hamming(c1, c2, m1, m2):
    c1 = c1.reshape(RADIAL_RES, ANGULAR_RES)
    c2 = c2.reshape(RADIAL_RES, ANGULAR_RES)
    m1 = m1.reshape(RADIAL_RES, ANGULAR_RES)
    m2 = m2.reshape(RADIAL_RES, ANGULAR_RES)

    min_hd = 1.0
    for shift in range(-ROTATION_SHIFTS, ROTATION_SHIFTS + 1):
        c2s = np.roll(c2, shift, axis=1)
        m2s = np.roll(m2, shift, axis=1)

        combined_mask = m1 & m2s
        if np.sum(combined_mask) < 100:
            continue

        diff = np.logical_xor(c1, c2s) & combined_mask
        hd = np.sum(diff) / np.sum(combined_mask)
        min_hd = min(min_hd, hd)

    return float(min_hd)

# =========================================================
# 5️⃣ FULL PIPELINE
# =========================================================
def process_full_pipeline(path):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise Exception("Invalid image")

    ok, msg = check_quality(img)
    if not ok:
        raise Exception(msg)

    img = enhance_iris(img)
    pupil, iris = segment_iris(img)
    norm, mask = normalize_and_mask(img, pupil, iris)
    return log_gabor_encode(norm, mask)
# =========================================================
# 🔔 EXIT NOTIFICATION
def send_exit_notification(student, date, time):
    phone = student.get("fatherPhone") or student.get("motherPhone")
    if not phone:
        return

    phone = phone.strip()
    if not phone.startswith("+"):
        phone = f"+91{phone}"

    to_number = f"whatsapp:{phone}"

    message = (
        "AGSS-BV Alert 🚪\n\n"
        "Your ward has exited the campus.\n\n"
        f"📅 Date: {date}\n"
        f"⏰ Time: {time}\n\n"
        "- AGSS-BV"
    )

    try:
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_FROM_NUMBER,
            to=to_number
        )
    except Exception as e:
        print("Exit notification error:", e)
# =========================================================
# 🔔 ENTRY NOTIFICATION
def send_entry_notification(student, date, time):
    phone = student.get("fatherPhone") or student.get("motherPhone")
    if not phone:
        return

    phone = phone.strip()
    if not phone.startswith("+"):
        phone = f"+91{phone}"

    to_number = f"whatsapp:{phone}"

    message = (
        "AGSS-BV Alert 🏫\n\n"
        "Your ward has entered the campus.\n\n"
        f"📅 Date: {date}\n"
        f"⏰ Time: {time}\n\n"
        "- AGSS-BV"
    )

    try:
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_FROM_NUMBER,
            to=to_number
        )
    except Exception as e:
        print("Entry notification error:", e)

# =========================================================
def get_system_date_time():
    ist = pytz.timezone("Asia/Kolkata")
    now = datetime.now(ist)
    return {
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M"),
        "ts": now   # 🔥 ADD THIS
    }

# =========================================================

def send_gatepass_notification(student, exit_date, exit_time):
    """
    WhatsApp notification – Node.js behavior replicated
    """

    father_phone = student.get("fatherPhone")
    mother_phone = student.get("motherPhone")

    phone = father_phone or mother_phone
    if not phone:
        print("❌ No parent phone number found")
        return False

    # 🟢 Ensure +91 like Node.js
    phone = phone.strip()

    if phone.startswith("+"):
        formatted = phone
    else:
        formatted = f"+91{phone}"

    # 🟢 Ensure WhatsApp channel
    to_number = f"whatsapp:{formatted}"

    message_body = (
        "AGSS-BV Update 👋\n\n"
        "Gatepass Generated Successfully.\n\n"
        f"📅 Exit Date: {exit_date}\n"
        f"⏰ Exit Time: {exit_time}\n\n"
        "Please ensure timely return.\n"
        "- AGSS-BV"
    )

    try:
        twilio_client.messages.create(
            body=message_body,
            from_=TWILIO_FROM_NUMBER,  # whatsapp:+14155238886
            to=to_number
        )
        print(f"✅ WhatsApp sent to {to_number}")
        return True

    except Exception as e:
        print("❌ Twilio error:", e)
        return False


# =========================================================
# 📸 REGISTER / CAPTURE (UPDATED)
# =========================================================
@app.route("/capture", methods=["POST"])
def register():
    try:
        file = request.files["image"]
        path = os.path.join(UPLOAD_FOLDER, f"reg_{uuid.uuid4()}.jpg")
        file.save(path)

        code, mask = process_full_pipeline(path)

        student_id = generate_student_id()   # 🔹 BTBTC23xxx

        students.insert_one({
            "student_id": student_id,

            # ---- STUDENT INFO (Node compatible) ----
            "firstName": request.form.get("firstName"),
            "lastName": request.form.get("lastName"),
            "personalEmail": request.form.get("personalEmail"),
            "collegeEmail": request.form.get("collegeEmail"),
            "fatherName": request.form.get("fatherName"),
            "motherName": request.form.get("motherName"),
            "fatherEmail": request.form.get("fatherEmail"),
            "motherEmail": request.form.get("motherEmail"),
            "studentPhone": request.form.get("studentPhone"),
            "fatherPhone": request.form.get("fatherPhone"),
            "motherPhone": request.form.get("motherPhone"),
            "rollNo": request.form.get("rollNo"),
            "course": request.form.get("course"),

            "address": {
                "houseNo": request.form.get("houseNo"),
                "street": request.form.get("street"),
                "pincode": request.form.get("pincode"),
                "city": request.form.get("city"),
                "state": request.form.get("state"),
                "country": request.form.get("country")
            },

            "currentStatus": "inside",

            # ---- IRIS DATA (UNCHANGED) ----
            "iris_code": code.tolist(),
            "mask": mask.tolist(),

            "timestamp": datetime.utcnow()
        })

        return jsonify({
            "status": "Success",
            "student_id": student_id
        })

    except Exception as e:
        return jsonify({"status": "Error", "message": str(e)}), 400

# =========================================================
# ✅ VERIFY (UNCHANGED)
# =========================================================
@app.route("/verify", methods=["POST"])
def verify_exit():
    try:
        student_id = request.form.get("student_id")
        file = request.files.get("image")

        if not student_id or not file:
            return jsonify({"error": "Student ID and image required"}), 400

        # ---------------- 1️⃣ STUDENT EXISTS ----------------
        user = students.find_one({"student_id": student_id})
        if not user:
            return jsonify({"error": "Student not found"}), 404

        # ---------------- 2️⃣ ACTIVE INSIDE CHECK ----------------
        active_log = db.studentlogs.find_one({
            "studentId": student_id,
            "status": "inside"
        })

        if not active_log:
            return jsonify({
                "match": True,
                "exitAllowed": False,
                "reason": "Student is not inside campus"
            })

        # ---------------- 3️⃣ IRIS VERIFICATION ----------------
        path = os.path.join(UPLOAD_FOLDER, f"exit_{uuid.uuid4()}.jpg")
        file.save(path)

        live_code, live_mask = process_full_pipeline(path)

        hd = masked_rotated_hamming(
            np.array(user["iris_code"]),
            live_code,
            np.array(user["mask"]),
            live_mask
        )

        if hd >= HAMMING_THRESHOLD:
            return jsonify({
                "match": False,
                "exitAllowed": False,
                "reason": "Iris mismatch",
                "score": round(1 - hd, 4),
                "distance": round(hd, 4)
            })

        # ---------------- 4️⃣ GATEPASS CHECK ----------------
        gatepass = db.gatepasses.find_one({
            "studentId": student_id,
            "status": "ACTIVE"
        })

        if not gatepass:
            return jsonify({
                "match": True,
                "exitAllowed": False,
                "reason": "No active gatepass"
            })

        system = get_system_date_time()
        current_date = system["date"]
        current_time = system["time"]

        gp_date = gatepass["expectedExitDate"]
        gp_time = gatepass["expectedExitTime"]

        # ---------------- 5️⃣ DATE VALIDATION ----------------
        if current_date < gp_date:
            return jsonify({
                "match": True,
                "exitAllowed": False,
                "reason": "Gatepass not valid yet"
            })

        if current_date > gp_date:
            db.gatepasses.update_one(
                {"_id": gatepass["_id"]},
                {"$set": {"status": "EXPIRED"}}
            )
            return jsonify({
                "match": True,
                "exitAllowed": False,
                "reason": "Gatepass expired"
            })

        # ---------------- 6️⃣ TIME VALIDATION ----------------
        if current_time < gp_time:
            return jsonify({
                "match": True,
                "exitAllowed": False,
                "reason": f"Exit allowed only after {gp_time}"
            })

        # ---------------- 7️⃣ EXIT ALLOWED ----------------
        db.studentlogs.update_one(
            {"_id": active_log["_id"]},
            {"$set": {
                "exitDate": current_date,
                "exitTime": current_time,
                "status": "outside"
            }}
        )

        db.gatepasses.update_one(
            {"_id": gatepass["_id"]},
            {"$set": {
                "status": "USED",
                "usedAt": datetime.now(timezone.utc)
            }}
        )

        # 🔔 WhatsApp EXIT notification
        send_exit_notification(
            user,
            current_date,
            current_time
        )

        return jsonify({
            "match": True,
            "exitAllowed": True,
            "message": "Exit allowed",
            "exitDate": current_date,
            "exitTime": current_time
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

# =========================================================
@app.route("/admin/students", methods=["GET"])
def get_all_students():
    try:
        students_list = []

        # 🔍 search query (optional)
        search = request.args.get("search", "").strip()

        query = {}

        # 🔍 SEARCH by Student ID / Name / Course
        if search:
            regex = {"$regex": search, "$options": "i"}
            query = {
                "$or": [
                    {"student_id": regex},
                    {"firstName": regex},
                    {"lastName": regex},
                    {"course": regex}
                ]
            }

        for s in students.find(query, {
            "iris_code": 0,
            "mask": 0,
            "normalized_iris": 0,
            "createdAt": 0
        }):
            s["_id"] = str(s["_id"])
            students_list.append(s)

        return jsonify({
            "count": len(students_list),
            "students": students_list
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/admin/students/<student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.json

    allowed_fields = {
    # Student
    "studentEmail": data.get("studentEmail"),
    "studentPhone": data.get("studentPhone"),

    # Father
    "fatherEmail": data.get("fatherEmail"),
    "fatherPhone": data.get("fatherPhone"),

    # Mother
    "motherEmail": data.get("motherEmail"),
    "motherPhone": data.get("motherPhone"),

    # Other safe fields
    "firstName": data.get("firstName"),
    "lastName": data.get("lastName"),
    "course": data.get("course"),
    "address": data.get("address")
}


    update_data = {k: v for k, v in allowed_fields.items() if v is not None}

    if not update_data:
        return jsonify({"message": "No valid fields provided"}), 400

    result = students.update_one(
        {"student_id": student_id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"message": "Student updated successfully"})
@app.route("/admin/students/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    result = students.delete_one({"student_id": student_id})

    if result.deleted_count == 0:
        return jsonify({"message": "Student not found"}), 404

    return jsonify({"message": "Student deleted successfully"})
@app.route("/admin/verify-student", methods=["POST"])
def verify_student_for_gatepass():
    try:
        data = request.json
        student_id = data.get("student_id")

        if not student_id:
            return jsonify({
                "success": False,
                "message": "Student ID is required"
            }), 400

        student = students.find_one(
            {"student_id": student_id},
            {
                "_id": 0,
                "student_id": 1,
                "firstName": 1,
                "lastName": 1,
                "course": 1,
                "fatherPhone": 1,
                "motherPhone": 1
            }
        )

        if not student:
            return jsonify({
                "success": False,
                "message": "Student not found"
            }), 404

        return jsonify({
            "success": True,
            "student": student
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@app.route("/admin/create-gatepass", methods=["POST"])
def create_gatepass():
    try:
        data = request.json

        student_id = data.get("student_id")
        expected_date = data.get("expectedExitDate")   # YYYY-MM-DD
        expected_time = data.get("expectedExitTime")   # HH:mm

        # ---------------- 1️⃣ BASIC VALIDATION ----------------
        if not all([student_id, expected_date, expected_time]):
            return jsonify({
                "success": False,
                "message": "Student ID, exit date and time are required"
            }), 400

        # ---------------- 2️⃣ CHECK STUDENT EXISTS ----------------
        student = students.find_one({"student_id": student_id})
        if not student:
            return jsonify({
                "success": False,
                "message": "Student not found"
            }), 404

        # ---------------- 3️⃣ CHECK ACTIVE GATEPASS ----------------
        existing = db.gatepasses.find_one({
            "studentId": student_id,
            "status": "ACTIVE"
        })

        if existing:
            return jsonify({
                "success": False,
                "message": "Active gatepass already exists for this student"
            }), 409

        # ---------------- 4️⃣ CREATE GATEPASS ----------------
        gatepass = {
            "studentId": student_id,
            "studentName": f"{student.get('firstName', '')} {student.get('lastName', '')}".strip(),
            "expectedExitDate": expected_date,
            "expectedExitTime": expected_time,
            "status": "ACTIVE",
            "notificationStatus": "not sent",
            "createdAt": datetime.now(timezone.utc)

        }

        db.gatepasses.insert_one(gatepass)

        # ---------------- 5️⃣ SEND TWILIO NOTIFICATION ----------------
        notification_sent = send_gatepass_notification(
            student,
            expected_date,
            expected_time
        )

        # ---------------- 6️⃣ UPDATE NOTIFICATION STATUS ----------------
        db.gatepasses.update_one(
            {"studentId": student_id, "status": "ACTIVE"},
            {
                "$set": {
                    "notificationStatus": "sent" if notification_sent else "not sent"
                }
            }
        )

        # ---------------- 7️⃣ SUCCESS RESPONSE ----------------
        return jsonify({
            "success": True,
            "message": "Gatepass created successfully",
            "data": {
                "studentId": student_id,
                "expectedExitDate": expected_date,
                "expectedExitTime": expected_time,
                "notificationSent": notification_sent
            }
        }), 201

    except Exception as e:
        print("❌ Create Gatepass Error:", e)
        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500
@app.route("/verify-entry", methods=["POST"])
def verify_entry():
    try:
        student_id = request.form.get("student_id")
        file = request.files.get("image")

        if not student_id or not file:
            return jsonify({"error": "Student ID and image required"}), 400

        # 1️⃣ Student exists?
        user = students.find_one({"student_id": student_id})
        if not user:
            return jsonify({"error": "Student not found"}), 404

        # 2️⃣ Check ACTIVE inside entry
        active_log = db.studentlogs.find_one({
            "studentId": student_id,
            "status": "inside"
        })

        if active_log:
            return jsonify({
                "match": True,
                "entryAllowed": False,
                "reason": "Student already inside campus"
            })

        # 3️⃣ Iris verification
        path = os.path.join(UPLOAD_FOLDER, f"entry_{uuid.uuid4()}.jpg")
        file.save(path)

        live_code, live_mask = process_full_pipeline(path)

        hd = masked_rotated_hamming(
            np.array(user["iris_code"]),
            live_code,
            np.array(user["mask"]),
            live_mask
        )

        if hd >= HAMMING_THRESHOLD:
            return jsonify({
                "match": False,
                "reason": "Iris mismatch",
                "score": round(1 - hd, 4),
                "distance": round(hd, 4)
            })

        # 4️⃣ SYSTEM TIME (IST)
        system = get_system_date_time()

        # 5️⃣ CHECK OLD OUTSIDE RECORD (RE-ENTRY CASE)
        old_log = db.studentlogs.find_one({
            "studentId": student_id,
            "status": "outside"
        })

        if old_log:
            # ➜ Move old record to HISTORY
            db.studentloghistory.insert_one({
                "studentId": old_log.get("studentId"),
                "studentName": old_log.get("studentName"),
                "entryDate": old_log.get("entryDate"),
                "entryTime": old_log.get("entryTime"),
                "exitDate": old_log.get("exitDate"),
                "exitTime": old_log.get("exitTime"),
                "createdAt": datetime.now(pytz.timezone("Asia/Kolkata"))
            })
            # ➜ Remove old record from StudentLog
            db.studentlogs.delete_one({ "_id": old_log["_id"] })

        # 6️⃣ CREATE NEW StudentLog (FRESH ENTRY)
        db.studentlogs.insert_one({
            "studentId": student_id,
            "studentName": f"{user.get('firstName', '')} {user.get('lastName', '')}",
            "entryDate": system["date"],
            "entryTime": system["time"],
            "status": "inside",
            "createdAt": datetime.now(pytz.timezone("Asia/Kolkata"))
        })
        send_entry_notification(user, system["date"], system["time"])
        return jsonify({
            "match": True,
            "entryAllowed": True,
            "message": "Entry allowed",
            "entryDate": system["date"],
            "entryTime": system["time"]
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({ "error": str(e) }), 500
@app.route("/api/students/check/<student_id>", methods=["GET"])
def check_student_exists(student_id):
    try:
        student = students.find_one(
            {"student_id": student_id},
            {"_id": 0, "student_id": 1}
        )

        if not student:
            return jsonify({
                "exists": False,
                "message": "Student not found"
            }), 404

        return jsonify({
            "exists": True,
            "message": "Student exists"
        }), 200

    except Exception as e:
        print("Student check error:", e)
        return jsonify({
            "exists": False,
            "message": "Server error"
        }), 500
@app.route("/verify-entry-face", methods=["POST"])

@app.route("/admin/daily-entries", methods=["GET"])
def get_daily_entries():
    try:
        # Get today's date in IST
        system = get_system_date_time()
        today = system["date"]

        # Count from active logs
        active_count = db.studentlogs.count_documents({
            "entryDate": today
        })

        # Count from history logs
        history_count = db.studentloghistory.count_documents({
            "entryDate": today
        })

        total_entries = active_count + history_count

        return jsonify({
            "date": today,
            "activeEntries": active_count,
            "historyEntries": history_count,
            "totalEntries": total_entries
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
# =========================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)

