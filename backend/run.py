#!/usr/bin/env python3
"""
RG Fling - Main Application Entry Point
A comprehensive multi-feature platform (Marketplace + Education + Entertainment)
"""

import os
from app import create_app, db
from app.models import *  # Import all models

# Create the Flask application
app = create_app()

@app.cli.command()
def create_db():
    """Create database tables"""
    db.create_all()
    print("Database tables created!")

@app.cli.command()
def seed_db():
    """Seed database with sample data"""
    from datetime import datetime
    from app.models.user import User
    from app.models.marketplace import Product
    from app.models.education import Course
    from app.models.entertainment import Music, Video, Game
    
    # Create admin user
    admin = User(
        username='admin',
        email='admin@rgfling.com',
        first_name='RG',
        last_name='Admin',
        role='admin'
    )
    admin.set_password('admin123')
    
    # Create sample seller
    seller = User(
        username='seller1',
        email='seller@rgfling.com',
        first_name='John',
        last_name='Seller',
        role='seller'
    )
    seller.set_password('seller123')
    
    # Create sample user
    user = User(
        username='user1',
        email='user@rgfling.com',
        first_name='Jane',
        last_name='Doe'
    )
    user.set_password('user123')
    
    db.session.add_all([admin, seller, user])
    db.session.commit()
    
    # Create sample products
    products = [
        Product(
            name='iPhone 15 Pro',
            description='Latest iPhone with advanced features',
            price=999.99,
            quantity=50,
            category='Electronics',
            seller_id=seller.id,
            slug='iphone-15-pro-abc123'
        ),
        Product(
            name='MacBook Air M2',
            description='Powerful laptop for professionals',
            price=1299.99,
            quantity=25,
            category='Electronics',
            seller_id=seller.id,
            slug='macbook-air-m2-def456'
        ),
        Product(
            name='Nike Air Max',
            description='Comfortable running shoes',
            price=129.99,
            quantity=100,
            category='Fashion',
            seller_id=seller.id,
            slug='nike-air-max-ghi789'
        )
    ]
    
    # Create sample courses
    courses = [
        Course(
            title='Python for Beginners',
            description='Learn Python programming from scratch',
            short_description='Complete Python course for beginners',
            price=49.99,
            category='Programming',
            level='beginner',
            duration_hours=20,
            instructor_id=seller.id,
            is_published=True
        ),
        Course(
            title='Web Development Masterclass',
            description='Full-stack web development course',
            short_description='Learn HTML, CSS, JavaScript, and more',
            price=99.99,
            category='Web Development',
            level='intermediate',
            duration_hours=40,
            instructor_id=seller.id,
            is_published=True
        )
    ]
    
    # Create sample music
    music = [
        Music(
            title='Sample Song 1',
            artist='Demo Artist',
            album='Demo Album',
            genre='Pop',
            duration=180,
            audio_url='/static/music/sample1.mp3'
        ),
        Music(
            title='Sample Song 2',
            artist='Demo Artist 2',
            album='Demo Album 2',
            genre='Rock',
            duration=240,
            audio_url='/static/music/sample2.mp3'
        )
    ]
    
    # Create sample videos
    videos = [
        Video(
            title='Sample Video 1',
            description='Demo video content',
            category='Entertainment',
            duration=300,
            video_url='/static/videos/sample1.mp4'
        ),
        Video(
            title='Sample Video 2',
            description='Another demo video',
            category='Education',
            duration=600,
            video_url='/static/videos/sample2.mp4'
        )
    ]
    
    # Create sample games
    games = [
        Game(
            title='Puzzle Game',
            description='Fun puzzle game to play',
            category='Puzzle',
            game_url='/static/games/puzzle.html',
            developer='RG Games'
        ),
        Game(
            title='Action Game',
            description='Exciting action game',
            category='Action',
            game_url='/static/games/action.html',
            developer='RG Games'
        )
    ]
    
    db.session.add_all(products + courses + music + videos + games)
    db.session.commit()
    
    print("Database seeded with sample data!")
    print("Admin credentials: admin / admin123")
    print("Seller credentials: seller1 / seller123")
    print("User credentials: user1 / user123")

if __name__ == '__main__':
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the application
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)