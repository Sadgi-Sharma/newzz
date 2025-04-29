from dotenv import load_dotenv
import os

load_dotenv()

class Config:
   
    APP_SECRET_KEY = os.getenv('APP_SECRET_KEY')
    
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/newzz')

    NEWS_API_URL = "https://newsdata.io/api/1/latest"
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")

    SENTIMENTAL_MODEL_PATH = "./model/sentimental_model"