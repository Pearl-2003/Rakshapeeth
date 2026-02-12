import re
from database.mongo import (
    whitelist_collection,
    blacklist_collection,
    occasional_collection
)

def normalize_plate(plate: str) -> str:
    if not plate:
        return ""

    plate = plate.upper()
    plate = re.sub(r"[^A-Z0-9]", "", plate)
    return plate


def check_plate_access(plate: str):
    if not plate:
        return {
            "status": "RETRY",
            "message": "Plate not detected. Retry scan or manual entry required"
        }

    plate = normalize_plate(plate)

    # print(f"🔍 Checking access for plate: {plate}")
    # print("📋 Whitelist Collection:", whitelist_collection.count_documents({}))
    # print("📋 Blacklist Collection:", blacklist_collection.count_documents({}))
    # print("📋 Occasional Collection:", occasional_collection.count_documents({}))
    
    if blacklist_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "DENIED",
            "source": "BLACKLIST",
            "message": "Blacklisted vehicle ❌"
        }

    if whitelist_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "ALLOWED",
            "source": "WHITELIST",
            "message": "Whitelisted vehicle ✅"
        }

    if occasional_collection.find_one({"vehicleNo": plate}):
        return {
            "status": "ALLOWED",
            "source": "OCCASIONAL",
            "message": "Occasional entry allowed 🟡"
        }

    return {
        "status": "MANUAL",
        "message": "Vehicle not found. Manual verification required"
    }
