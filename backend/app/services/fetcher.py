import requests
from app.config import Config
import time

def fetch_news() -> list[dict] | None:
    url = Config.NEWS_API_URL
    params = {
        'country': 'in',
        'apikey': Config.NEWS_API_KEY,
        'language': 'en',
    }
    
    all_news = []
    fetched_articles = 0

    while fetched_articles < 100:
        try:

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            news_data = response.json().get('results', [])
            if not news_data:
                break

            all_news.extend(news_data)
            fetched_articles += len(news_data)


            next_page = response.json().get('nextPage')
            if not next_page or fetched_articles >= 100:
                break
            
            params['page'] = next_page

            time.sleep(1)  # To avoid hitting the API rate limit

            print(f"[fetch_news] Fetched {fetched_articles} articles so far...")

        except requests.exceptions.RequestException as e:
            print(f"[fetch_news] Error while fetching news: {e}")
            return None
        except Exception as e:
            print(f"[fetch_news] Unexpected error: {e}")
            return None

    processed_results = []
    for article in all_news:
        processed_results.append({
            'article_id': article.get('article_id'),
            'title': article.get('title'),
            'description': article.get('description'),
            'link': article.get('link'),
            'pubDate': article.get('pubDate'),
            'keywords': article.get('keywords'),
            'image_url': article.get('image_url'),
            'source_url': article.get('source_url'),
            'source_name': article.get('source_name'),
        })

    return processed_results
