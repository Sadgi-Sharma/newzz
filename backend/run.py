from app import app
from config import Config

if __name__ == "__main__":
    app.secret_key = Config.APP_SECRET_KEY
    app.run(debug=True)
