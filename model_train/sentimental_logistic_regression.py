import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

# Load and preprocess dataset
df = pd.read_csv('/datasets/dataset1.csv')
df.rename(columns={'Sentiment': 'label'}, inplace=True)
df['text'] = df['Title'].astype(str) + " " + df['Description'].astype(str)
df.drop(['Title', 'Description'], axis=1, inplace=True)

# Encode sentiment labels
label_mapping = {"negative": 0, "neutral": 1, "positive": 2}
df["label"] = df["label"].map(label_mapping)

# Drop missing values
df.dropna(subset=['text', 'label'], inplace=True)
df["text"] = df["text"].astype(str)
df["label"] = df["label"].astype(int)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label'], test_size=0.2, random_state=42)

# TF-IDF Vectorization
tfidf = TfidfVectorizer(max_features=5000)
X_train_tfidf = tfidf.fit_transform(X_train)
X_test_tfidf = tfidf.transform(X_test)

# Logistic Regression model
logreg_model = LogisticRegression(max_iter=1000)
logreg_model.fit(X_train_tfidf, y_train)

# Predict
logreg_preds = logreg_model.predict(X_test_tfidf)
logreg_acc = accuracy_score(y_test, logreg_preds)

print(f"Logistic Regression Accuracy: {logreg_acc:.4f}")
print("\nClassification Report:\n", classification_report(y_test, logreg_preds, target_names=label_mapping.keys()))

# Save model and vectorizer
joblib.dump(logreg_model, 'logistic_regression_model.pkl')
joblib.dump(tfidf, 'tfidf_vectorizer.pkl')
