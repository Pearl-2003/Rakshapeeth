# main.py (PHASE 1 - PURE ANPR ONLY)

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np

from NumberPlateScan.anpr_services import scan_plate_image

from database.mongo import vehicle_logs_collection
from bson import ObjectId
from datetime import datetime

app = FastAPI(title="ANPR ONLY")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SCAN PLATE ----------------
@app.post("/scan_plate")
async def scan_plate(
    image: UploadFile = File(...),
    vehicle_type: str = Form("four")
):
    try:
        contents = await image.read()
        np_arr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return JSONResponse(
                status_code=400,
                content={
                    "plate": None,
                    "confidence": 0,
                    "status": "ERROR",
                    "category": "MANUAL",
                    "message": "Invalid image"
                }
            )

        # ✅ PURE ANPR + ACCESS CHECK
        result = scan_plate_image(frame, vehicle_type)

        # 🔥 RETURN FULL RESULT (DO NOT FILTER)
        return JSONResponse(content=result)

    except Exception as e:
        print("❌ ANPR ERROR:", e)
        return JSONResponse(
            status_code=500,
            content={
                "plate": None,
                "confidence": 0,
                "status": "ERROR",
                "category": "MANUAL",
                "message": "Server error during scan"
            }
        )

# for vehicle logs     
def serialize(doc):
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    if isinstance(doc, dict):
        return {k: serialize(v) for k, v in doc.items()}
    if isinstance(doc, list):
        return [serialize(i) for i in doc]
    return doc
@app.get("/vehicle-logs")
async def get_vehicle_logs(
    page: int = 1,
    limit: int = 10,
    status: str = "all"
):
    skip = (page - 1) * limit

    query = {}
    if status != "all":
        query["status"] = status

    logs = (
        vehicle_logs_collection
        .find(query)
        .sort("timestamp", -1)
        .skip(skip)
        .limit(limit)
    )

    data = [serialize(log) for log in logs]

    total = vehicle_logs_collection.count_documents(query)

    return {
        "data": data,
        "total": total,
        "page": page,
        "limit": limit
    }