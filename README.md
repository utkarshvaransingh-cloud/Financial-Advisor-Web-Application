# Financial Advisor

Full-stack personal finance app for income and expense tracking, monthly budgets, reporting, ghost-expense hints, and ITR learning content.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: Neon Postgres
- Auth: JWT

## Features

- User registration and login backed by Postgres
- Persistent income, expense, and budget tracking
- Monthly dashboard and report views driven by stored data
- Budget alerts and small-expense hints
- Vite proxy setup for local frontend-to-backend integration

## Prerequisites

- Node.js 18+
- A Neon database connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
```

Set these values in `backend/.env`:

- `DATABASE_URL`: your Neon connection string
- `JWT_SECRET`: a long random secret
- `PORT`: optional, defaults to `5000`
- `CORS_ORIGIN`: optional, defaults to `http://localhost:5173`

Then start the API:

```bash
npm run dev
```

The server creates the required tables automatically on startup.

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

By default the frontend uses `/api`, and Vite proxies that to `http://localhost:5000`.

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/finance/bootstrap`
- `POST /api/finance/expenses`
- `POST /api/finance/incomes`
- `PUT /api/finance/budgets/:category`

## Project layout

```text
frontend/   React app
backend/    Express + Neon API
```

## License

MIT
