# Search utilities

def search_users(users, query):
    """Search for users by username or email."""
    return [u for u in users if query.lower() in u.username.lower() or query.lower() in u.email.lower()]
