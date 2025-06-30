# Admin management functions

class Admin:
    def __init__(self, admin_id, username, privileges=None):
        self.admin_id = admin_id
        self.username = username
        self.privileges = privileges or []

    def add_privilege(self, privilege):
        self.privileges.append(privilege)

    def to_dict(self):
        return {
            "admin_id": self.admin_id,
            "username": self.username,
            "privileges": self.privileges
        }
