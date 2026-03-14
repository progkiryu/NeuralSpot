from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .services import say_hello
import os

api = Blueprint("api", __name__)

# Put uploaded images in a known folder under the server root.
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "upload")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

MODEL_PATH = os.path.join(BASE_DIR, "model", "stroke_model_final.h5")

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/hello", methods=["GET"])
def hello():
    message = say_hello()
    return {"message": message}

@api.route("/photo", methods=["POST"])
def photo():
    # if form data header is not provided, send 400
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    # if file name is blank, send 400
    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # if file name is not proper, send 400
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    # remove file after uploading
    if os.path.exists(save_path):
        os.remove(save_path)

    return jsonify({
        "message": "file uploaded",
        "filename": filename,
        "path": save_path
    })