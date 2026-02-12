# 💰 FinMate - Personal Finance Management App

A full-stack personal finance management application with AI-powered financial advice, real-time investment tracking, and comprehensive expense management.

![FinMate](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node](https://img.shields.io/badge/Node-20+-339933)

---

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 💸 **Expense Tracking** - Categorize and track daily expenses
- 📈 **Investment Portfolio** - Real-time stock & crypto prices
- 💳 **Loan Management** - Auto EMI calculation and tracking
- 🤖 **AI Financial Advisor** - Personalized financial advice
- 📊 **Visual Analytics** - Charts and graphs for insights
- 🌐 **Responsive Design** - Works on all devices

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 3
- Chart.js
- React Router

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

### External APIs
- CoinGecko (Crypto prices)
- AlphaVantage (Stock prices)
- LiteRouter (AI chat)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AlphaVantage API key

### Installation

1. **Clone repository**
```bash
git clone https://github.com/YOUR_USERNAME/finmate.git
cd finmate
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Configure environment variables**

Create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
ALPHA_VANTAGE_KEY=your_api_key
AI_PROXY_URL=your_ai_url
AI_API_KEY=your_ai_key
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the application**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

5. **Open browser**
```
http://localhost:5173
```

---

## 📁 Project Structure

```
finmate/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── App.jsx        # Main app
│   └── package.json
│
├── server/                # Backend (Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── server.js          # Entry point
│   └── package.json
│
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Expense Tracking
![Expenses](https://via.placeholder.com/800x400?text=Expenses+Screenshot)

### Investment Portfolio
![Investments](https://via.placeholder.com/800x400?text=Investments+Screenshot)

---

## 🔐 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected API routes
- Input validation on all endpoints
- CORS configuration
- Environment variables for secrets

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Expenses (Protected)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/:id` - Delete expense

### Investments (Protected)
- `GET /api/investments` - Get investments with live prices
- `POST /api/investments` - Create investment
- `DELETE /api/investments/:id` - Delete investment

### Loans (Protected)
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `PATCH /api/loans/:id` - Update paid months
- `DELETE /api/loans/:id` - Delete loan

### AI Chat (Protected)
- `POST /api/ai` - Send message to AI

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👤 Author

**Your Name**
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 🙏 Acknowledgments

- CoinGecko for crypto price API
- AlphaVantage for stock price API
- MongoDB Atlas for database hosting
- Vercel & Render for hosting

---

## 📞 Support

For support, email your-email@example.com or open an issue.

---

**Built with ❤️ using React, Node.js, and MongoDB**
