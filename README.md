# Financial Advisor

MERN-stack web app for income/expense tracking, budgets, reports, ghost-expense hints, and ITR learning content.

## Tech stack

- **Frontend:** React with [Vite](https://vite.dev/) (recommended over deprecated Create React App)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose) — configure `MONGODB_URI` in `backend/.env`
- **Auth:** JWT

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, PORT
npm run dev
```

API runs at `http://localhost:5000` by default (see `PORT` in `.env`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` (Vite default). Point the client at the API URL when integrating (proxy or `VITE_API_URL`).

**Phase 1 (current):** React Router pages (login/register, dashboard, budget, reports, ITR), mock auth (`localStorage`), and in-memory finance data with sample totals, budget alerts, ghost-expense hints, and simple advice text — no backend yet.

## Project layout

```
├── frontend/          # React app
├── backend/           # Express API
└── .github/workflows/ # CI
```

## Roadmap

Phases: setup → frontend UI → backend API → integration → tests/CI/deploy → docs/demo. See project planning doc for full checklists.

## License

MIT (adjust as needed)
