from flask import Blueprint, jsonify
from db import students

verify_context_bp = Blueprint("verify_context", __name__)

@verify_context_bp.route("/api/verify-context/<student_id>", methods=["GET"])
def verify_context(student_id):
    student = students.find_one({"student_id": student_id})

    if not student:
        return jsonify({
            "success": False,
            "message": "Student not found"
        }), 404

    if not student.get("faceRegistered"):
        return jsonify({
            "success": False,
            "message": "Face not registered"
        }), 400

    if "faceLabel" not in student:
        return jsonify({
            "success": False,
            "message": "Face label missing"
        }), 500

    return jsonify({
        "success": True,
        "faceLabel": student["faceLabel"]
    }), 200
