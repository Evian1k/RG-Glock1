# Task management functions

class Task:
    def __init__(self, task_id, description, completed=False):
        self.task_id = task_id
        self.description = description
        self.completed = completed

    def complete(self):
        self.completed = True

    def to_dict(self):
        return {
            "task_id": self.task_id,
            "description": self.description,
            "completed": self.completed
        }

def create_task(task_id, description):
    return Task(task_id, description)
