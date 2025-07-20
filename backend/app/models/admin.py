from datetime import datetime
from app import db

class AdminLog(db.Model):
    __tablename__ = 'admin_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)  # create, update, delete, ban, etc.
    target_type = db.Column(db.String(50))  # user, product, course, etc.
    target_id = db.Column(db.Integer)
    description = db.Column(db.Text)
    
    # Additional data stored as JSON
    meta_data = db.Column(db.JSON)
    
    # IP and user agent for security
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    admin = db.relationship('User', backref='admin_actions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'admin': self.admin.username if self.admin else None,
            'action': self.action,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'description': self.description,
            'metadata': self.meta_data,
            'ip_address': self.ip_address,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @staticmethod
    def log_action(admin_id, action, target_type=None, target_id=None, description=None, metadata=None, ip_address=None, user_agent=None):
        """Helper method to log admin actions"""
        log = AdminLog(
            admin_id=admin_id,
            action=action,
            target_type=target_type,
            target_id=target_id,
            description=description,
            meta_data=metadata,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.session.add(log)
        db.session.commit()
        return log