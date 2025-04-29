from pymongo import MongoClient
from app.config import Config

client = MongoClient(Config.MONGO_URI)
db = client['newsdb']

def ping_db():
    """
    Check the connection to the MongoDB database.
    """
    try:
        client.admin.command('ping')
        print("MongoDB connection is successful.")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")