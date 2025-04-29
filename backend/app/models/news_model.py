from app.utils.db import db
from pymongo import UpdateOne

db.articles.create_index('article_id', unique=True)

def insert_news(news):
    """
    Insert news articles into the database.
    """
    operations = []
    for article in news:
        operations.append(
            UpdateOne(
                {'article_id': article['article_id']},
                {'$setOnInsert': article},
                upsert=True
            )
        )
    if operations:
        try:
            db.articles.bulk_write(operations, ordered=False)
        except Exception as e:
            print(f"Error inserting news: {e}")

def fetch_news():
    """
    Fetch news articles from the database.
    """
    try:
        news = list(db.articles.find())
        return news
    except Exception as e:
        print(f"Error fetching news: {e}")
        return []

def fetch_test_news():
    """
    Fetch test news articles from the database.
    """
    try:
        news = list(db.testnews.find())
        return news
    except Exception as e:
        print(f"Error fetching test news: {e}")
        return []