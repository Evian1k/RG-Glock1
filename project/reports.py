# Report generation functions

def generate_user_report(user):
    """Generate a report for a user."""
    return f"Report for {user.username} (ID: {user.user_id}): Email: {user.email}"


def generate_system_report():
    """Generate a system report."""
    return "System is running smoothly. All services operational."
