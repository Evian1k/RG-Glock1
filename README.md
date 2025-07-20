# RG Fling - Multi-Feature Platform

RG Fling is a comprehensive web application that combines marketplace, education, and entertainment features into one unified platform. Built with Flask (backend) and React (frontend), it provides a modern, scalable solution for users to buy/sell products, learn new skills, and enjoy entertainment content.

## 🚀 Features

### 🛒 Marketplace
- Product browsing with search and filters
- Shopping cart functionality
- Order management and tracking
- Wishlist system
- Seller dashboard for product management

### 📚 Education
- Course catalog with categories and levels
- Video-based learning content
- Interactive quizzes and assessments
- Progress tracking and certificates
- Instructor tools for course creation

### 🎵 Entertainment
- Music and video streaming
- Game library
- Personal playlists
- Content discovery and recommendations

### 👤 User Management
- JWT-based authentication
- Role-based access control (User, Seller, Admin)
- Profile management
- Activity tracking

### 🔧 Admin Features
- User management and moderation
- Content management
- Order and payment oversight
- Analytics and reporting
- System configuration

## 🛠️ Technology Stack

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Primary database (SQLite for development)
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - Authentication and authorization
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Mail** - Email functionality
- **Marshmallow** - Data validation and serialization

### Frontend
- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

## 📁 Project Structure

```
rg-fling/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── schemas/         # Data validation schemas
│   │   └── __init__.py      # App factory
│   ├── config.py           # Configuration settings
│   ├── run.py             # Application entry point
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main App component
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for production) or SQLite (for development)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database:**
   ```bash
   python run.py create-db
   python run.py seed-db  # Optional: Add sample data
   ```

6. **Run the backend server:**
   ```bash
   python run.py
   ```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📊 Sample Data

The application includes sample data for testing:

### Default Users
- **Admin**: `admin` / `admin123`
- **Seller**: `seller1` / `seller123`  
- **User**: `user1` / `user123`

### Sample Content
- Products in various categories
- Educational courses
- Entertainment content (music, videos, games)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# Database
DATABASE_URL=sqlite:///rgfling.db
# For PostgreSQL: postgresql://user:password@localhost/rgfling

# Mail (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Payment (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Marketplace Endpoints
- `GET /api/marketplace/products` - List products
- `GET /api/marketplace/products/{id}` - Get product details
- `POST /api/marketplace/cart/add` - Add to cart
- `GET /api/marketplace/cart` - Get cart contents
- `POST /api/marketplace/orders` - Create order

### Education Endpoints
- `GET /api/education/courses` - List courses
- `GET /api/education/courses/{id}` - Get course details
- `POST /api/education/courses/{id}/enroll` - Enroll in course
- `GET /api/education/my-courses` - Get enrolled courses

### Entertainment Endpoints
- `GET /api/entertainment/music` - List music tracks
- `GET /api/entertainment/videos` - List videos
- `GET /api/entertainment/games` - List games
- `POST /api/entertainment/playlists` - Create playlist

## 🚀 Deployment

### Using Render (Recommended)

1. **Backend Deployment:**
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set build command: `pip install -r backend/requirements.txt`
   - Set start command: `cd backend && python run.py`
   - Add environment variables

2. **Frontend Deployment:**
   - Create a new Static Site on Render
   - Set build command: `cd frontend && npm install && npm run build`
   - Set publish directory: `frontend/dist`

3. **Database:**
   - Create a PostgreSQL database on Render
   - Update `DATABASE_URL` environment variable

### Using Railway

1. **Deploy Backend:**
   ```bash
   railway login
   railway new
   railway add
   ```

2. **Deploy Frontend:**
   - Deploy as a separate service or use a CDN

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/rg-fling/issues) page
2. Create a new issue with detailed information
3. Contact support at support@rgfling.com

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced search with AI
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social features and messaging
- [ ] API rate limiting and caching

## 🏆 Acknowledgments

- Built with love using Flask and React
- UI components from Radix UI
- Icons from Lucide React
- Styling with Tailwind CSS

---

**RG Fling** - *Your Ultimate Multi-Feature Platform* 🚀
