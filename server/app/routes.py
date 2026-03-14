from flask import Blueprint, request, jsonify
from .services import say_hello
import os

api = Blueprint("api", __name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/hello", methods=["GET"])
def hello():
    message = say_hello()
    return {"message": message}

@api.route("/photo", methods=["POST"])
def photo():
    file = request.files["file"]
    
    message = "received"
    return {"message": message}
