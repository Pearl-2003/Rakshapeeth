from pymongo import MongoClient, DESCENDING
from datetime import datetime

MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["AGSS_BV"]

vehicle_log_collection = db["vehicle_logs"]


def insert_vehicle_scan(
    plate: str,
    category: str,
    source: str,
    scan_time: datetime,
    movement_type: str
):
    doc = {
        "vehicleNo": plate,
        "category": category,
        "source": source,
        "movementType": movement_type,
        "scanTime": scan_time
    }
    return vehicle_log_collection.insert_one(doc).inserted_id


def get_next_movement_type(plate: str):
    last = vehicle_log_collection.find_one(
        {"vehicleNo": plate},
        sort=[("scanTime", DESCENDING)]
    )
    if last and last["movementType"] == "ENTRY":
        return "EXIT"
    return "ENTRY"


def fetch_vehicle_logs(page=1, limit=10, status_filter="all"):
    query = {}
    if status_filter in ["ENTRY", "EXIT"]:
        query["movementType"] = status_filter

    skip = (page - 1) * limit

    logs = list(
        vehicle_log_collection
        .find(query)
        .sort("scanTime", DESCENDING)
        .skip(skip)
        .limit(limit)
    )

    inside = vehicle_log_collection.count_documents({"movementType": "ENTRY"})
    outside = vehicle_log_collection.count_documents({"movementType": "EXIT"})

    return {
        "logs": logs,
        "insideCount": inside,
        "outsideCount": outside
    }