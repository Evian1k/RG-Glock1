#!/usr/bin/env python3
"""
RG Fling Application Status Check
"""

import os
import sys
import subprocess
import sqlite3
from pathlib import Path

def check_file_exists(filepath):
    """Check if a file exists and return status"""
    return "✓" if Path(filepath).exists() else "✗"

def check_directory_exists(dirpath):
    """Check if a directory exists and return status"""
    return "✓" if Path(dirpath).is_dir() else "✗"

def run_command(command):
    """Run a command and return its output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=10)
        return result.returncode == 0, result.stdout.strip(), result.stderr.strip()
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"

def check_database():
    """Check database status"""
    db_path = "backend/rgfling.db"
    if not Path(db_path).exists():
        return "✗", "Database file not found"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Check user count
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        
        # Check product count
        cursor.execute("SELECT COUNT(*) FROM products;")
        product_count = cursor.fetchone()[0]
        
        conn.close()
        
        return "✓", f"{len(tables)} tables, {user_count} users, {product_count} products"
    except Exception as e:
        return "✗", f"Database error: {str(e)}"

def main():
    print("🚀 RG Fling Application Status Check")
    print("=" * 50)
    
    # Backend Status
    print("\n📊 Backend Status:")
    print(f"  {check_file_exists('backend/run.py')} Main application file")
    print(f"  {check_file_exists('backend/config.py')} Configuration file")
    print(f"  {check_file_exists('backend/.env')} Environment variables")
    print(f"  {check_directory_exists('backend/app')} App directory")
    print(f"  {check_directory_exists('backend/app/models')} Models directory")
    print(f"  {check_directory_exists('backend/app/routes')} Routes directory")
    print(f"  {check_file_exists('backend/requirements.txt')} Requirements file")
    
    # Check virtual environment
    venv_status = check_directory_exists('backend/venv')
    print(f"  {venv_status} Virtual environment")
    
    # Check database
    db_status, db_info = check_database()
    print(f"  {db_status} Database: {db_info}")
    
    # Frontend Status
    print("\n🎨 Frontend Status:")
    print(f"  {check_file_exists('frontend/package.json')} Package.json")
    print(f"  {check_file_exists('frontend/vite.config.js')} Vite config")
    print(f"  {check_file_exists('frontend/index.html')} HTML entry point")
    print(f"  {check_directory_exists('frontend/src')} Source directory")
    print(f"  {check_directory_exists('frontend/src/components')} Components directory")
    print(f"  {check_directory_exists('frontend/src/pages')} Pages directory")
    print(f"  {check_directory_exists('frontend/node_modules')} Node modules")
    
    # Check key application files
    print("\n🔧 Key Application Files:")
    backend_files = [
        'backend/app/models/user.py',
        'backend/app/models/marketplace.py',
        'backend/app/models/education.py',
        'backend/app/models/entertainment.py',
        'backend/app/routes/auth.py',
        'backend/app/routes/marketplace.py',
    ]
    
    for file in backend_files:
        print(f"  {check_file_exists(file)} {file.split('/')[-1]}")
    
    frontend_files = [
        'frontend/src/App.jsx',
        'frontend/src/contexts/AuthContext.jsx',
        'frontend/src/components/Login.jsx',
        'frontend/src/components/Register.jsx',
        'frontend/src/components/layout/Navbar.jsx',
    ]
    
    for file in frontend_files:
        print(f"  {check_file_exists(file)} {file.split('/')[-1]}")
    
    # Test imports
    print("\n🔍 Import Tests:")
    
    # Test backend imports
    os.chdir('backend')
    success, output, error = run_command('python -c "from app import create_app; print(\'Backend imports OK\')"')
    print(f"  {'✓' if success else '✗'} Backend imports: {output if success else error}")
    
    # Test frontend build
    os.chdir('../frontend')
    success, output, error = run_command('npm run build --silent')
    print(f"  {'✓' if success else '✗'} Frontend build: {'OK' if success else 'Failed'}")
    
    # Summary
    print("\n📋 Quick Start Guide:")
    print("1. Backend (Terminal 1):")
    print("   cd backend")
    print("   python start_server.py")
    print("   # Server will run on http://localhost:5000")
    print()
    print("2. Frontend (Terminal 2):")
    print("   cd frontend")
    print("   npm run dev")
    print("   # App will run on http://localhost:5173")
    print()
    print("3. Test Accounts:")
    print("   Admin: admin@rgfling.com / admin123")
    print("   Seller: seller@rgfling.com / seller123")
    print("   User: user@rgfling.com / user123")
    print()
    print("🌟 RG Fling Features:")
    print("  • 🛒 Marketplace (Buy/Sell products)")
    print("  • 📚 Education (Courses & Quizzes)")
    print("  • 🎵 Entertainment (Music, Videos, Games)")
    print("  • 👨‍💼 Admin Dashboard")
    print("  • 🔐 JWT Authentication")
    print("  • 📱 Responsive Design")

if __name__ == "__main__":
    main()