import os
import cv2
import numpy as np

# --------------------------------------------------
# Base directory (face_auth folder)
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# --------------------------------------------------
# Absolute paths for cascades & model
# --------------------------------------------------
FACE_CASCADE_PATH = os.path.join(BASE_DIR, "haarcascade_frontalface_default.xml")
EYE_CASCADE_PATH = os.path.join(BASE_DIR, "haarcascade_eye.xml")
DEFAULT_MODEL_PATH = os.path.join(BASE_DIR, "face_model.yml")

# --------------------------------------------------
# Load cascades ONCE (safe)
# --------------------------------------------------
face_cascade = cv2.CascadeClassifier(FACE_CASCADE_PATH)
eye_cascade = cv2.CascadeClassifier(EYE_CASCADE_PATH)

AUTHORIZED_THRESHOLD = 70  # lower = stricter


# --------------------------------------------------
# MAIN FUNCTION USED BY BACKEND (STEP 5)
# --------------------------------------------------
def verify_face(frame, model_path=None):
    """
    Verifies a face using LBPH recognizer.

    Args:
        frame (numpy.ndarray): BGR image (from live camera / uploaded frame)
        model_path (str): Path to trained LBPH model (.yml)

    Returns:
        bool: True if authorized, False otherwise
    """

    if model_path is None:
        model_path = DEFAULT_MODEL_PATH

    if not os.path.exists(model_path):
        print(f"[ERROR] Face model not found: {model_path}")
        return False

    # --------------------------------------------------
    # Load recognizer INSIDE function (IMPORTANT)
    # --------------------------------------------------
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(model_path)

    # --------------------------------------------------
    # Convert to grayscale
    # --------------------------------------------------
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # --------------------------------------------------
    # Detect face
    # --------------------------------------------------
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Must be exactly one face
    if len(faces) != 1:
        return False

    (x, y, w, h) = faces[0]
    face_roi = gray[y:y + h, x:x + w]

    # --------------------------------------------------
    # Eye validation (stability check)
    # --------------------------------------------------
    eyes = eye_cascade.detectMultiScale(face_roi)
    if len(eyes) < 1:
        return False

    # --------------------------------------------------
    # Predict
    # --------------------------------------------------
    label, confidence = recognizer.predict(face_roi)

    # Lower confidence = better match
    if confidence < AUTHORIZED_THRESHOLD:
        return True

    return False
