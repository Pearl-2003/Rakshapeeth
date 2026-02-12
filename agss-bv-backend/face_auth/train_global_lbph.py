import cv2
import os
import numpy as np

DATASET_DIR = "face_auth/dataset"
MODEL_PATH = "face_auth/global_lbph_model.yml"

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

faces = []
labels = []

for label_name in os.listdir(DATASET_DIR):
    label_path = os.path.join(DATASET_DIR, label_name)

    if not os.path.isdir(label_path):
        continue

    label = int(label_name)

    for img_name in os.listdir(label_path):
        img_path = os.path.join(label_path, img_name)

        img = cv2.imread(img_path)
        if img is None:
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        detected_faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5
        )

        for (x, y, w, h) in detected_faces:
            face = gray[y:y+h, x:x+w]
            face = cv2.resize(face, (200, 200))
            faces.append(face)
            labels.append(label)

faces = np.array(faces)
labels = np.array(labels)

if len(faces) == 0:
    raise Exception("❌ No faces found in dataset")

model = cv2.face.LBPHFaceRecognizer_create(
    radius=1,
    neighbors=8,
    grid_x=8,
    grid_y=8
)

model.train(faces, labels)
model.save(MODEL_PATH)

print("✅ Global LBPH trained")
print("Total faces:", len(faces))
