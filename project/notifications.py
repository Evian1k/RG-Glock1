# Notification management

class Notification:
    def __init__(self, notif_id, user_id, message, read=False):
        self.notif_id = notif_id
        self.user_id = user_id
        self.message = message
        self.read = read

    def mark_read(self):
        self.read = True

    def to_dict(self):
        return {
            "notif_id": self.notif_id,
            "user_id": self.user_id,
            "message": self.message,
            "read": self.read
        }


def create_notification(user_id, message):
    from uuid import uuid4
    return Notification(str(uuid4()), user_id, message)
