# 🚀 Vercel Deployment Guide

## Why Vercel for PharmaLink?

- ✅ **All-in-One:** Deploy frontend AND backend in one place
- ✅ **Automatic HTTPS:** SSL certificates included
- ✅ **Serverless Functions:** Node.js backend runs as serverless API
- ✅ **South African CDN:** Fast loading in Cape Town/Johannesburg
- ✅ **Free Tier:** Perfect for MVP testing

---

## Quick Deployment (5 Minutes)

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

This will open your browser. Sign up/login with GitHub.

### Step 3: Deploy from Root Directory

```powershell
cd c:\Users\CAPACITI-JHB\Downloads\github-management-system
vercel
```

**Follow the prompts:**
- `Set up and deploy?` → **Y**
- `Which scope?` → Select your account
- `Link to existing project?` → **N**
- `What's your project's name?` → **pharmalink**
- `In which directory is your code located?` → **./** (just press Enter)

### Step 4: Configure Environment Variables

After initial deployment, add your environment variables:

```powershell
# JWT Secret
vercel env add JWT_SECRET production
# When prompted, paste: your_super_secret_32_char_minimum_key

# Database (if using Supabase)
vercel env add DB_HOST production
# Paste: db.xxx.supabase.co

vercel env add DB_USER production
# Paste: postgres

vercel env add DB_PASSWORD production
# Paste: your_supabase_password

vercel env add DB_NAME production
# Paste: postgres

vercel env add DB_PORT production
# Paste: 5432

vercel env add DB_SSL production
# Paste: true

# Paystack
vercel env add PAYSTACK_SECRET_KEY production
# Paste: sk_test_your_key_here
```

### Step 5: Redeploy with Environment Variables

```powershell
vercel --prod
```

---

## Your Live URLs

After deployment, you'll get:

**Frontend:**
```
https://pharmalink-your-username.vercel.app
```

**Backend API:**
```
https://pharmalink-your-username.vercel.app/api/auth/health-check
https://pharmalink-your-username.vercel.app/api/prescriptions
```

---

## Update Frontend to Use Vercel Backend

The frontend is already configured to auto-detect! Since Vercel hosts everything on the same domain, the API calls will automatically work. The connection logic in `index.html` will detect it's not localhost and use the production URL.

---

## Continuous Deployment

Every time you push to your GitHub repository, Vercel will automatically redeploy! No manual steps needed.

To enable:
1. Go to vercel.com/dashboard
2. Connect your `pharmalink` repository
3. Done! Every git push = automatic deployment

---

## Troubleshooting

### "Function timeout"
- By default, serverless functions timeout after 10 seconds
- For long-running processes, upgrade to Vercel Pro or optimize your code

### "Database connection error"
- Verify your environment variables are set correctly
- Check that Supabase allows connections from Vercel's IP range (it should by default)

### "CORS error"
- Update `pharmalink/backend/src/index.js` CORS settings:
```javascript
app.use(cors({
  origin: ['https://pharmalink-your-username.vercel.app'],
  credentials: true
}));
```

---

## Custom Domain (Optional)

Want `pharmalink.co.za`?

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Update your DNS records as instructed
4. SSL certificate is automatic!

---

## 🎯 Next Steps After Deployment

1. ✅ Test the health check: `https://your-app.vercel.app/api/auth/health-check`
2. ✅ Verify all 4 personas load correctly
3. ✅ Test a prescription submission (Doctor Portal)
4. ✅ Simulate a payment (Patient View)
5. ✅ Check the connection indicator shows "System Online"

---

**Need help? The Vercel deployment output will show any errors in real-time!**
