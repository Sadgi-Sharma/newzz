from flask import Blueprint,url_for,session,redirect,jsonify
from config import Config
from app import oauth

auth :Blueprint = Blueprint('auth', __name__)

@auth.route('/login')
def login():
    return oauth.auth0.authorize_redirect(
            redirect_uri=url_for('auth.callback', _external=True)
        )

@auth.route('/callback')
def callback():
    token = oauth.auth0.authorize_access_token()

    frontend_url = Config.FRONTEND_URL or "http://localhost:5173"

    return redirect(f"{frontend_url}/callback?access_token={token['access_token']}")

@auth.route('/profile')
def profile():
    user = session.get('user')
    if not user:
        return jsonify({"error":"Unauthorized"}), 401
    return user

@auth.route('/logout')
def logout():
    session.clear()
    return redirect(
        f"https://{Config.AUTH0_DOMAIN}/v2/logout?"
        f"returnTo={url_for('auth.login', _external=True)}&"
        f"client_id={Config.AUTH0_CLIENT_ID}"
    )