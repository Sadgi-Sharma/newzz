from app import create_app
from app.config import Config

app = create_app()

if __name__ == "__main__":
    app.secret_key = Config.APP_SECRET_KEY
    app.run(debug=True)
