from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import os

def filter_by_sentiments(news):
    # Load model and tokenizer
    model_path = "./backend/model/sentimental_model"
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model.eval()

    def predict_sentiments(texts):
        inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=1).cpu().numpy()
        return predictions
    # Example Predictions
    texts = ["Wow! A new scheme launched to benefit poor people","The building fell and three died","The goverment approved a law",
            "A bus crashed and injured 20 people"]
    predictions = predict_sentiments(texts)
    print(predictions) # 0-negative 1-positive 2-neutral

filter_by_sentiments([])

def fake_news(news):
    # Load model and tokenizer
    model_path = "./backend/model/fake_news_model"
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model.eval()

    def predict_fake_news(texts):
        inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)
        logits = outputs.logits
        predictions = torch.argmax(logits, dim=1).cpu().numpy()
        return predictions

    # Example Predictions
    texts = ["World Bank Predicts 3% Global Economic Growth for the Next Year","The government is giving money to all citizens"]
    predictions = predict_fake_news(texts)
    print(predictions)

# fake_news([])