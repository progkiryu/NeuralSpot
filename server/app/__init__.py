from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    from .routes import api
    app.register_blueprint(api)

    CORS(app, origins=["http://localhost:5173", "https://neuralspot.vercel.app"])

    return app