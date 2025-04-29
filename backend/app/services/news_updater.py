from app.services.fetcher import fetch_news
# from app.models.news_model import fetch_test_news
from app.services.classifier import classify_news
from app.models.news_model import insert_news

def news_updater() -> None:
    """
    Fetches news articles, classifies them, and inserts them into the database.
    This function is intended to be run periodically to keep the news database updated.
    """
    articles = fetch_news()
    print("News data updating...")
    try:
        if articles:
            classified_articles = classify_news(articles)
            insert_news(classified_articles)
        else:
            print("No articles fetched.")
    except Exception as e:
        print(f"Error during news update: {e}")
    finally:
        print("News update process completed.")