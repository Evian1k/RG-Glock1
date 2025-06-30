# Data validation utilities

def is_positive_integer(value):
    return isinstance(value, int) and value > 0


def is_non_empty_string(value):
    return isinstance(value, str) and len(value.strip()) > 0
