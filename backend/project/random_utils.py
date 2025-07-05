# Random utilities

import random

def random_string(length=8):
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(random.choice(chars) for _ in range(length))


def random_int(min_val, max_val):
    return random.randint(min_val, max_val)
