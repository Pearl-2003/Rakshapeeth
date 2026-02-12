import cv2
import easyocr
import re
from ultralytics import YOLO
import os

# (venv) (base) priyalyadav@Priyals-MacBook-Air agss-bv-backend % uvicorn main:app --port 4000 --reload


# configuration of the model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    BASE_DIR, "runs", "detect", "train", "weights", "best.pt"
)

# initialization 
PLATE_REGEX = r'^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$'
MIN_OCR_CONF = 0.4

# loading the model
reader = easyocr.Reader(['en'], gpu=False)
model = YOLO(MODEL_PATH)

# functions to clean the output
def clean_text(text: str) -> str:
    return re.sub(r'[^A-Z0-9]', '', text.upper())

def remove_ind(text: str) -> str:
    if text.startswith(("IND", "1ND", "IN0")):
        return text[3:]
    return text

def basic_correction(text: str) -> str:
    return (
        text.replace('O', '0')
            .replace('I', '1')
            .replace('L', '4')
            .replace('Z', '2')
            .replace('S', '5')
            .replace('B', '8')
    )

# MAIN Detect ONE-LINE number plate from image
def process_four_wheeler(frame):
    
    results = model(frame, conf=0.4, imgsz=640, device="cpu", verbose=False)

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            plate = frame[y1:y2, x1:x2]
            if plate.size == 0:
                continue

            gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)

            if gray.shape[1] < 300:
                gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

            _, gray = cv2.threshold(
                gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
            )

            ocr = reader.readtext(
                gray,
                detail=1,
                paragraph=False,
                allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            )

            if not ocr:
                continue

            texts = []
            confs = []

            for _, text, conf in ocr:
                if conf >= MIN_OCR_CONF:
                    texts.append(text)
                    confs.append(conf)

            if not texts:
                continue

            raw = clean_text("".join(texts))
            raw = remove_ind(raw)
            corrected = basic_correction(raw)

            # Validation (not filtering!)
            if re.fullmatch(PLATE_REGEX, corrected):
                return {
                    "plate": corrected,
                    "confidence": round(sum(confs)/len(confs), 2),
                    "status": "Detected"
                }

            # Fallback: return best OCR even if regex fails
            return {
                "plate": corrected,
                "confidence": round(sum(confs)/len(confs), 2),
                "status": "Detected (unverified)"
            }

    return {"plate": "", "confidence": 0, "status": "No plate detected"}
