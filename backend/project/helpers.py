# Helper utility functions

def format_currency(amount):
    """Format a number as currency."""
    return f"${amount:,.2f}"


def is_valid_email(email):
    """Simple email validation."""
    return "@" in email and "." in email
