from flask import Blueprint, jsonify, request
from app.utils.db import db

news = Blueprint('news', __name__)

def paginate_query(collection, query_filter=None, page=1, limit=10, sort_by=None):
    """
    Helper function to paginate MongoDB queries with optional sorting.
    """
    if query_filter is None:
        query_filter = {}

    skip = (page - 1) * limit
    cursor = collection.find(query_filter)

    if sort_by:
        cursor = cursor.sort(sort_by)

    cursor = cursor.skip(skip).limit(limit)
    total = collection.count_documents(query_filter)

    results = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        results.append(doc)

    return results, total

@news.route('/top-news', methods=['GET'])
def get_top_news():
    """
    Fetch top news articles from the database with pagination.
    Query Params:
      - page (default 1)
      - limit (default 10)
    """
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))

        if page < 1 or limit < 1:
            return jsonify({"status": "error", "message": "Page and limit must be positive integers."}), 400

        articles, total_articles = paginate_query(db.articles, page=page, limit=limit,sort_by=[('pubDate', -1)])

        return jsonify({
            "status": "success",
            "page": page,
            "limit": limit,
            "total_articles": total_articles,
            "data": articles,
        }), 200

    except Exception as e:
        print(f"[get_top_news] Error while fetching articles: {e}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch news articles."
        }), 500

@news.route('/sentiment-news', methods=['GET'])
def get_sentiment_news():
    """
    Fetch news articles filtered by sentiment with pagination.
    Query Params:
      - page (default 1)
      - limit (default 10)
      - sentiment (required)
    """
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        sentiment = request.args.get('sentiment')

        if not sentiment:
            return jsonify({"status": "error", "message": "Sentiment parameter is required."}), 400

        if page < 1 or limit < 1:
            return jsonify({"status": "error", "message": "Page and limit must be positive integers."}), 400

        query_filter = {"sentiment": sentiment.capitalize()}  # Example: "Positive", "Negative", "Neutral"
        articles, total_articles = paginate_query(db.articles, query_filter, page, limit,sort_by=[('pubDate', -1)])

        return jsonify({
            "status": "success",
            "page": page,
            "limit": limit,
            "total_articles": total_articles,
            "data": articles,
        }), 200

    except Exception as e:
        print(f"[get_sentiment_news] Error while fetching sentiment articles: {e}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch sentiment news articles."
        }), 500

@news.route('/give-feedback', methods=['POST'])
def give_feedback():
    """
    Endpoint to receive feedback from users.
    """
    try:
        article_id = request.json.get('article_id')
        sentiment = request.json.get('sentiment')
        print(f"[give_feedback] Received feedback: {article_id}, {sentiment}")
        if not article_id or not sentiment:
            return jsonify({
                "status": "error",
                "message": "Both 'article_id' and 'sentiment' are required."
            }), 400
        
        if sentiment.lower() not in ['positive', 'negative', 'neutral']:
            return jsonify({
                "status": "error",
                "message": "Sentiment must be 'positive', 'negative', or 'neutral'."
            }), 400

        db.articles.update_one(
            {"article_id": article_id},
            {
                "$inc": {f"feedback.{sentiment}": 1}
            },
            upsert=True
        )
        return jsonify({
            "status": "success",
            "message": "Feedback received successfully."
        }), 200
    except Exception as e:
        print(f"[give_feedback] Error while processing feedback: {e}")
        return jsonify({
            "status": "error",
            "message": "Failed to process feedback."
        }), 500
