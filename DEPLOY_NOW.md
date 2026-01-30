# 🚀 PharmaLink - Vercel Deployment Instructions

## ✅ Setup Complete!

I've configured your PharmaLink application for Vercel deployment. Everything is ready to go live!

---

## 🎯 Deploy Now (3 Steps)

### Step 1: Open a **NEW** PowerShell Window

The Vercel CLI was just installed globally, so you need to refresh your terminal to access it.

1. Close this PowerShell terminal
2. Open a new PowerShell window
3. Navigate back to your project:
   ```powershell
   cd C:\Users\CAPACITI-JHB\Downloads\github-management-system
   ```

### Step 2: Login to Vercel

```powershell
vercel login
```

- Your browser will open
- Sign up/login with your **GitHub account** (recommended)
- Approve the connection

### Step 3: Deploy!

```powershell
vercel
```

**Answer the prompts:**
- `Set up and deploy?` → **Y** (Yes)
- `Which scope?` → Select your username
- `Link to existing project?` → **N** (No)
- `What's your project's name?` → **pharmalink** (or press Enter to use default)
- `In which directory is your code located?` → **./** (just press Enter)
- `Want to override the settings?` → **N** (No, our vercel.json is perfect!)

**That's it!** Vercel will:
1. ✅ Upload your code
2. ✅ Build the frontend
3. ✅ Deploy the backend as serverless functions
4. ✅ Give you a live URL like: `https://pharmalink-xxx.vercel.app`

---

## 🔒 Add Environment Variables (After First Deploy)

Once deployed, add your secrets:

```powershell
# JWT Authentication
vercel env add JWT_SECRET

# When prompted, enter: your_super_secret_minimum_32_characters_long

# Then redeploy to apply:
vercel --prod
```

For database credentials (Supabase), repeat for each:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `DB_SSL`

---

## 📊 What You'll Get

**Live URLs:**
- **Dashboard:** `https://pharmalink-xxx.vercel.app/`
- **Backend Health Check:** `https://pharmalink-xxx.vercel.app/api/auth/health-check`
- **All API Routes:** `https://pharmalink-xxx.vercel.app/api/*`

**Auto-Features:**
- ✅ HTTPS (SSL) automatic
- ✅ Global CDN (fast in South Africa)
- ✅ Auto-deployment on every `git push`
- ✅ Preview deployments for testing

---

## 🔄 Continuous Deployment (Optional but Recommended)

To auto-deploy whenever you push code to GitHub:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `pharmalink` project
3. Go to **Settings → Git**
4. Connect your GitHub repository: `Raphasha27/pharmalink`

Now every `git push` = automatic redeploy! 🎉

---

## ✨ Test Your Live Site

Once deployed:

1. Open the URL Vercel gives you
2. Check the sidebar - it should show "**System Online**" (green dot)
3. Test all 4 personas (Pharmacy, Doctor, Driver, Patient)
4. Try submitting a prescription
5. Simulate a payment with Paystack

---

## 📞 Need Help?

If you see any error during deployment:
- Vercel shows real-time logs
- Read the error message
- Most common fix: Make sure `package.json` exists in `/pharmalink/backend/`
- I've already configured everything, so it should work on first try!

**Your PharmaLink platform is ready for the world!** 🇿🇦💊
