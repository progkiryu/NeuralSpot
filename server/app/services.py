import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os
import numpy as np

# ============================================
# DEFINE THE MODEL ARCHITECTURE (same as training)
# ============================================
class StrokeCNN(nn.Module):
    def __init__(self):
        super(StrokeCNN, self).__init__()
        
        # Block 1
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 32, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.dropout1 = nn.Dropout(0.25)
        
        # Block 2
        self.conv3 = nn.Conv2d(32, 64, 3, padding=1)
        self.bn3 = nn.BatchNorm2d(64)
        self.conv4 = nn.Conv2d(64, 64, 3, padding=1)
        self.bn4 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(2, 2)
        self.dropout2 = nn.Dropout(0.25)
        
        # Block 3
        self.conv5 = nn.Conv2d(64, 128, 3, padding=1)
        self.bn5 = nn.BatchNorm2d(128)
        self.conv6 = nn.Conv2d(128, 128, 3, padding=1)
        self.bn6 = nn.BatchNorm2d(128)
        self.pool3 = nn.MaxPool2d(2, 2)
        self.dropout3 = nn.Dropout(0.25)
        
        # Block 4
        self.conv7 = nn.Conv2d(128, 256, 3, padding=1)
        self.bn7 = nn.BatchNorm2d(256)
        self.conv8 = nn.Conv2d(256, 256, 3, padding=1)
        self.bn8 = nn.BatchNorm2d(256)
        self.pool4 = nn.MaxPool2d(2, 2)
        self.dropout4 = nn.Dropout(0.25)
        
        # Classifier
        self.fc1 = nn.Linear(256 * 14 * 14, 512)
        self.bn9 = nn.BatchNorm1d(512)
        self.dropout5 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, 128)
        self.bn10 = nn.BatchNorm1d(128)
        self.dropout6 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(128, 1)
        
    def forward(self, x):
        # Block 1
        x = torch.relu(self.bn1(self.conv1(x)))
        x = torch.relu(self.bn2(self.conv2(x)))
        x = self.pool1(x)
        x = self.dropout1(x)
        
        # Block 2
        x = torch.relu(self.bn3(self.conv3(x)))
        x = torch.relu(self.bn4(self.conv4(x)))
        x = self.pool2(x)
        x = self.dropout2(x)
        
        # Block 3
        x = torch.relu(self.bn5(self.conv5(x)))
        x = torch.relu(self.bn6(self.conv6(x)))
        x = self.pool3(x)
        x = self.dropout3(x)
        
        # Block 4
        x = torch.relu(self.bn7(self.conv7(x)))
        x = torch.relu(self.bn8(self.conv8(x)))
        x = self.pool4(x)
        x = self.dropout4(x)
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        # Classifier
        x = torch.relu(self.bn9(self.fc1(x)))
        x = self.dropout5(x)
        x = torch.relu(self.bn10(self.fc2(x)))
        x = self.dropout6(x)
        x = torch.sigmoid(self.fc3(x))
        
        return x

# ============================================
# LOAD THE TRAINED MODEL
# ============================================

# Get the model path - now looking for .pth file
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'best_stroke_model.pth')  # Use best model from training

print(f"🔍 Looking for PyTorch model at: {MODEL_PATH}")

# Set device
device = torch.device('mps' if torch.backends.mps.is_available() else 'cpu')
print(f"Using device: {device}")

# Load model
print("🔄 Loading stroke detection model...")
try:
    # Create model instance
    model = StrokeCNN().to(device)
    
    # Load trained weights
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()  # Set to evaluation mode
    print("✅ PyTorch model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Image preprocessing (must match training preprocessing)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def say_hello():
    print("Hello World from service!")
    return "Hello World"

def analyze_stroke(image_path):
    """
    Analyze an image for stroke signs using PyTorch
    Args: image_path - path to the image file
    Returns: dict with prediction results
    """
    print(f"🔍 Analyzing image: {image_path}")
    
    # Check if model loaded
    if model is None:
        return {
            'success': False,
            'error': 'Model not loaded'
        }
    
    try:
        # Load and preprocess image
        img = Image.open(image_path).convert('RGB')
        print(f"📸 Image loaded: {img.size}")
        
        # Apply transforms
        tensor = transform(img).unsqueeze(0).to(device)
        print(f"🔢 Tensor shape: {tensor.shape}")
        
        # Make prediction
        print("🤖 Running prediction...")
        with torch.no_grad():
            output = model(tensor)
            probability = output.item()
        
        print(f"📊 Raw prediction: {probability}")
        
        # Calculate confidence
        if probability > 0.5:
            confidence = probability * 100
            detected = True
            print(f"⚠️ Stroke detected with {confidence:.1f}% confidence")
        else:
            confidence = (1 - probability) * 100
            detected = False
            print(f"✅ No stroke detected with {confidence:.1f}% confidence")
        
        return {
            'success': True,
            'stroke_risk': float(probability),
            'detected': detected,
            'confidence': float(confidence)
        }
    
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return {
            'success': False,
            'error': str(e)
        }

from __future__ import print_function
import clicksend_client
from clicksend_client.rest import ApiException

# 1. Configuration
configuration = clicksend_client.Configuration()
configuration.username = 'edwardsouza143@gmail.com'
configuration.password = '2443CFA6-2C78-9866-CC36-5E7CA823587F'

# 2. Create an instance of the SMS API
api_instance = clicksend_client.SMSApi(clicksend_client.ApiClient(configuration))

def send_emergency_sms(user_name: str, phone_numbers: list):
    """
    Send emergency SMS to contacts when stroke is detected
    Args:
        user_name: Name of the person suspected of having a stroke
        phone_numbers: List of phone numbers to send to (up to 10)
    Returns: dict with success status and message
    """
    try:
        # Limit to 10 numbers as requested
        phone_numbers = phone_numbers[:10]
        
        # Create the message
        message_body = f"{user_name} is suspected to be having a stroke and has chosen you as one of their emergency contacts. Please contact relevant emergency services and aid them in any way."
        
        # Create SMS messages
        messages = []
        for num in phone_numbers:
            # Ensure number starts with +
            if not num.startswith('+'):
                num = '+' + num
            
            msg = clicksend_client.SmsMessage(
                source="NeuralSpot",
                body=message_body,
                to=num
            )
            messages.append(msg)
        
        # Wrap in collection
        sms_messages = clicksend_client.SmsMessageCollection(messages=messages)
        
        # Send the batch
        api_response = api_instance.sms_send_post(sms_messages)
        
        return {
            'success': True,
            'message': f'Emergency SMS sent to {len(phone_numbers)} contacts',
            'response': str(api_response)
        }
        
    except ApiException as e:
        return {
            'success': False,
            'error': f'ClickSend API error: {str(e)}'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }