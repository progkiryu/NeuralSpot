from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .services import say_hello, analyze_stroke, send_emergency_sms  # ADDED send_emergency_sms here
import os

api = Blueprint("api", __name__)

# Put uploaded images in a known folder under the server root.
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "upload")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

# This line is for TensorFlow - you can remove or keep it
MODEL_PATH = os.path.join(BASE_DIR, "model", "stroke_model_final.h5")

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@api.route("/", methods=["GET"])
def home():
    print("API is running!")
    return jsonify({"message": "API is running"})


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

# ============================================
# NEW STROKE DETECTION ENDPOINT
# ============================================
@api.route("/analyze-stroke", methods=["POST"])
def analyze_stroke_route():
    """Upload and analyze image for stroke detection"""
    # Check if file exists
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # Save file temporarily
    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    try:
        # Analyze the image using your PyTorch model
        result = analyze_stroke(save_path)  # This calls your services.py function
        
        # Return the result
        if result['success']:
            return jsonify(result)
        else:
            return jsonify({"error": result['error']}), 500
    
    finally:
        # Always clean up - remove temp file
        if os.path.exists(save_path):
            os.remove(save_path)

# ============================================
# EMERGENCY SMS ENDPOINT
# ============================================
@api.route("/send-emergency-sms", methods=["POST"])
def send_emergency_sms_route():
    """Send emergency SMS to contacts when stroke is detected"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'user_name' not in data or 'phone_numbers' not in data:
            return jsonify({"error": "Missing required fields: user_name and phone_numbers"}), 400
        
        user_name = data['user_name']
        phone_numbers = data['phone_numbers']
        
        # Validate phone_numbers is a list
        if not isinstance(phone_numbers, list):
            return jsonify({"error": "phone_numbers must be a list"}), 400
        
        # Validate we have at least one number
        if len(phone_numbers) == 0:
            return jsonify({"error": "At least one phone number is required"}), 400
        
        # Validate user_name is not empty
        if not user_name.strip():
            return jsonify({"error": "user_name cannot be empty"}), 400
        
        # Send the SMS
        result = send_emergency_sms(user_name.strip(), phone_numbers)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify({"error": result['error']}), 500
            
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
            