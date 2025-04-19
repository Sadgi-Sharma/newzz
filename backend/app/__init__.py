from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import cloudinary
import cloudinary.uploader
from config import Config
from authlib.integrations.flask_client import OAuth

# Initialize Flask App
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Initialize OAuth
oauth = OAuth(app)
oauth.register(
    "auth0",
    client_id=Config.AUTH0_CLIENT_ID,
    client_secret=Config.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{Config.AUTH0_DOMAIN}/.well-known/openid-configuration'
)

# Initialize MongoDB
mongo = MongoClient(app.config["MONGO_URI"])
db = mongo.get_database('news_app')

# Initialize Cloudinary
cloudinary.config(
    cloud_name=app.config["CLOUDINARY_CLOUD_NAME"],
    api_key=app.config["CLOUDINARY_API_KEY"],
    api_secret=app.config["CLOUDINARY_API_SECRET"]
)

# Import blueprints
from app.routes import main
from app.auth import auth
app.register_blueprint(main)
app.register_blueprint(auth)

