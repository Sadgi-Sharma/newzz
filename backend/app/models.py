from app import db

class User:
    collection = db.users

    @staticmethod
    def create_user(auth_id, email, name, profile_url=None):
        user = {
            "auth_id": auth_id,
            "email": email,
            "name": name,
            "profile_url": profile_url
        }
        return User.collection.insert_one(user)

    @staticmethod
    def get_user(auth_id):
        return User.collection.find_one({"auth_id": auth_id})

    @staticmethod
    def update_profile(auth_id, data):
        return User.collection.update_one({"auth_id": auth_id}, {"$set": data})
