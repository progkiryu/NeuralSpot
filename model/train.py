"""
train.py - Train stroke detection model
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

#============================================
# CONFIGURATION
#============================================

DATA_PATH = "data/processed"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20

#============================================
# LOAD DATA
#============================================

print("\n📂 Loading training data...")
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    f"{DATA_PATH}/train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='binary',
    seed=42,
    validation_split=None
)

print("📂 Loading validation data...")
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    f"{DATA_PATH}/validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='binary'
)

print("📂 Loading test data...")
test_ds = keras.preprocessing.image_dataset_from_directory(
    f"{DATA_PATH}/test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode='binary'
)

#Get class names
class_names = train_ds.class_names
print(f"\n📊 Classes: {class_names[0]} = 0, {class_names[1]} = 1")

#============================================
# NORMALISE DATA
#============================================

normalisation_layer = layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalisation_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalisation_layer(x), y))
test_ds = test_ds.map(lambda x, y: (normalisation_layer(x), y))

# Optimise for performance
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
test_ds = test_ds.cache().prefetch(buffer_size=AUTOTUNE)

print(f"\n✅ Data loaded:")
print(f"   Training batches: {len(train_ds)}")
print(f"   Validation batches: {len(val_ds)}")
print(f"   Test batches: {len(test_ds)}")

#============================================
# COUNT IMAGES IN EACH CLASS
#============================================

# Count images in each clas for class weights
train_stroke_path = Path(f"{DATA_PATH}/train/stroke")
train_normal_path = Path(f"{DATA_PATH}/train/normal")

num_stroke = len(list(train_stroke_path.glob('*.jpg'))) + len(list(train_stroke_path.glob('*.png')))
num_normal = len(list(train_normal_path.glob('*.jpg'))) + len(list(train_normal_path.glob('*.png')))

print(f"\n📊 Training data counts:")
print(f"   Stroke images: {num_stroke}")
print(f"   Normal images: {num_normal}")

# ============================================
# BUILD MODEL
# ============================================

model = keras.Sequential([
    # Input layer
    layers.Input(shape=(224, 224, 3)),
    
    # First convolutiona block
    layers.Conv2D(32, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2,2),
    layers.Dropout(0.25),
    
    # Second convolutional block
    layers.Conv2D(64, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2,2),
    layers.Dropout(0.25),
    
    # Third convolutional block
    layers.Conv2D(128, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(128, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2,2),
    layers.Dropout(0.25),
    
    # Fourth convolutional block
    layers.Conv2D(256, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.Conv2D(256, (3,3), padding='same', activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D(2,2),
    layers.Dropout(0.25),
    
    # Classifier
    layers.GlobalAveragePooling2D(),
    layers.Dense(512, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

# show model summary
model.summary()

#============================================
# COMPILE MODEL
#============================================

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
)

print("\n✅ Model compiled!")

# ============================================
# CALCULATE CLASS WEIGHTS
# ============================================

# Calculate class weights to handle imbalance
total_train = num_stroke + num_normal
weight_for_stroke = (1 / num_stroke) * (total_train / 2.0)
weight_for_normal = (1 / num_normal) * (total_train / 2.0)

class_weight = {1: weight_for_stroke, 0: weight_for_normal}
print(f"\n📊 Class weights:")
print(f"   Stroke (class 1): {weight_for_stroke:.2f}")
print(f"   Normal (class 0): {weight_for_normal:.2f}")

# ============================================
# TRAIN THE MODEL
# ============================================

print("\n🎯 Starting training...")

# callbacks
callbacks = [
    keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3),
    keras.callbacks.ModelCheckpoint('best_stroke_model.h5', save_best_only=True)
]

# Train
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weight,
    callbacks=callbacks
)

# ============================================
# SAVE THE MODEL
# ============================================

model.save('stroke_model_final.h5')
print("\n💾 Model saved as 'stroke_model_final.h5'")

# ============================================
# PLOT TRAINING HISTORY
# ============================================

# Plot accuracy
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.savefig('training_history.png')
print("📊 Training plot saved as 'training_history.png'")

# ============================================
# EVALUATE ON TEST DATA
# ============================================

print("\n📊 Evaluating on test data...")
test_loss, test_acc, test_precision, test_recall = model.evaluate(test_ds)

print("\n" + "="*50)
print("✅ TEST RESULTS")
print("="*50)
print(f"Test accuracy:  {test_acc:.4f}")
print(f"Test precision: {test_precision:.4f}")
print(f"Test recall:    {test_recall:.4f}")
print(f"Test loss:      {test_loss:.4f}")
print("="*50)

# Calculate F1 score
f1_score = 2 * (test_precision * test_recall) / (test_precision + test_recall + 1e-7)
print(f"Test F1 score:  {f1_score:.4f}")
print("="*50)

print("\n✅ Training complete!")
