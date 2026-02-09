# UMS Deployment Guide

## Overview

This guide covers deploying the University Management System with:

- **Backend:** Render (Free Tier)
- **Frontend:** Vercel (Free Tier)
- **Database:** MongoDB Atlas (Free Tier)

---

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **MongoDB Atlas Account** - For cloud database
3. **Render Account** - For backend hosting
4. **Vercel Account** - For frontend hosting

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (remember username/password)
4. Whitelist IP `0.0.0.0/0` (allows all IPs for Render)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/umsystem?retryWrites=true&w=majority
   ```

---

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/umsystem.git

# Push
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New > Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `umsystem-backend`
   - **Region:** Oregon (or nearest)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Add **Environment Variables:**

   | Key              | Value                                                      |
   | ---------------- | ---------------------------------------------------------- |
   | `NODE_ENV`       | `production`                                               |
   | `PORT`           | `10000`                                                    |
   | `MONGODB_URI`    | `mongodb+srv://...` (your Atlas URI)                       |
   | `JWT_SECRET`     | `your-strong-secret-key-change-this`                       |
   | `JWT_EXPIRE`     | `7d`                                                       |
   | `FRONTEND_URL`   | `https://your-app.vercel.app` (update after Vercel deploy) |
   | `EMAIL_USER`     | `your-email@gmail.com` (optional)                          |
   | `EMAIL_PASSWORD` | `your-app-password` (optional)                             |

6. Click **Create Web Service**
7. Wait for deployment (takes 2-5 minutes)
8. Note your backend URL: `https://umsystem-backend.onrender.com`

---

## Step 4: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New > Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add **Environment Variables:**

   | Key            | Value                                       |
   | -------------- | ------------------------------------------- |
   | `VITE_API_URL` | `https://umsystem-backend.onrender.com/api` |

6. Click **Deploy**
7. Wait for deployment (takes 1-2 minutes)
8. Note your frontend URL: `https://your-app.vercel.app`

---

## Step 5: Update Backend CORS (Important!)

After getting your Vercel URL, go back to Render:

1. Go to your backend service
2. Click **Environment**
3. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
4. Click **Save Changes** (this triggers a redeploy)

---

## Step 6: Seed Initial Admin

After both services are deployed, you need to create the initial admin user.

### Option A: Use the Nuke Endpoint (for fresh start)

```bash
curl -X DELETE https://umsystem-backend.onrender.com/api/nuke-db
```

This creates: `admin@ums.com` / `admin123`

### Option B: Use MongoDB Compass

Connect to your MongoDB Atlas cluster and manually insert an admin user.

---

## ⚠️ IMPORTANT: Fix Hardcoded URLs

Before deploying, you MUST replace all hardcoded `http://localhost:5000` URLs in the frontend code.

**Files that need updating:**

- All files in `src/pages/student/`
- All files in `src/pages/faculty/`
- All files in `src/pages/admin/`
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ChangePassword.jsx`

**Replace pattern:**

```javascript
// BEFORE (hardcoded)
const response = await fetch('http://localhost:5000/api/students', {...})

// AFTER (using environment variable)
import { API_BASE_URL } from '../services/api';
const response = await fetch(`${API_BASE_URL}/students`, {...})
```

**For file URLs (like profile pictures or uploaded files):**

```javascript
// BEFORE
src={`http://localhost:5000/${student.profilePicture}`}

// AFTER
import { getServerUrl } from '../services/api';
src={`${getServerUrl()}/${student.profilePicture}`}
```

---

## Quick Fix: Search and Replace

Use VS Code's global search and replace:

1. Open VS Code
2. Press `Ctrl+Shift+H` (Find and Replace in Files)
3. Search for: `http://localhost:5000/api`
4. Replace with: `${API_BASE_URL}`
5. Then add the import at the top of each file:
   ```javascript
   import { API_BASE_URL } from "../services/api";
   // or for nested paths:
   import { API_BASE_URL } from "../../services/api";
   ```

For server URLs (files/uploads):

1. Search for: `http://localhost:5000` (not followed by /api)
2. Replace with: `${getServerUrl()}`
3. Add import: `import { getServerUrl } from '../services/api';`

---

## Verification Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend deployed on Render and showing "Running"
- [ ] Backend health check: `https://your-backend.onrender.com/` returns JSON
- [ ] Frontend deployed on Vercel
- [ ] FRONTEND_URL updated in Render environment
- [ ] All localhost URLs replaced in frontend code
- [ ] Admin account created
- [ ] Login works
- [ ] API calls work from frontend

---

## Troubleshooting

### CORS Errors

- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Make sure the URL doesn't have a trailing slash

### API Calls Fail

- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check Render logs for backend errors

### Render Free Tier Spin Down

- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for production

### MongoDB Connection Issues

- Verify IP `0.0.0.0/0` is whitelisted in Atlas
- Check connection string is correct
- Ensure database user has correct permissions

---

## Production Recommendations

1. **Remove the `/api/nuke-db` endpoint** before production
2. Use a strong, unique `JWT_SECRET`
3. Set up proper email service for password resets
4. Consider using Render's paid tier to avoid spin-down
5. Set up monitoring and error tracking (e.g., Sentry)
