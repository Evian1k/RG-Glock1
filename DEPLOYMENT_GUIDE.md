# 🚀 RG Fling - Deployment Guide

## Overview
RG Fling is a full-stack web application that combines marketplace, education, and entertainment features into a single platform. This guide will help you deploy and run the application.

## 🏗️ Architecture
- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: React with Vite, Tailwind CSS, and Radix UI
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT-based with role-based access control

## 📋 Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Git (for cloning)

## 🛠️ Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (already created)
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies (already installed)
pip install -r requirements.txt

# Initialize database
python init_db.py

# Seed with sample data
python seed_db.py

# Start the server
python start_server.py
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies (already installed)
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rgfling.com | admin123 |
| Seller | seller@rgfling.com | seller123 |
| User | user@rgfling.com | user123 |

## 🌟 Features

### 🛒 Marketplace
- Product listing and management
- Shopping cart functionality
- Order processing
- Wishlist management
- Seller dashboard

### 📚 Education
- Course catalog
- Course enrollment
- Quiz system
- Progress tracking
- Certificates

### 🎵 Entertainment
- Music streaming
- Video library
- Game collection
- Playlist management

### 👨‍💼 Admin Features
- User management
- Product moderation
- Analytics dashboard
- System logs
- Content management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Marketplace
- `GET /api/marketplace/products` - Get all products
- `POST /api/marketplace/products` - Create product (sellers)
- `GET /api/marketplace/products/{id}` - Get product details
- `POST /api/marketplace/cart` - Add to cart
- `GET /api/marketplace/cart` - Get cart items
- `POST /api/marketplace/orders` - Create order

### Education
- `GET /api/education/courses` - Get all courses
- `POST /api/education/courses` - Create course (instructors)
- `GET /api/education/courses/{id}` - Get course details
- `POST /api/education/enroll` - Enroll in course
- `GET /api/education/my-courses` - Get enrolled courses

### Entertainment
- `GET /api/entertainment/music` - Get music library
- `GET /api/entertainment/videos` - Get video library
- `GET /api/entertainment/games` - Get game library
- `POST /api/entertainment/playlists` - Create playlist

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/products` - Manage products
- `GET /api/admin/logs` - System logs

## 🔄 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `products` - Marketplace products
- `courses` - Educational courses
- `music`, `videos`, `games` - Entertainment content
- `orders`, `cart_items` - E-commerce data
- `enrollments`, `quizzes` - Education data
- `admin_logs` - System audit logs

## 🚀 Production Deployment

### Environment Variables
Create `.env` file in backend directory:

```env
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=postgresql://user:password@host:port/dbname
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Options

#### Option 1: Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Option 2: Render
1. Create new Web Service
2. Connect repository
3. Set build and start commands
4. Configure environment variables

#### Option 3: Docker
```dockerfile
# Backend Dockerfile
FROM python:3.9
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
```

## 🔧 Development

### Backend Structure
```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── schemas/         # Validation schemas
├── config.py            # Configuration
├── run.py              # Application entry point
└── requirements.txt    # Dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   └── lib/           # Utilities
├── package.json       # Dependencies
└── vite.config.js    # Build configuration
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /api/auth/profile` (with auth)
- Frontend: Check if app loads at root URL
- Database: Connection and query tests

### Logs
- Application logs in `backend/logs/`
- Admin logs in database `admin_logs` table
- Frontend console logs in browser

## 🔒 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- CORS protection
- SQL injection prevention with SQLAlchemy
- Input validation with Marshmallow
- Role-based access control

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check DATABASE_URL in .env
   - Ensure database server is running
   - Run `python init_db.py` to create tables

2. **Import errors**
   - Activate virtual environment
   - Install requirements: `pip install -r requirements.txt`

3. **Frontend build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **CORS errors**
   - Verify frontend proxy configuration in vite.config.js
   - Check CORS settings in Flask app

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Test with provided sample accounts
4. Verify all dependencies are installed

## 🎯 Next Steps

1. Customize branding and styling
2. Add payment integration (Stripe)
3. Implement email notifications
4. Add real-time features (WebSocket)
5. Set up monitoring and analytics
6. Add comprehensive testing
7. Implement CI/CD pipeline

---

**RG Fling** - Your all-in-one platform for marketplace, education, and entertainment! 🌟