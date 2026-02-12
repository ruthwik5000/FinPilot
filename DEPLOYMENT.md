# 🚀 FinMate Deployment Guide

Complete guide to deploy FinMate to production using GitHub, Vercel (frontend), and Render (backend).

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up with GitHub)
- Render account (sign up with GitHub)
- MongoDB Atlas already configured ✅

---

## Step 1: Push to GitHub

### 1.1 Initialize Git Repository

```bash
cd c:\Users\ASUS\OneDrive\Desktop\fin
git init
git add .
git commit -m "Initial commit - FinMate personal finance app"
```

### 1.2 Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (green button)
3. Repository name: `finmate`
4. Description: "Personal finance management app with AI"
5. **Keep it Public** (or Private if you prefer)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### 1.3 Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/finmate.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

### 2.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select **`finmate`** repository
4. Click **"Connect"**

### 2.3 Configure Service

**Basic Settings:**
- **Name:** `finmate-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `server`
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:** Click **"Add Environment Variable"** for each:

```
MONGO_URI=mongodb+srv://ruruth67:ruth123@ruruth.mt5w2xo.mongodb.net/finmate?retryWrites=true&w=majority

JWT_SECRET=finmate_super_secret_jwt_key_2026_production_change_this

PORT=5000

FRONTEND_URL=https://finmate.vercel.app

ALPHA_VANTAGE_KEY=WNHIASCM2WTQDKY8

AI_PROXY_URL=https://api.literouter.com/v1/chat/completions

AI_API_KEY=6fdd6bd8ee156023f6911e99241c39729a275e2db97baab79f36c29881df94ba
```

**Plan:** Select **"Free"**

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. **Copy your backend URL** (e.g., `https://finmate-backend.onrender.com`)

---

## Step 3: Update Frontend Configuration

### 3.1 Update API URL

Edit `client/.env`:

```env
VITE_API_URL=https://finmate-backend.onrender.com/api
```

**Replace with your actual Render URL!**

### 3.2 Commit Changes

```bash
git add client/.env
git commit -m "Update API URL for production"
git push
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub**
4. Authorize Vercel

### 4.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **`finmate`** repository
3. Click **"Import"**

### 4.3 Configure Project

**Framework Preset:** Vite (auto-detected)

**Root Directory:** Click **"Edit"** → Enter `client`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `dist` (auto-filled)
- Install Command: `npm install` (auto-filled)

**Environment Variables:** Click **"Add"**

```
VITE_API_URL=https://finmate-backend.onrender.com/api
```

**Replace with your actual Render backend URL!**

### 4.4 Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. **Your app is live!** 🎉

---

## Step 5: Update Backend CORS

### 5.1 Get Your Vercel URL

After deployment, Vercel will show your URL (e.g., `https://finmate-abc123.vercel.app`)

### 5.2 Update Render Environment Variable

1. Go to Render dashboard
2. Click on **`finmate-backend`** service
3. Go to **"Environment"** tab
4. Find **`FRONTEND_URL`**
5. Update value to: `https://finmate-abc123.vercel.app` (your actual Vercel URL)
6. Click **"Save Changes"**
7. Service will auto-redeploy

---

## Step 6: Test Your Deployed App

### 6.1 Open Your App

Go to your Vercel URL: `https://finmate-abc123.vercel.app`

### 6.2 Test All Features

1. **Register** a new account
2. **Login** with credentials
3. **Add expenses** - verify they persist
4. **Add investments** - check live prices load
5. **Add loans** - verify EMI calculation
6. **Test AI chat** - ask financial questions

### 6.3 Verify Database

1. Go to MongoDB Atlas
2. Browse Collections
3. See data from your production app!

---

## 🎉 Deployment Complete!

Your app is now live at:
- **Frontend:** `https://finmate-abc123.vercel.app`
- **Backend:** `https://finmate-backend.onrender.com`
- **Database:** MongoDB Atlas

---

## 📊 Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| **Vercel** | 100GB bandwidth/month | More than enough |
| **Render** | 750 hours/month | Sleeps after 15min inactivity |
| **MongoDB Atlas** | 512MB storage | ~10,000 documents |
| **AlphaVantage** | 500 requests/day | 5 per minute |

---

## ⚠️ Important Notes

### Render Free Tier Sleep

**Issue:** Backend sleeps after 15 minutes of inactivity
**Effect:** First request after sleep takes 30-60 seconds
**Solution:** Upgrade to paid plan ($7/month) for always-on

### Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records

**Render:**
1. Go to Service Settings → Custom Domain
2. Add domain and update DNS

---

## 🔄 Future Updates

### Update Code

```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push
```

**Both Vercel and Render will auto-deploy!** ✅

---

## 🐛 Troubleshooting

### Backend Not Responding

1. Check Render logs: Dashboard → Service → Logs
2. Verify all environment variables are set
3. Check MongoDB connection string

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` in Vercel environment variables
2. Check `FRONTEND_URL` in Render matches Vercel URL
3. Check browser console for CORS errors

### Database Connection Failed

1. Verify MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
2. Check connection string is correct
3. Verify database user has read/write permissions

---

## 💡 Tips

1. **Monitor Usage:** Check Vercel/Render dashboards regularly
2. **Set Up Alerts:** Enable email notifications for errors
3. **Backup Database:** Export MongoDB data periodically
4. **Use Environment Variables:** Never commit secrets to Git
5. **Test Before Deploy:** Always test locally first

---

## 🎯 Next Steps

1. **Add Custom Domain** - Make it professional
2. **Set Up Analytics** - Track user behavior
3. **Enable HTTPS** - Already enabled by default!
4. **Add Error Tracking** - Use Sentry or similar
5. **Optimize Performance** - Lighthouse audit

---

## 📞 Support

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

**Congratulations! Your FinMate app is now live and accessible worldwide!** 🌍🎉
