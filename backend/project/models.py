# Data models (example)

class User:
    """A simple user model."""
    def __init__(self, user_id, username, email):
        self.user_id = user_id
        self.username = username
        self.email = email

    def to_dict(self):
        """Return user data as a dictionary."""
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email
        }
