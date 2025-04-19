import os
from dotenv import load_dotenv
from pymongo import MongoClient

mongo = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/newzz'))
db = mongo.get_database()
print(db)