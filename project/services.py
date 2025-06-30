# Business logic and service functions

def process_user_action(user_id, action):
    """Process a user action and return a result."""
    return {
        "user_id": user_id,
        "action": action,
        "status": "processed",
        "message": f"Action '{action}' for user {user_id} has been processed."
    }
