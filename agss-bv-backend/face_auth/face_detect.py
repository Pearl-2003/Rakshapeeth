import cv2
import time

# Load cascades
face_cascade = cv2.CascadeClassifier(
    "haarcascade_frontalface_default.xml"
)
eye_cascade = cv2.CascadeClassifier(
    "haarcascade_eye.xml"
)

cap = cv2.VideoCapture(0)
print("✅ Camera started")

blink_count = 0
eyes_prev = True
last_blink_time = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray, 1.3, 5
    )

    for (x, y, w, h) in faces:
        cv2.rectangle(
            frame, (x, y), (x+w, y+h),
            (0, 255, 0), 2
        )

        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]

        eyes = eye_cascade.detectMultiScale(
            roi_gray, 1.1, 10
        )

        eyes_detected = len(eyes) >= 1

        # 🔴 BLINK LOGIC
        if eyes_prev and not eyes_detected:
            now = time.time()
            if now - last_blink_time > 0.5:   # debounce
                blink_count += 1
                last_blink_time = now

        eyes_prev = eyes_detected

        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(
                roi_color,
                (ex, ey),
                (ex+ew, ey+eh),
                (255, 0, 0),
                2
            )

    # Show blink count
    cv2.putText(
        frame,
        f"Blinks: {blink_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2
    )

    cv2.imshow("STEP 3: Blink Detection (Liveness)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
