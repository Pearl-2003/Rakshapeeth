from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"
#MONGO_URLI = "mongodb+srv://agssbvuser:agssbvpassword@cluster0.123456789.mongodb.net/AGSS_BV"

client = MongoClient(MONGO_URI)

db = client["AGSS_BV"]

whitelist_collection = db["whitelists"]
blacklist_collection = db["blacklists"]
occasional_collection = db["occasionalvisitors"]
vehicle_logs_collection = db["vehicle_logs"]