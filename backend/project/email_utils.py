# Email sending and validation utilities

def send_email(to, subject, body):
    """Simulate sending an email."""
    print(f"Sending email to {to}: {subject}\n{body}")
    return True


def validate_email_address(email):
    """Basic email validation."""
    return "@" in email and "." in email
