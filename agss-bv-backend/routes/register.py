# routes/register.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from utils.id_generator import generate_student_id
from db import students

register_bp = Blueprint("register", __name__)

@register_bp.route("/register-student", methods=["POST"])
def register_student():
    try:
        required_fields = [
            "firstName", "lastName", "studentPhone",
            "fatherName", "fatherPhone",
            "motherName", "motherPhone",
            "course"
        ]

        for field in required_fields:
            if not request.form.get(field):
                return jsonify({
                    "success": False,
                    "message": f"{field} is required"
                }), 400

        student_id = generate_student_id(students)

        student_doc = {
            "student_id": student_id,

            "firstName": request.form.get("firstName"),
            "lastName": request.form.get("lastName"),
            "personalEmail": request.form.get("personalEmail"),
            "collegeEmail": request.form.get("collegeEmail"),
            "studentPhone": request.form.get("studentPhone"),
            "rollNo": request.form.get("rollNo"),
            "course": request.form.get("course"),

            "father": {
                "name": request.form.get("fatherName"),
                "email": request.form.get("fatherEmail"),
                "phone": request.form.get("fatherPhone")
            },

            "mother": {
                "name": request.form.get("motherName"),
                "email": request.form.get("motherEmail"),
                "phone": request.form.get("motherPhone")
            },

            "address": {
                "houseNo": request.form.get("houseNo"),
                "street": request.form.get("street"),
                "city": request.form.get("city"),
                "state": request.form.get("state"),
                "pincode": request.form.get("pincode")
            },

            "faceRegistered": False,
            "biometricStatus": "PENDING",
            "faceLabel": None,              # 🔥 REQUIRED FOR GLOBAL LBPH
            "createdAt": datetime.utcnow()
        }

        students.insert_one(student_doc)

        return jsonify({
            "success": True,
            "student_id": student_id,
            "message": "Student registered successfully",
            "nextStep": "FACE_CONSENT"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
