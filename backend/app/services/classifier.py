import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from app.config import Config

def classify_news(news_list: list[dict]) -> list[dict] | None:
    try:
        model = AutoModelForSequenceClassification.from_pretrained(Config.SENTIMENTAL_MODEL_PATH)
        tokenizer = AutoTokenizer.from_pretrained(Config.SENTIMENTAL_MODEL_PATH)
        model.eval()

        descriptions = [str(article.get('description')) for article in news_list]
        inputs = tokenizer(descriptions, padding=True, truncation=True, return_tensors="pt")

        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        confidences, predictions = torch.max(probabilities, dim=1)

        predictions = predictions.cpu().numpy()
        confidences = confidences.cpu().numpy()

        sentiment_labels = ["Negative", "Positive", "Neutral"]

        for idx, article in enumerate(news_list):
            pred_label_idx = predictions[idx]
            confidence = confidences[idx]
            
            article["sentiment"] = sentiment_labels[pred_label_idx]
            article["confidence"] = float(confidence)

        return news_list

    except Exception as e:
        print(f"[classify_news] Error during classification: {e}")
        return None
