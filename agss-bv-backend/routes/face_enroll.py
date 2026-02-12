# routes/face_enroll.py
from flask import Blueprint, request, jsonify, make_response
import cv2
import numpy as np
import os

from db import students
from utils.enroll_session import enroll_sessions

face_enroll_bp = Blueprint("face_enroll", __name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "..", "face_auth", "dataset")

# =========================
# STEP 2 — INIT ENROLLMENT
# =========================
@face_enroll_bp.route("/face-enroll/init", methods=["POST"])
def init_face_enrollment():
    data = request.get_json(silent=True) or {}

    student_id = data.get("student_id")
    consent = data.get("consent")

    if not student_id:
        return jsonify({"success": False, "message": "student_id required"}), 400

    if consent is not True:
        return jsonify({"success": False, "message": "Consent required"}), 400

    student = students.find_one({"student_id": student_id})
    if not student:
        return jsonify({"success": False, "message": "Student not found"}), 404

    if student.get("faceRegistered"):
        return jsonify({"success": False, "message": "Face already registered"}), 409

    enroll_sessions[student_id] = []

    return jsonify({
        "success": True,
        "message": "Face enrollment started",
        "nextStep": "SEND_FACE_SAMPLES"
    }), 200


# =========================
# STEP 3 — CAPTURE SAMPLE
# =========================
@face_enroll_bp.route("/face-enroll/sample", methods=["POST"])
def capture_face_sample():
    student_id = request.form.get("student_id")
    file = request.files.get("image")

    if not student_id or not file:
        return jsonify({"success": False, "message": "student_id and image required"}), 400

    if student_id not in enroll_sessions:
        return jsonify({"success": False, "message": "Enrollment not initialized"}), 400

    img_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"success": False, "message": "Invalid image"}), 400

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) != 1:
        return jsonify({
            "success": False,
            "message": "Exactly one face must be visible"
        }), 400

    enroll_sessions[student_id].append(frame)
    count = len(enroll_sessions[student_id])

    return jsonify({
        "success": True,
        "samplesCaptured": count,
        "samplesRequired": 5
    }), 200


# =========================
# STEP 4 — COMPLETE ENROLL
# =========================
@face_enroll_bp.route("/face-enroll/complete", methods=["POST", "OPTIONS"])
def complete_face_enrollment():
    if request.method == "OPTIONS":
        return make_response("", 200)

    data = request.get_json(silent=True) or {}
    student_id = data.get("student_id")

    student = students.find_one({"student_id": student_id})
    if not student:
        return jsonify({"success": False, "message": "Student not found"}), 404

    if student.get("faceRegistered"):
        return jsonify({
            "success": True,
            "message": "Face already registered",
            "nextStep": "VERIFY_READY"
        }), 200

    images = enroll_sessions.get(student_id, [])
    if len(images) < 5:
        return jsonify({"success": False, "message": "Insufficient samples"}), 400

    # 🔑 Assign NEW faceLabel
    last = students.find_one(
        {"faceLabel": {"$ne": None}},
        sort=[("faceLabel", -1)]
    )
    face_label = (last["faceLabel"] + 1) if last else 1

    student_dir = os.path.join(DATASET_DIR, str(face_label))
    os.makedirs(student_dir, exist_ok=True)

    for i, img in enumerate(images, start=1):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_path = os.path.join(student_dir, f"img{i}.jpg")
        cv2.imwrite(face_path, gray)

    students.update_one(
        {"student_id": student_id},
        {
            "$set": {
                "faceRegistered": True,
                "biometricStatus": "ACTIVE",
                "faceLabel": face_label
            }
        }
    )

    enroll_sessions.pop(student_id, None)

    return jsonify({
        "success": True,
        "message": "Face enrollment completed",
        "nextStep": "TRAIN_GLOBAL_MODEL"
    }), 200
