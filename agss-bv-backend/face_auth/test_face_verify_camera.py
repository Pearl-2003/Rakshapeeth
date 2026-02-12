import cv2
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "global_lbph_model.yml")

CONFIDENCE_THRESHOLD = 40

model = cv2.face.LBPHFaceRecognizer_create()
model.read(MODEL_PATH)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

cap = cv2.VideoCapture(0)

print("🎥 Face verification started")
print("➡ Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.3, minNeighbors=5
    )

    for (x, y, w, h) in faces:
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (200, 200))

        label, confidence = model.predict(face)

        if confidence < CONFIDENCE_THRESHOLD:
            text = f"Label: {label} ({confidence:.1f})"
            color = (0, 255, 0)
        else:
            text = f"Unknown ({confidence:.1f})"
            color = (0, 0, 255)

        cv2.rectangle(frame, (x,y), (x+w,y+h), color, 2)
        cv2.putText(
            frame, text, (x, y-10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2
        )
        break

    cv2.imshow("Face Verification Test", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
