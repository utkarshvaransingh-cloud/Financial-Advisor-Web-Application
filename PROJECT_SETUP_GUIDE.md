# Financial Advisor - Project Setup & Running Guide

## 📋 Project Overview

**Financial Advisor** is a full-stack personal finance web application designed for income and expense tracking, monthly budgets, reporting, ghost-expense hints, and ITR learning content.

### Key Features
- ✅ User registration and login (JWT-based authentication)
- ✅ Income and expense tracking with persistent data storage
- ✅ Monthly dashboard and report views
- ✅ Budget management and alerts
- ✅ Ghost-expense detection (identifies small recurring transactions)
- ✅ AI-powered chatbot for financial advice
- ✅ ITR (Income Tax Return) learning module
- ✅ News carousel for financial updates
- ✅ Responsive UI with dark/light theme toggle

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend** | React + Vite | React 19.2.4, Vite 8.0.1 |
| **Backend** | Node.js + Express | Express 5.2.1 |
| **Database** | PostgreSQL (Neon) | pg 8.16.3 |
| **Authentication** | JWT | jsonwebtoken 9.0.3 |
| **Password Hashing** | bcryptjs | 3.0.3 |
| **Dev Server** | Vite | 8.0.1 |

---

## 📁 Project Structure

```
Financial-Advisor-Web-Application/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Main server entry point
│   │   ├── config/
│   │   │   ├── db.js                # Database connection config
│   │   │   └── env.js               # Environment variables
│   │   ├── middleware/
│   │   │   └── requireAuth.js        # JWT authentication middleware
│   │   ├── models/
│   │   │   └── User.js              # User data model
│   │   ├── routes/
│   │   │   ├── auth.js              # Authentication endpoints
│   │   │   ├── chat.js              # AI chatbot endpoints
│   │   │   ├── finance.js           # Finance data endpoints
│   │   │   └── news.js              # News endpoints
│   │   └── utils/
│   │       └── auth.js              # Auth utility functions
│   ├── schema.sql                   # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                 # React app entry point
│   │   ├── App.jsx                  # Main app component
│   │   ├── index.css                # Global styles
│   │   ├── components/
│   │   │   ├── AiChatbot.jsx        # AI chatbot component
│   │   │   ├── AppNav.jsx           # Navigation component
│   │   │   ├── AppShell.jsx         # App shell/layout
│   │   │   ├── ExpenseForm.jsx      # Expense input form
│   │   │   ├── IncomeForm.jsx       # Income input form
│   │   │   ├── NewsCarousel.jsx     # News carousel
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   └── ThemeToggle.jsx      # Theme switcher
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   ├── FinanceContext.jsx   # Finance data state
│   │   │   └── ThemeContext.jsx     # Theme state
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Main dashboard
│   │   │   ├── BudgetPage.jsx       # Budget management
│   │   │   ├── ReportsPage.jsx      # Reports & analytics
│   │   │   ├── ITRModulePage.jsx    # ITR learning
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   ├── RegisterPage.jsx     # Registration page
│   │   │   ├── ContactUsPage.jsx    # Contact page
│   │   │   ├── ConsumerSupportPage.jsx
│   │   │   ├── PrivacyPolicyPage.jsx
│   │   │   └── TermsOfServicePage.jsx
│   │   ├── utils/
│   │   │   ├── api.js               # API communication
│   │   │   ├── money.js             # Money utilities
│   │   │   └── reports.js           # Report utilities
│   │   ├── data/
│   │   │   └── placeholder.js       # Mock data
│   │   └── assets/                  # Images & media
│   ├── public/
│   ├── index.html
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   └── package.json
│
├── README.md
├── PROJECT_SETUP_GUIDE.md           # This file
└── deep-research-report.md
```

---

## ⚙️ Prerequisites

Before setting up the project, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL / Neon Database** connection string
- **Google Gemini API Key** (for AI chatbot)
- **Git** (for version control)
- **VS Code** or your preferred code editor

---

## 🚀 Setup Instructions

### 1️⃣ Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create environment file
```bash
copy .env.example .env
```
*(Or manually create `.env` file)*

#### Step 4: Configure environment variables
Edit `backend/.env` and add:
```
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_long_random_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

**Required Variables:**
- `DATABASE_URL`: PostgreSQL connection string from Neon
- `JWT_SECRET`: A long random string for JWT signing (generate with: `openssl rand -base64 32`)
- `GEMINI_API_KEY`: Your Google Gemini API key

**Optional Variables:**
- `PORT`: Backend server port (default: 5000)
- `CORS_ORIGIN`: Frontend origin for CORS (default: http://localhost:5173)
- `GEMINI_MODEL`: Gemini model to use (default: gemini-1.5-flash)

#### Step 5: Start the backend server
```bash
npm run dev
```

**Output:**
```
Server is running on http://localhost:5000
Database tables created automatically
```

---

### 2️⃣ Frontend Setup

#### Step 1: Open new terminal and navigate to frontend
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create environment file
```bash
copy .env.example .env
```

#### Step 4: Start the development server
```bash
npm run dev
```

**Output:**
```
➜ Local: http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Available Commands

### Backend Commands

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Install dependencies
npm install

# View installed packages
npm list
```

### Frontend Commands

```bash
# Development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code with ESLint
npm lint

# Install dependencies
npm install
```

---

## 🔗 API Endpoints Overview

### Authentication Routes
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user info
```

### Finance Routes
```
GET    /api/finance/bootstrap      # Get all finance data
POST   /api/finance/expenses       # Add expense
POST   /api/finance/incomes        # Add income
PUT    /api/finance/budgets/:category # Set budget
```

### Chat Route
```
POST   /api/chat                   # Send message to AI chatbot
```

### News Route
```
GET    /api/news                   # Get financial news
```

---

## 🔧 Database Setup

The backend automatically creates required tables on startup. The database schema includes:

- **users**: User account information
- **incomes**: Income records with date, amount, source
- **expenses**: Expense records with date, amount, category
- **budgets**: Monthly budget limits by category

View `backend/schema.sql` for complete schema details.

---

## 🌐 Local Development Workflow

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

The frontend is configured with a Vite proxy that automatically forwards `/api` requests to the backend at `http://localhost:5000`.

---

## 📦 Key Dependencies

### Backend
- `express` - Web framework
- `pg` - PostgreSQL client
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variable management

### Frontend
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing
- `vite` - Build tool and dev server

---

## 🧪 Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Using Postman
1. Import API endpoints from the overview above
2. Set `Authorization: Bearer YOUR_JWT_TOKEN` header
3. Test each endpoint

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check Neon database status
- Ensure firewall allows outbound connections

### Frontend can't reach Backend
- Verify backend is running on port 5000
- Check `CORS_ORIGIN` in backend `.env`
- Verify Vite proxy config in `vite.config.js`

### Node Modules Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 📝 Environment Variables Checklist

### Backend (.env)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Random secret for JWT
- [ ] `GEMINI_API_KEY` - Google Gemini API key
- [ ] `PORT` - Server port (optional)
- [ ] `CORS_ORIGIN` - Frontend URL (optional)

### Frontend (.env)
- [ ] Configure API base URL if needed

---

## 🚢 Production Deployment

### Backend Deployment
```bash
# Build for production
npm run build

# Run production server
npm start
```

### Frontend Deployment
```bash
# Build static files
npm run build

# Output in dist/ folder ready for hosting
```

Suitable hosting platforms:
- Backend: Heroku, Railway, Render, AWS
- Frontend: Vercel, Netlify, AWS S3 + CloudFront

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Vite Documentation](https://vitejs.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Google Gemini API](https://ai.google.dev)

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated:** April 17, 2026  
**Project Status:** Active Development
