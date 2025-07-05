# Security and authentication utilities

import hashlib

def hash_password(password):
    """Hash a password using SHA-256.

    Args:
        password (str): The password to hash.

    Returns:
        str: The resulting hash.
    """
    return hashlib.sha256(password.encode()).hexdigest()


def check_password(password, hashed):
    """Check if a password matches the hash.

    Args:
        password (str): The password to check.
        hashed (str): The hash to compare with.

    Returns:
        bool: True if the password matches the hash, False otherwise.
    """
    return hash_password(password) == hashed
