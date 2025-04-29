from flask import Flask
from flask_cors import CORS
from app.config import Config
from flask_apscheduler import APScheduler
from app.services.news_updater import news_updater

from app.utils.db import ping_db
from app.routes.news_routes import news

scheduler = APScheduler()

def create_app():
    # Initialize Flask App
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Ping DB
    ping_db()

    scheduler.init_app(app)
    scheduler.start()

    scheduler.add_job(
        id='news_updater',
        func=news_updater,
        trigger='interval',
        hours=1,
    )
    # uncomment to fetch news and classify and store it in mongodb
    # if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    #     news_updater()

    # Register Blueprints
    app.register_blueprint(news, url_prefix='/news')

    return app