# 🚀 PharmaLink: Complete Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development)
2. [Database Deployment](#database-deployment)
3. [Backend API Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Production Checklist](#production-checklist)

---

## 1️⃣ Local Development Setup

### Step 1: Clone and Install
```powershell
# Navigate to your project
cd pharmalink

# Install backend dependencies
cd backend
npm install

# Return to pharmalink root
cd ..
```

### Step 2: Configure Environment Variables
```powershell
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit with your credentials
notepad backend/.env
```

**Required Variables:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_key_here_min_32_chars

# Database (Start with local, then move to cloud)
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pharmalink
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=false

# Paystack (Get from https://dashboard.paystack.com)
PAYSTACK_SECRET_KEY=sk_test_your_key_here
```

### Step 3: Initialize Database
```powershell
# Option A: Use PostgreSQL locally
# Install PostgreSQL from https://www.postgresql.org/download/windows/

# Create database
psql -U postgres
CREATE DATABASE pharmalink;
\q

# Run schema
psql -U postgres -d pharmalink -f backend/schema.sql

# Option B: Use Supabase (Recommended for MVP)
# See section 2 below
```

### Step 4: Start Development
```powershell
# Use the one-click launcher
./START_PHARMALINK.ps1

# OR manually:
cd backend
npm run dev   # Uses nodemon for auto-reload

# In another terminal
start ../index.html
```

---

## 2️⃣ Database Deployment (Supabase - Recommended)

### Why Supabase?
- ✅ Free tier includes 500MB database
- ✅ Automatic backups
- ✅ POPIA-compliant (can select SA region)
- ✅ Built-in authentication (optional)
- ✅ Real-time subscriptions

### Setup Steps:

1. **Create Account**
   - Go to https://supabase.com
   - Sign up with GitHub

2. **Create Project**
   - Project Name: `PharmaLink`
   - Database Password: (save this securely)
   - Region: `South Africa (Cape Town)` or closest

3. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the "Connection string" under "Connection pooling"
   - Example: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`

4. **Initialize Schema**
   - Open SQL Editor in Supabase
   - Copy contents of `backend/schema.sql`
   - Paste and click "Run"

5. **Update .env**
   ```env
   DB_USER=postgres
   DB_HOST=db.xxx.supabase.co
   DB_NAME=postgres
   DB_PASSWORD=your_supabase_password
   DB_PORT=5432
   DB_SSL=true
   ```

---

## 3️⃣ Backend API Deployment (Railway/Render)

### Option A: Railway (Easiest)

1. **Install Railway CLI**
   ```powershell
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy**
   ```powershell
   cd backend
   railway init
   railway up
   ```

3. **Set Environment Variables**
   - Go to Railway dashboard
   - Click your project → Variables
   - Add all variables from your `.env`

4. **Get Your API URL**
   - Railway will give you: `https://pharmalink-backend.up.railway.app`

### Option B: Render

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Add all `.env` variables

---

## 4️⃣ Frontend Deployment (GitHub Pages)

### Already Complete! ✅

Your frontend is deployed at:
```
https://raphasha27.github.io/pharmalink/
```

### Connect to Production Backend

Edit `index.html` (line ~850):
```javascript
// Change this:
const API_URL = 'http://localhost:3000';

// To your production backend:
const API_URL = 'https://pharmalink-backend.up.railway.app';
```

Then commit and push:
```powershell
git add index.html
git commit -m "feat: Connect to production backend"
git push pharmalink gh-pages:main
```

---

## 5️⃣ Production Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong 32+ character random string
- [ ] Enable SSL/TLS on backend (Railway does this automatically)
- [ ] Set `NODE_ENV=production` in backend environment
- [ ] Restrict CORS to your frontend domain only
- [ ] Enable rate limiting (already in code, verify it's active)

### Database
- [ ] Verify Supabase is in Cape Town region (POPIA compliance)
- [ ] Enable automatic backups
- [ ] Set up read replicas if traffic increases
- [ ] Create indexes on frequently queried columns

### Monitoring
- [ ] Set up Supabase alerts for database performance
- [ ] Monitor Railway logs for backend errors
- [ ] Set up uptime monitoring (UptimeRobot - free tier)
- [ ] Create error tracking (Sentry - optional)

### Testing
- [ ] Test all 4 personas (Doctor, Pharmacy, Driver, Patient)
- [ ] Verify Medical Aid billing calculations
- [ ] Test Paystack payment flow (use test keys first)
- [ ] Verify biometric simulation works
- [ ] Check temperature alerts trigger correctly

### Go-Live
- [ ] Update Paystack to production keys
- [ ] Add custom domain (optional): pharmalink.co.za
- [ ] Create demo accounts for each persona
- [ ] Prepare investor/client demo script
- [ ] Document API endpoints

---

## 📞 Quick Links

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | https://raphasha27.github.io/pharmalink/ | User dashboard |
| Backend | (Set up Railway) | API & WebSocket server |
| Database | (Set up Supabase) | PostgreSQL + backups |
| Paystack | https://dashboard.paystack.com | Payment gateway |

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Check your DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Verify Supabase project is running
- Test connection: `psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"`

### "WebSocket connection failed"
- Ensure backend is running
- Check if firewall is blocking port 3000
- Verify CORS settings in `backend/src/index.js`

### "Paystack payment not working"
- Confirm you're using test keys in development
- Check webhook URL is correct
- Verify PAYSTACK_SECRET_KEY is set

---

## 🎓 Next Steps

1. ✅ Enable GitHub Pages (you're doing this now)
2. 🔄 Set up Supabase database
3. 🔄 Deploy backend to Railway
4. 🔄 Connect frontend to production backend
5. 🔄 Test end-to-end flow
6. 🚀 Launch!

**Need help with any step? Let me know!**
