from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["AGSS_BV"]

# 🔥 New schema (collection)
students = db["students_v2"]
