# routes/face_verify.py
from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import os

from db import students

face_verify_bp = Blueprint("face_verify", __name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "face_auth", "global_lbph_model.yml")

CONFIDENCE_THRESHOLD = 65

model = cv2.face.LBPHFaceRecognizer_create()
model.read(MODEL_PATH)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

@face_verify_bp.route("/face-verify-frame", methods=["POST"])
def face_verify_frame():
    file = request.files.get("image")

    if not file:
        return jsonify({"success": False, "message": "image required"}), 400

    img_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(img_bytes, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({"success": False, "message": "Invalid image"}), 400

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) != 1:
        return jsonify({"success": False, "message": "Exactly one face required"}), 400

    x, y, w, h = faces[0]
    face = gray[y:y+h, x:x+w]

# Normalize lighting
    face = cv2.equalizeHist(face)

# Standard size
    face = cv2.resize(face, (200, 200))

    label, confidence = model.predict(face)

    return jsonify({
        "success": True,
        "predictedLabel": int(label),
        "confidence": round(confidence, 2)
    }), 200
