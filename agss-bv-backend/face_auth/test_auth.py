from auth_engine import verify_student

tests = [
    (True, 1),    # valid face + blink
    (True, 0),    # face ok, no blink
    (False, 1),   # no face, blink
    (False, 0)    # nothing ok
]

for face_match, blink in tests:
    result = verify_student(face_match, blink)
    print(face_match, blink, "→", result)
