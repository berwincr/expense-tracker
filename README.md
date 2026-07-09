# Ledger — Full-Stack Expense Tracker

A complete MERN-stack expense tracker: JWT authentication, a dashboard with
live totals, full transaction CRUD with search/filtering, and category +
monthly reports with charts.

```
expense-tracker/
├── backend/     Node.js + Express + MongoDB API (JWT auth, bcrypt)
└── frontend/    React + Vite + Tailwind CSS + Chart.js
```

## Features

- **Auth** — register, login, logout, JWT-protected routes, bcrypt password hashing
- **Dashboard** — total balance, total income, total expenses, this month's spending, a 6‑month income/expense trend chart, recent activity
- **Transactions** — add / edit / delete income & expense entries, search by description or category, filter by category / type / date range, pagination
- **Categories** — Food, Transport, Shopping, Entertainment, Bills, Education, Health, Salary, Others
- **Reports** — monthly income vs. expense bar chart, category breakdown doughnut chart + progress bars, recent transactions
- **UI** — responsive (mobile sidebar collapses to a top bar), custom "ledger" visual theme, cards, tables, and charts

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker   # or your Atlas connection string
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run it:

```bash
npm run dev      # nodemon, auto-restarts on change
# or
npm start
```

The API runs at `http://localhost:5000/api`. Check `GET /api/health` to confirm it's up.

## 3. Frontend setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open `http://localhost:5173`, register an account, and start adding transactions.

## 4. Production build

```bash
cd frontend
npm run build      # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host (Vercel, Netlify, Nginx, etc.), and
deploy `backend/` to any Node host (Render, Railway, Fly.io, etc.) with your
production `MONGO_URI` and a strong `JWT_SECRET` set as environment variables.

## API overview

| Method | Route                               | Description                          | Auth |
|--------|--------------------------------------|---------------------------------------|------|
| POST   | `/api/auth/register`                | Create an account                     | –    |
| POST   | `/api/auth/login`                   | Log in, returns a JWT                 | –    |
| GET    | `/api/auth/me`                      | Get the current user                  | ✔    |
| POST   | `/api/auth/logout`                  | Logout (client discards token)        | ✔    |
| GET    | `/api/transactions`                 | List (search, category, type, date range, pagination) | ✔ |
| POST   | `/api/transactions`                 | Create a transaction                  | ✔    |
| GET    | `/api/transactions/:id`             | Get one transaction                   | ✔    |
| PUT    | `/api/transactions/:id`             | Update a transaction                  | ✔    |
| DELETE | `/api/transactions/:id`             | Delete a transaction                  | ✔    |
| GET    | `/api/dashboard/summary`            | Total balance / income / expenses / monthly spending | ✔ |
| GET    | `/api/dashboard/monthly-summary`    | Income vs. expense per month          | ✔    |
| GET    | `/api/dashboard/category-summary`   | Totals grouped by category            | ✔    |
| GET    | `/api/dashboard/recent`             | Most recent transactions              | ✔    |

All protected routes expect `Authorization: Bearer <token>`.

## Notes

- Passwords are hashed with bcrypt (10 salt rounds) and never returned by the API.
- JWTs are stored in `localStorage` on the client and attached via an Axios request interceptor; a `401` response automatically logs the user out.
- Validation runs both client-side (form checks) and server-side (`express-validator` + Mongoose schema validation).
