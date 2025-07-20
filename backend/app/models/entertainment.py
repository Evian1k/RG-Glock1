from datetime import datetime
from app import db

class Music(db.Model):
    __tablename__ = 'music'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist = db.Column(db.String(200), nullable=False)
    album = db.Column(db.String(200))
    genre = db.Column(db.String(100))
    duration = db.Column(db.Integer)  # in seconds
    
    # Media files
    audio_url = db.Column(db.String(255), nullable=False)
    cover_image = db.Column(db.String(255))
    
    # Metadata
    year = db.Column(db.Integer)
    language = db.Column(db.String(50))
    lyrics = db.Column(db.Text)
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    play_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'album': self.album,
            'genre': self.genre,
            'duration': self.duration,
            'audio_url': self.audio_url,
            'cover_image': self.cover_image,
            'year': self.year,
            'language': self.language,
            'lyrics': self.lyrics,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'play_count': self.play_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Video(db.Model):
    __tablename__ = 'videos'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    duration = db.Column(db.Integer)  # in seconds
    
    # Media files
    video_url = db.Column(db.String(255), nullable=False)
    thumbnail = db.Column(db.String(255))
    
    # Video metadata
    quality = db.Column(db.String(50))  # 720p, 1080p, etc.
    file_size = db.Column(db.BigInteger)  # in bytes
    
    # Content details
    director = db.Column(db.String(200))
    cast = db.Column(db.JSON)  # Array of cast members
    year = db.Column(db.Integer)
    language = db.Column(db.String(50))
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'duration': self.duration,
            'video_url': self.video_url,
            'thumbnail': self.thumbnail,
            'quality': self.quality,
            'file_size': self.file_size,
            'director': self.director,
            'cast': self.cast or [],
            'year': self.year,
            'language': self.language,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'view_count': self.view_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Game(db.Model):
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))  # action, puzzle, strategy, etc.
    
    # Game details
    game_url = db.Column(db.String(255))  # URL to play the game
    thumbnail = db.Column(db.String(255))
    screenshots = db.Column(db.JSON)  # Array of screenshot URLs
    
    # Game metadata
    developer = db.Column(db.String(200))
    version = db.Column(db.String(50))
    platform = db.Column(db.String(100))  # web, mobile, etc.
    
    # Game settings
    min_players = db.Column(db.Integer, default=1)
    max_players = db.Column(db.Integer, default=1)
    age_rating = db.Column(db.String(10))  # E, T, M, etc.
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    play_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'game_url': self.game_url,
            'thumbnail': self.thumbnail,
            'screenshots': self.screenshots or [],
            'developer': self.developer,
            'version': self.version,
            'platform': self.platform,
            'min_players': self.min_players,
            'max_players': self.max_players,
            'age_rating': self.age_rating,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'play_count': self.play_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Playlist(db.Model):
    __tablename__ = 'playlists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Playlist settings
    is_public = db.Column(db.Boolean, default=True)
    cover_image = db.Column(db.String(255))
    
    # Content (stored as JSON for flexibility)
    music_ids = db.Column(db.JSON)  # Array of music IDs
    video_ids = db.Column(db.JSON)  # Array of video IDs
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def get_music_items(self):
        """Get all music items in this playlist"""
        if not self.music_ids:
            return []
        return Music.query.filter(Music.id.in_(self.music_ids)).all()
    
    def get_video_items(self):
        """Get all video items in this playlist"""
        if not self.video_ids:
            return []
        return Video.query.filter(Video.id.in_(self.video_ids)).all()
    
    def get_total_duration(self):
        """Calculate total duration of playlist in seconds"""
        total = 0
        for music in self.get_music_items():
            if music.duration:
                total += music.duration
        for video in self.get_video_items():
            if video.duration:
                total += video.duration
        return total
    
    def to_dict(self, include_items=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id,
            'user': self.user.username if self.user else None,
            'is_public': self.is_public,
            'cover_image': self.cover_image,
            'music_count': len(self.music_ids) if self.music_ids else 0,
            'video_count': len(self.video_ids) if self.video_ids else 0,
            'total_duration': self.get_total_duration(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_items:
            data['music_items'] = [m.to_dict() for m in self.get_music_items()]
            data['video_items'] = [v.to_dict() for v in self.get_video_items()]
        
        return data