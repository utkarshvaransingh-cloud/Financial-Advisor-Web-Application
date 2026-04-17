# 🚀 Quick Start - Running Commands

## ⚡ Essential Setup

### **Prerequisites**
- Node.js 18+
- PostgreSQL/Neon database connection string
- Google Gemini API key

### **Terminal 1: Backend**
```bash
cd backend
npm install
copy .env.example .env
# Add to backend/.env:
# DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm run dev
# Runs on http://localhost:5000
```

### **Terminal 2: Frontend**
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Access Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📋 Essential Commands

### Backend
```bash
npm run dev      # Development (auto-reload)
npm start        # Production
npm install      # Install dependencies
```

### Frontend
```bash
npm run dev      # Development
npm run build    # Production build
npm install      # Install dependencies
```

---

## 📝 Required Environment Variables

### **Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

---

## ✅ Verify Setup

**Backend:**
```
✓ Server running on http://localhost:5000
✓ Database connected
✓ Tables created
```

**Frontend:**
```
✓ Development server at http://localhost:5173
✓ Connected to backend API
```

---

**For complete guide:** [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)
