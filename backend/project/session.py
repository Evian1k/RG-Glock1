# Session management

class Session:
    def __init__(self, session_id, user_id, created_at, expires_at):
        self.session_id = session_id
        self.user_id = user_id
        self.created_at = created_at
        self.expires_at = expires_at

    def is_active(self, now):
        return self.created_at <= now < self.expires_at

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "expires_at": self.expires_at
        }
