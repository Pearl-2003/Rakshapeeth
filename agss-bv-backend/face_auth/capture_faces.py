import cv2
import os

# ========= CONFIG =========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

FACE_LABEL = input("Enter faceLabel (numeric): ").strip()
MAX_IMAGES = 8
# ==========================

student_dir = os.path.join(DATASET_DIR, FACE_LABEL)
os.makedirs(student_dir, exist_ok=True)

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

cap = cv2.VideoCapture(0)

count = 0
print("\n🎥 Camera ON")
print("➡ Press SPACE to capture image")
print("➡ Press Q to quit\n")

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Camera not working")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=5,
        minSize=(100, 100)
    )

    face_roi = None

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        face_roi = gray[y:y+h, x:x+w]
        face_roi = cv2.resize(face_roi, (200, 200))
        break  # only one face

    # UI text
    cv2.putText(
        frame,
        f"Captured: {count}/{MAX_IMAGES}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 0, 0),
        2
    )

    cv2.imshow("AGSS-BV Face Registration", frame)

    key = cv2.waitKey(1) & 0xFF

    # ✅ SPACE → capture
    if key == 32 and face_roi is not None:
        count += 1
        img_path = os.path.join(student_dir, f"img{count}.jpg")
        cv2.imwrite(img_path, face_roi)
        print(f"✅ Image {count} captured")

    # ✅ q → quit
    elif key == ord('q'):
        print("👋 Quit pressed")
        break

    if count >= MAX_IMAGES:
        print("\n🎉 Required images captured")
        break

cap.release()
cv2.destroyAllWindows()

print(f"\n📁 Images saved at: dataset/{FACE_LABEL}")
print("➡ Now run train_global_lbph.py")
