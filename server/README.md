# FinMate Backend Setup Guide

## 📋 Prerequisites

Before running the backend, you need to set up the following:

### 1. MongoDB Atlas (Free Tier)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. AlphaVantage API Key (Free)
1. Go to [AlphaVantage](https://www.alphavantage.co/support/#api-key)
2. Enter your email
3. Copy the API key you receive

### 3. AI Proxy (Optional)
- If you have an AI proxy URL, prepare it
- If not, the AI chat will work with fallback responses

---

## 🚀 Installation Steps

### Step 1: Navigate to Server Directory
```bash
cd c:\Users\ASUS\OneDrive\Desktop\fin\server
```

### Step 2: Create Environment File
Create a `.env` file in the `server` directory with the following content:

```env
# MongoDB Connection String (REQUIRED)
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret (REQUIRED - use any random string)
JWT_SECRET=finmate_super_secret_key_change_this_12345

# Server Port
PORT=5000

# AlphaVantage API Key (REQUIRED for stock prices)
ALPHA_VANTAGE_KEY=your_alphavantage_api_key_here

# AI Proxy URL (OPTIONAL)
AI_PROXY_URL=your_ai_proxy_url_here

# AI API Key (OPTIONAL)
AI_API_KEY=your_ai_api_key_here
```

**Replace the following:**
- `your_mongodb_connection_string_here` → Your MongoDB Atlas connection string
- `your_alphavantage_api_key_here` → Your AlphaVantage API key
- (Optional) AI proxy details if you have them

### Step 3: Start the Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API available at http://localhost:5000/api
```

---

## 🧪 Testing the Backend

### Test Health Check
Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2026-02-12T..."
}
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/:id` - Delete expense

### Investments
- `GET /api/investments` - Get all investments with current prices
- `POST /api/investments` - Create investment
- `DELETE /api/investments/:id` - Delete investment

### Loans
- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan (auto-calculates EMI)
- `PATCH /api/loans/:id` - Update paid months
- `DELETE /api/loans/:id` - Delete loan

### AI Chat
- `POST /api/ai` - Send message to AI assistant

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Verify your connection string is correct
- Make sure your IP address is whitelisted in MongoDB Atlas
- Check that your username/password are correct

### AlphaVantage API Not Working
- Verify your API key is correct
- Free tier has rate limits (5 requests/minute, 500/day)
- CoinGecko (crypto) doesn't require an API key

### Port 5000 Already in Use
Change the PORT in your `.env` file:
```env
PORT=5001
```

---

## 📁 Backend Structure

```
server/
├── models/
│   ├── User.js          # User schema
│   ├── Expense.js       # Expense schema
│   ├── Investment.js    # Investment schema
│   └── Loan.js          # Loan schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── expense.js       # Expense CRUD
│   ├── investment.js    # Investment + API integration
│   ├── loan.js          # Loan + EMI calculation
│   └── ai.js            # AI chat with context
├── middleware/
│   └── auth.js          # JWT authentication
├── server.js            # Main server file
├── .env                 # Environment variables (create this)
├── .env.example         # Environment template
└── package.json         # Dependencies
```

---

## ✅ Next Steps

Once the backend is running:
1. Keep the backend server running (`npm run dev`)
2. In a new terminal, start the frontend (`cd ../client && npm run dev`)
3. The frontend will connect to `http://localhost:5000/api`
4. You can now register, login, and use all features!

---

## 🎯 Features Implemented

- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ MongoDB integration
- ✅ Expense tracking with categories
- ✅ Investment portfolio with live prices (CoinGecko + AlphaVantage)
- ✅ Loan management with automatic EMI calculation
- ✅ AI chat with financial context
- ✅ Error handling and validation
- ✅ CORS enabled for frontend connection
