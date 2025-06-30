# Security and authentication utilities

import hashlib

def hash_password(password):
    """Hash a password using SHA-256."""
    return hashlib.sha256(password.encode()).hexdigest()


def check_password(password, hashed):
    """Check if a password matches the hash."""
    return hash_password(password) == hashed
