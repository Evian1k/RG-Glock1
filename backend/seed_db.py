#!/usr/bin/env python3
"""
Database seeding script
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from app import create_app, db
from app.models.user import User
from app.models.marketplace import Product
from app.models.education import Course
from app.models.entertainment import Music, Video, Game

def seed_database():
    """Seed the database with sample data"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Seeding database...")
        
        # Check if admin user already exists
        admin = User.query.filter_by(email='admin@rgfling.com').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@rgfling.com',
                first_name='RG',
                last_name='Admin',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
        
        # Check if seller user already exists
        seller = User.query.filter_by(email='seller@rgfling.com').first()
        if not seller:
            seller = User(
                username='seller1',
                email='seller@rgfling.com',
                first_name='John',
                last_name='Seller',
                role='seller'
            )
            seller.set_password('seller123')
            db.session.add(seller)
        
        # Check if regular user already exists
        user = User.query.filter_by(email='user@rgfling.com').first()
        if not user:
            user = User(
                username='user1',
                email='user@rgfling.com',
                first_name='Jane',
                last_name='Doe',
                role='user'
            )
            user.set_password('user123')
            db.session.add(user)
        
        # Commit users first to get IDs
        db.session.commit()
        
        # Only seed products if none exist
        if Product.query.count() == 0:
            products = [
                Product(
                    name='Smartphone Pro Max',
                    description='Latest smartphone with amazing features',
                    price=999.99,
                    quantity=50,
                    category='Electronics',
                    seller_id=seller.id,
                    is_featured=True
                ),
                Product(
                    name='Wireless Headphones',
                    description='High-quality wireless headphones',
                    price=199.99,
                    quantity=100,
                    category='Electronics',
                    seller_id=seller.id
                ),
                Product(
                    name='Gaming Laptop',
                    description='Powerful gaming laptop for professionals',
                    price=1499.99,
                    quantity=25,
                    category='Computers',
                    seller_id=seller.id,
                    is_featured=True
                )
            ]
            
            for product in products:
                db.session.add(product)
        
        # Only seed courses if none exist
        if Course.query.count() == 0:
            courses = [
                Course(
                    title='Python Programming Basics',
                    description='Learn Python from scratch',
                    price=49.99,
                    category='Programming',
                    level='beginner',
                    duration_hours=20,
                    instructor_id=seller.id
                ),
                Course(
                    title='Web Development with React',
                    description='Build modern web applications',
                    price=79.99,
                    category='Web Development',
                    level='intermediate',
                    duration_hours=30,
                    instructor_id=seller.id
                ),
                Course(
                    title='Data Science Masterclass',
                    description='Complete data science course',
                    price=99.99,
                    category='Data Science',
                    level='advanced',
                    duration_hours=50,
                    instructor_id=seller.id
                )
            ]
            
            for course in courses:
                db.session.add(course)
        
        # Only seed music if none exists
        if Music.query.count() == 0:
            music_tracks = [
                Music(
                    title='Summer Vibes',
                    artist='DJ Cool',
                    album='Chill Beats',
                    genre='Electronic',
                    duration=240,
                    audio_url='https://example.com/music/summer-vibes.mp3'
                ),
                Music(
                    title='Rock Anthem',
                    artist='The Rockers',
                    album='Greatest Hits',
                    genre='Rock',
                    duration=180,
                    audio_url='https://example.com/music/rock-anthem.mp3'
                )
            ]
            
            for music in music_tracks:
                db.session.add(music)
        
        # Only seed videos if none exist
        if Video.query.count() == 0:
            videos = [
                Video(
                    title='Cooking Tutorial',
                    description='Learn to cook delicious meals',
                    duration=600,
                    category='Education',
                    video_url='https://example.com/videos/cooking-tutorial.mp4'
                ),
                Video(
                    title='Travel Vlog',
                    description='Amazing travel destinations',
                    duration=800,
                    category='Travel',
                    video_url='https://example.com/videos/travel-vlog.mp4'
                )
            ]
            
            for video in videos:
                db.session.add(video)
        
        # Only seed games if none exist
        if Game.query.count() == 0:
            games = [
                Game(
                    title='Puzzle Quest',
                    description='Challenging puzzle game',
                    category='Puzzle',
                    game_url='https://example.com/games/puzzle-quest'
                ),
                Game(
                    title='Space Adventure',
                    description='Epic space exploration game',
                    category='Adventure',
                    game_url='https://example.com/games/space-adventure'
                )
            ]
            
            for game in games:
                db.session.add(game)
        
        # Commit all data
        db.session.commit()
        
        print("✓ Sample data seeded successfully!")
        print(f"✓ Total users: {User.query.count()}")
        print(f"✓ Total products: {Product.query.count()}")
        print(f"✓ Total courses: {Course.query.count()}")
        print(f"✓ Total music tracks: {Music.query.count()}")
        print(f"✓ Total videos: {Video.query.count()}")
        print(f"✓ Total games: {Game.query.count()}")
        print("\n📋 Test accounts:")
        print("Admin: admin@rgfling.com / admin123")
        print("Seller: seller@rgfling.com / seller123")
        print("User: user@rgfling.com / user123")

if __name__ == '__main__':
    seed_database()