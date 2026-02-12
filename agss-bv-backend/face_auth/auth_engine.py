def verify_student(face_match: bool, blink_count: int):
    """
    Returns final decision for AGSS-BV
    """

    if not face_match:
        return {
            "allowed": False,
            "reason": "Face not recognized"
        }

    if blink_count < 1:
        return {
            "allowed": False,
            "reason": "Liveness failed"
        }

    return {
        "allowed": True,
        "reason": "Authentication successful"
    }
