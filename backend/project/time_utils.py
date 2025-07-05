# Time utilities

import time
import datetime

def current_timestamp():
    return int(time.time())


def format_datetime(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S')
