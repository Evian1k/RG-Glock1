from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.entertainment import Music, Video, Game, Playlist

entertainment_bp = Blueprint('entertainment', __name__)

# Music endpoints
@entertainment_bp.route('/music', methods=['GET'])
def get_music():
    """Get all active music"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        genre = request.args.get('genre')
        artist = request.args.get('artist')
        
        query = Music.query.filter_by(is_active=True)
        
        if genre:
            query = query.filter(Music.genre == genre)
        
        if artist:
            query = query.filter(Music.artist.ilike(f'%{artist}%'))
        
        music = query.order_by(Music.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'music': [track.to_dict() for track in music.items],
            'pagination': {
                'page': page,
                'pages': music.pages,
                'per_page': per_page,
                'total': music.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch music'}), 500

@entertainment_bp.route('/music/<int:music_id>/play', methods=['POST'])
def play_music(music_id):
    """Increment play count for music"""
    try:
        music = Music.query.get(music_id)
        if not music or not music.is_active:
            return jsonify({'error': 'Music not found'}), 404
        
        music.play_count += 1
        db.session.commit()
        
        return jsonify({'message': 'Play count updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update play count'}), 500

# Video endpoints
@entertainment_bp.route('/videos', methods=['GET'])
def get_videos():
    """Get all active videos"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        
        query = Video.query.filter_by(is_active=True)
        
        if category:
            query = query.filter(Video.category == category)
        
        videos = query.order_by(Video.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'videos': [video.to_dict() for video in videos.items],
            'pagination': {
                'page': page,
                'pages': videos.pages,
                'per_page': per_page,
                'total': videos.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch videos'}), 500

@entertainment_bp.route('/videos/<int:video_id>/watch', methods=['POST'])
def watch_video(video_id):
    """Increment view count for video"""
    try:
        video = Video.query.get(video_id)
        if not video or not video.is_active:
            return jsonify({'error': 'Video not found'}), 404
        
        video.view_count += 1
        db.session.commit()
        
        return jsonify({'message': 'View count updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update view count'}), 500

# Games endpoints
@entertainment_bp.route('/games', methods=['GET'])
def get_games():
    """Get all active games"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        
        query = Game.query.filter_by(is_active=True)
        
        if category:
            query = query.filter(Game.category == category)
        
        games = query.order_by(Game.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'games': [game.to_dict() for game in games.items],
            'pagination': {
                'page': page,
                'pages': games.pages,
                'per_page': per_page,
                'total': games.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch games'}), 500

@entertainment_bp.route('/games/<int:game_id>/play', methods=['POST'])
def play_game(game_id):
    """Increment play count for game"""
    try:
        game = Game.query.get(game_id)
        if not game or not game.is_active:
            return jsonify({'error': 'Game not found'}), 404
        
        game.play_count += 1
        db.session.commit()
        
        return jsonify({'message': 'Play count updated'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update play count'}), 500

# Playlist endpoints
@entertainment_bp.route('/playlists', methods=['GET'])
@jwt_required()
def get_playlists():
    """Get user's playlists"""
    try:
        user_id = get_jwt_identity()
        
        playlists = Playlist.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'playlists': [playlist.to_dict() for playlist in playlists]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch playlists'}), 500

@entertainment_bp.route('/playlists', methods=['POST'])
@jwt_required()
def create_playlist():
    """Create new playlist"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        playlist = Playlist(
            name=data['name'],
            description=data.get('description'),
            user_id=user_id,
            is_public=data.get('is_public', True),
            cover_image=data.get('cover_image'),
            music_ids=data.get('music_ids', []),
            video_ids=data.get('video_ids', [])
        )
        
        db.session.add(playlist)
        db.session.commit()
        
        return jsonify({
            'message': 'Playlist created successfully',
            'playlist': playlist.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create playlist'}), 500

@entertainment_bp.route('/playlists/<int:playlist_id>', methods=['GET'])
@jwt_required()
def get_playlist(playlist_id):
    """Get playlist with items"""
    try:
        user_id = get_jwt_identity()
        
        playlist = Playlist.query.get(playlist_id)
        if not playlist:
            return jsonify({'error': 'Playlist not found'}), 404
        
        # Check if user owns the playlist or if it's public
        if playlist.user_id != user_id and not playlist.is_public:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'playlist': playlist.to_dict(include_items=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch playlist'}), 500

@entertainment_bp.route('/playlists/<int:playlist_id>/add', methods=['POST'])
@jwt_required()
def add_to_playlist(playlist_id):
    """Add item to playlist"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        playlist = Playlist.query.get(playlist_id)
        if not playlist or playlist.user_id != user_id:
            return jsonify({'error': 'Playlist not found'}), 404
        
        item_type = data.get('type')  # 'music' or 'video'
        item_id = data.get('item_id')
        
        if item_type == 'music':
            if not playlist.music_ids:
                playlist.music_ids = []
            if item_id not in playlist.music_ids:
                playlist.music_ids.append(item_id)
        elif item_type == 'video':
            if not playlist.video_ids:
                playlist.video_ids = []
            if item_id not in playlist.video_ids:
                playlist.video_ids.append(item_id)
        else:
            return jsonify({'error': 'Invalid item type'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'Item added to playlist',
            'playlist': playlist.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item to playlist'}), 500