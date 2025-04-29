import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# Load and preprocess dataset
df = pd.read_csv('/datasets/dataset1.csv')

# Combine Title and Description into a single text column
df.rename(columns={'Sentiment': 'label'}, inplace=True)
df['text'] = df['Title'].astype(str) + " " + df['Description'].astype(str)
df.drop(['Title', 'Description'], axis=1, inplace=True)

# Encode sentiment labels to integers
label_mapping = {"negative": 0, "neutral": 1, "positive": 2}
df["label"] = df["label"].map(label_mapping)

# Drop rows with missing values
df.dropna(subset=['text', 'label'], inplace=True)

# Ensure correct data types
df["text"] = df["text"].astype(str)
df["label"] = df["label"].astype(int)
df = df[['text', 'label']]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

# Tokenize and pad sequences
vocab_size = 10000
max_len = 100

tokenizer = Tokenizer(num_words=vocab_size, oov_token="<OOV>")
tokenizer.fit_on_texts(X_train)

X_train_seq = pad_sequences(tokenizer.texts_to_sequences(X_train), maxlen=max_len)
X_test_seq = pad_sequences(tokenizer.texts_to_sequences(X_test), maxlen=max_len)

# BiLSTM model
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=vocab_size, output_dim=128, input_length=max_len),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64, return_sequences=True)),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(32)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(3, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Callbacks for early stopping and saving best model
early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
checkpoint = ModelCheckpoint('best_bilstm_model.h5', save_best_only=True, monitor='val_accuracy', mode='max')

# Train the model
history = model.fit(
    X_train_seq, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.1,
    callbacks=[early_stop, checkpoint],
    verbose=1
)

# Predict and evaluate
bilstm_preds = np.argmax(model.predict(X_test_seq), axis=1)
bilstm_acc = accuracy_score(y_test, bilstm_preds)
print(f"BiLSTM Accuracy: {bilstm_acc:.4f}")

# Save final model
model.save('models/final_bilstm_model')
