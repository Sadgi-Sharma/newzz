from flask import Blueprint, request, jsonify
from app.models import User
import cloudinary.uploader

main : Blueprint = Blueprint("main", __name__)

@main.route("/")
def hello():
    return jsonify({"message":"Hello World"})
