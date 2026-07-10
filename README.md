Ledger – Full-Stack Expense Tracker

A modern full-stack expense tracking web application built with the MERN Stack. Ledger enables users to securely manage their finances with JWT-based authentication, transaction management, interactive analytics, and responsive dashboards.

Live Demo

Frontend: https://expense-tracker-nine-rho-67.vercel.app

Backend API: https://expense-tracker-backend-3umu.onrender.com/api

Features
Authentication
Secure user registration and login
JWT-based authentication
Password hashing with bcrypt
Protected API routes
Persistent user sessions
Dashboard
Current balance overview
Total income and expenses
Monthly spending summary
Recent transactions
Six-month income vs expense trend chart
Transaction Management
Add income and expense records
Edit existing transactions
Delete transactions
Search transactions
Filter by:
Category
Type
Date range
Pagination support
Reports & Analytics
Monthly income vs expense bar chart
Category-wise expense doughnut chart
Expense distribution
Financial summaries
Responsive UI
Mobile-friendly interface
Responsive sidebar
Clean Ledger-inspired design
Interactive charts using Chart.js
Tech Stack
Frontend
React
Vite
Tailwind CSS
Axios
React Router
Chart.js
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Authentication
bcrypt
Express Validator
Deployment
Vercel (Frontend)
Render (Backend)
MongoDB Atlas (Database)
Project Structure
expense-tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── ...
│
└── README.md
API Endpoints
Method	Endpoint	Description	Protected
POST	/api/auth/register	Register User	❌
POST	/api/auth/login	Login	❌
GET	/api/auth/me	Current User	✅
POST	/api/auth/logout	Logout	✅
GET	/api/transactions	Get Transactions	✅
POST	/api/transactions	Add Transaction	✅
PUT	/api/transactions/:id	Update Transaction	✅
DELETE	/api/transactions/:id	Delete Transaction	✅
GET	/api/dashboard/summary	Dashboard Summary	✅
GET	/api/dashboard/monthly-summary	Monthly Report	✅
GET	/api/dashboard/category-summary	Category Report	✅
Local Installation
Clone
git clone https://github.com/berwincr/expense-tracker.git
cd expense-tracker
Backend
cd backend
npm install

Create a .env file

PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

Run

npm run dev
Frontend
cd frontend
npm install

Create

VITE_API_URL=http://localhost:5000/api

Run

npm run dev
Security
Passwords hashed using bcrypt
JWT authentication
Protected API routes
Request validation with Express Validator
Server-side schema validation using Mongoose
Future Enhancements
Budget planning
Export reports as PDF/Excel
Recurring transactions
Dark mode
Email verification
Multi-currency support
AI-powered spending insights
Author

Berwin CR

GitHub: https://github.com/berwincr
