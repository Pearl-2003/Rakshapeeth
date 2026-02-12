import cv2
import os
import numpy as np

# Load face cascade
face_cascade = cv2.CascadeClassifier(
    "haarcascade_frontalface_default.xml"
)

# Create LBPH recognizer
recognizer = cv2.face.LBPHFaceRecognizer_create()

faces = []
labels = []

DATASET_PATH = "dataset"
os.makedirs(DATASET_PATH, exist_ok=True)

print("📸 Press 'c' to capture face (enroll)")
print("❌ Press 'q' to quit")

cap = cv2.VideoCapture(0)

user_id = 1  # for now, single user demo
count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    detected_faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in detected_faces:
        face = gray[y:y+h, x:x+w]
        cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('c'):
            faces.append(face)
            labels.append(user_id)
            count += 1
            print(f"✅ Face sample captured: {count}")

    cv2.imshow("STEP 4: Face Enrollment", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

if len(faces) >= 3:
    recognizer.train(faces, np.array(labels))
    recognizer.save("face_model.yml")
    print("🎉 Face model trained & saved")
else:
    print("⚠️ Capture at least 3 face samples")
