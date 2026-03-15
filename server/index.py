from pyngrok import ngrok, conf
from dotenv import load_dotenv
from app import create_app
import threading
import os

load_dotenv()

conf.get_default().auth_token = os.getenv("NGROK_AUTH_TOKEN")

app = create_app()

# Start ngrok tunnel
public_url = ngrok.connect(5000)
print(f"Public URL (ngrok): {public_url}")

# Run Flask in a thread (so pyngrok prints URL first)
def run_app():
    app.run(host="0.0.0.0", port=5000)

thread = threading.Thread(target=run_app)
thread.start()