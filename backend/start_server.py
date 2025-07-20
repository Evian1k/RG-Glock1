#!/usr/bin/env python3
"""
Flask server startup script
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from run import app

if __name__ == '__main__':
    print("🚀 Starting RG Fling Backend Server...")
    print("📊 Dashboard: http://localhost:5000")
    print("📚 API Documentation available at all endpoints")
    print("🔐 Test accounts:")
    print("   Admin: admin@rgfling.com / admin123")
    print("   Seller: seller@rgfling.com / seller123")
    print("   User: user@rgfling.com / user123")
    print("\n" + "="*50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)