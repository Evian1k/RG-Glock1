# Logging utilities

import datetime

def log_event(event_type, message):
    timestamp = datetime.datetime.now().isoformat()
    print(f"[{timestamp}] [{event_type}] {message}")
    return {"timestamp": timestamp, "event_type": event_type, "message": message}
