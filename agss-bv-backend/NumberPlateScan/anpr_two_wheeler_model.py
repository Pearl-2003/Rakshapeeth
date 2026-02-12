import cv2
import easyocr
import re
from ultralytics import YOLO
from collections import Counter
import os
import difflib

# (venv) (base) priyalyadav@Priyals-MacBook-Air agss-bv-backend % uvicorn main:app --port 4000 --reload


#  CONFIG 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "runs", "detect", "train", "weights", "best.pt")
MIN_OCR_CONF = 0  # ignore low-confidence OCR results

#  VALIDATION DATA for states
VALID_STATES = [
    "AP","AR","AS","BR","CG","GA","GJ","HR","HP","JK","JH",
    "KA","KL","MP","MH","MN","ML","MZ","NL","OD","PB","RJ",
    "SK","TN","TS","TR","UK","UP","WB","DL","CH","DN","DD",
    "LD","PY"
]

def is_valid_district(district: str) -> bool:
    if not district.isdigit():
        return False
    n = int(district)
    return 1 <= n <= 99

def is_valid_series(series: str) -> bool:
    return 1 <= len(series) <= 2 and series.isalpha()

#  SEGMENT CORRECTION 
def correct_state(ocr_state: str) -> str:
    ocr_state = ocr_state.upper()
    match = difflib.get_close_matches(ocr_state, VALID_STATES, n=1, cutoff=0.5)
    return match[0] if match else ocr_state

def correct_district(ocr_district: str) -> str:
    corrections = ocr_district.upper().replace('O', '0').replace('I', '1').replace('L','1').replace('Z','2')
    return corrections if is_valid_district(corrections) else ocr_district

def correct_series(ocr_series: str) -> str:
    corrections = ocr_series.upper().replace('0','O').replace('1','I')
    return corrections if is_valid_series(corrections) else ocr_series

def correct_number(number: str) -> str:
    return number.replace('O','0').replace('I','1').replace('L','1').replace('S','5') \
                 .replace('B','8').replace('G','6').replace('F','4')

def clean_text(text: str) -> str:
    return re.sub(r'[^A-Z0-9]', '', text.upper())

def smart_correct_plate(text: str) -> str:
    text = clean_text(text)
    if len(text) < 8:
        return text  # fallback

# Segments
    state = correct_state(text[:2])
    district = correct_district(text[2:4])
    series = correct_series(text[4:6])
    number = correct_number(text[6:10])

    return f"{state}{district}{series}{number}"

#  INITIALIZATION 
print("🔄 Loading EasyOCR...")
reader = easyocr.Reader(['en'], gpu=False)

print("🔄 Loading YOLOv8 model...")
model = YOLO(MODEL_PATH)

#  MAIN FUNCTION Detects number plates (single or two-line), applies segment-wise corrections,
#  and returns final plate with confidence.
def process_two_wheeler(frame):
    
    print("Inside process_image");
    results = model(frame, conf=0.4, imgsz=640, device="cpu", verbose=False)
    #print("Result of model", results);

    for r in results:
        #print("What is r:", r);
        for box in r.boxes:
            # print("Array box:", box.xyxy[0]);
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            plate_img = frame[y1:y2, x1:x2]
            # print("Plate Img", plate_img);
            gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
            if gray.shape[1] < 300:
                gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
            _, gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

#  Split for two-line OCR 
            h = gray.shape[0]
            top_half = gray[:h//2, :]
            bottom_half = gray[h//2:, :]
            # print("1");
            ocr_results_top = reader.readtext(
                top_half, detail=1, paragraph=False,
                allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            )
            ocr_results_bottom = reader.readtext(
                bottom_half, detail=1, paragraph=False,
                allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            )
            # print("2", ocr_results_top, ocr_results_bottom);
            # print("top", top_half);
            # print("bottom", bottom_half);
            if not ocr_results_top and not ocr_results_bottom:
                return {"plate": "", "confidence": 0, "status": "No plate detected"}

#  Combine top & bottom 
            combined_texts = []
            confs = []
            # print("3");
            for ocr_results in [ocr_results_top, ocr_results_bottom]:
                print("OCR Results:", ocr_results);
                for bbox, text, conf in ocr_results:
                    print("Conf Score:", conf);
                    if conf >= MIN_OCR_CONF:
                        combined_texts.append(clean_text(text))
                        confs.append(conf)
            # print("4: ",combined_texts);
            if not combined_texts:
                return {"plate": "", "confidence": 0, "status": "No plate detected"}

            raw_plate = "".join(combined_texts)
            plate_text = smart_correct_plate(raw_plate)
            avg_conf = sum(confs)/len(confs)
            # print("5");
            return {"plate": plate_text, "confidence": avg_conf, "status": "Detected"}

    return {"plate": "", "confidence": 0, "status": "No plate detected"}
