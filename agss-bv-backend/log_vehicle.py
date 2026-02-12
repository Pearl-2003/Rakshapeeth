
from database.vehicle_log import fetch_vehicle_logs
from bson import ObjectId
from datetime import datetime

def serialize_logs(data):
    if isinstance(data, list):
        return [serialize_logs(i) for i in data]
    if isinstance(data, dict):
        return {k: serialize_logs(v) for k, v in data.items()}
    if isinstance(data, ObjectId):
        return str(data)
    if isinstance(data, datetime):
        return data.isoformat()
    return data

def get_vehicle_logs(page=1, limit=10, status="all"):
    raw_data = fetch_vehicle_logs(page, limit, status)
    return serialize_logs(raw_data)