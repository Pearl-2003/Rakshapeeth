from NumberPlateScan.plate_access_service import check_plate_access
from NumberPlateScan.anpr_four_wheeler_model import process_four_wheeler
from NumberPlateScan.anpr_two_wheeler_model import process_two_wheeler


def scan_plate_image(frame, vehicle_type="four"):
    result = (
        process_two_wheeler(frame)
        if vehicle_type == "two"
        else process_four_wheeler(frame)
    )

    plate = result.get("plate")
    confidence = result.get("confidence", 0)

    if not plate:
        return {
            "plate": None,
            "confidence": confidence,
            "status": "NOT_DETECTED",
            "message": "Plate not detected. Please retry or enter manually."
        }

    access = check_plate_access(plate)

    return {
        "plate": plate,
        "confidence": confidence,
        **access
    }

