# Feedback management

class Feedback:
    def __init__(self, feedback_id, user_id, content, rating):
        self.feedback_id = feedback_id
        self.user_id = user_id
        self.content = content
        self.rating = rating

    def to_dict(self):
        return {
            "feedback_id": self.feedback_id,
            "user_id": self.user_id,
            "content": self.content,
            "rating": self.rating
        }


def create_feedback(user_id, content, rating):
    from uuid import uuid4
    return Feedback(str(uuid4()), user_id, content, rating)
