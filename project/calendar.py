# This file was renamed to calendar_utils.py to avoid shadowing the standard library 'calendar' module.

# Calendar and event management

class Event:
    def __init__(self, event_id, title, start_time, end_time):
        self.event_id = event_id
        self.title = title
        self.start_time = start_time
        self.end_time = end_time

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "title": self.title,
            "start_time": self.start_time,
            "end_time": self.end_time
        }


def create_event(title, start_time, end_time):
    from uuid import uuid4
    return Event(str(uuid4()), title, start_time, end_time)
