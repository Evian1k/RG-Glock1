# HTML utilities

from html import escape

def sanitize_html(html):
    """Escape HTML to prevent XSS."""
    return escape(html)
