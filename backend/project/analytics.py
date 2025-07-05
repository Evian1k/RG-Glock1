# Analytics and statistics functions

def calculate_user_stats(users):
    """Calculate statistics for a list of users."""
    return {
        "total_users": len(users),
        "active_users": sum(1 for u in users if getattr(u, 'active', False)),
        "average_posts": sum(getattr(u, 'posts', 0) for u in users) / len(users) if users else 0
    }
