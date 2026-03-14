import tensorflow as tf
import os

print("🚀 Loading model...")
model = tf.keras.models.load_model('stroke_model_final.h5')
print("✅ Model loaded!")

# Create output directory
os.makedirs('website/public/models', exist_ok=True)

# Install tensorflowjs if needed
try:
    import tensorflowjs as tfjs
    print("�� Converting with tensorflowjs...")
    tfjs.converters.save_keras_model(model, 'website/public/models/')
except ImportError:
    print("📦 Installing tensorflowjs...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'tensorflowjs'])
    import tensorflowjs as tfjs
    print("🔄 Converting with tensorflowjs...")
    tfjs.converters.save_keras_model(model, 'website/public/models/')

print("✅ Conversion complete!")

# List files
print("\n📁 Files created:")
for f in os.listdir('website/public/models/'):
    print(f"   - {f}")
