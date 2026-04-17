# 🚀 Quick Start - Running Commands

## ⚡ Fast Setup & Run

### **Backend Setup & Run**
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

### **Frontend Setup & Run**
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

---

## 🌐 Access the Application
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📋 All Available Commands

### **Backend Commands**
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

### **Frontend Commands**
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

## 🎯 Complete Parallel Setup

**Open Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Open Terminal 2 - Frontend (while backend runs):**
```bash
cd frontend
npm install
npm run dev
```

Both servers will run simultaneously on different ports.

---

## 📝 Environment Configuration

### **Backend (.env)**
```
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_long_random_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### **Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

---

## 🔗 API Testing Commands

### **Using cURL - Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### **Using cURL - Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 🐛 Quick Troubleshooting

### **Port 5000 Already in Use**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or run on different port
PORT=3001 npm run dev
```

### **Clear Node Modules & Reinstall**
```bash
rm -r node_modules package-lock.json
npm install
```

### **Clear npm Cache**
```bash
npm cache clean --force
```

---

## ✅ Success Indicators

**Backend Running:**
```
Server is running on http://localhost:5000
Database connection established
Tables created automatically
```

**Frontend Running:**
```
➜ Local: http://localhost:5173/
➜ Press 'q' to quit
```

---

**For detailed setup guide, see:** [PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)
