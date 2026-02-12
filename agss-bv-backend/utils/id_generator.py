def generate_student_id(students_collection):
    PREFIX = "BTBTC23"

    # Find last registered student
    last_student = students_collection.find_one(
        {"student_id": {"$regex": f"^{PREFIX}"}},
        sort=[("student_id", -1)]
    )

    if not last_student:
        next_number = 1
    else:
        last_id = last_student["student_id"]  # e.g. BTBTC23007
        last_number = int(last_id[-3:])       # 7
        next_number = last_number + 1

    return f"{PREFIX}{str(next_number).zfill(3)}"
