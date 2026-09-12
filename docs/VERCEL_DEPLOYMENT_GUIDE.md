# MediMind AI - Vercel Deployment Guide

## 📋 Overview

This guide covers deploying MediMind AI to Vercel as a monorepo with separate frontend, backend, and database components.

## 🏗️ Architecture

```
MediMind-AI/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── database/          # PostgreSQL schemas & migrations
├── src/               # Root entry points (for Vercel build)
├── vercel.json        # Vercel configuration
└── package.json       # Root package.json
```

## 🚀 Deployment Options

### Option 1: Frontend Only (Recommended for Hackathon)

Deploy only the frontend to Vercel. Backend runs separately or uses mock data.

**Pros:**
- ✅ Simple deployment
- ✅ Fast builds
- ✅ Free tier sufficient
- ✅ No backend configuration needed

**Cons:**
- ❌ Backend must be deployed separately
- ❌ Need to configure API URL

### Option 2: Full Stack with Serverless Functions

Convert backend to Vercel serverless functions.

**Pros:**
- ✅ Single deployment
- ✅ Automatic scaling
- ✅ Integrated with frontend

**Cons:**
- ❌ Requires refactoring backend
- ❌ Cold starts
- ❌ Execution time limits (10s free, 60s pro)

### Option 3: Separate Deployments

Deploy frontend to Vercel, backend to Railway/Render/Heroku.

**Pros:**
- ✅ Best of both worlds
- ✅ Backend can use any technology
- ❌ Two deployments to manage

---

## 🎯 Option 1: Frontend Deployment (Recommended)

### Step 1: Prepare Repository

1. Ensure all code is committed to Git
2. Push to GitHub/GitLab/Bitbucket

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite configuration

### Step 3: Configure Build Settings

Vercel should auto-detect these settings from `vercel.json`:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com
VITE_DEFAULT_LANGUAGE=en
VITE_APP_NAME=MediMind AI
```

**Important:** All frontend environment variables must start with `VITE_` to be accessible in the browser.

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

### Step 6: Verify

Visit your deployed URL and verify:
- ✅ Landing page loads
- ✅ All routes work
- ✅ Language switching works
- ✅ API calls succeed (if backend is configured)

---

## 🔧 Option 2: Full Stack with Serverless Functions

### Step 1: Create API Directory

Create `api/` directory at root for serverless functions:

```bash
mkdir -p api
```

### Step 2: Convert Backend Routes to Serverless Functions

Example: `api/symptoms/analyze.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { symptomService } from '../backend/src/services/symptomService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input } = req.body;
    const result = await symptomService.analyzeSymptoms(input);
    return res.status(200).json({ success: true,  result });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
```

### Step 3: Update vercel.json

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Step 4: Update Frontend API Client

Update `frontend/services/apiClient.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

---

## 🌐 Option 3: Separate Backend Deployment

### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect your repository
4. Set root directory to `backend/`
5. Configure environment variables
6. Deploy

### Deploy Frontend to Vercel

1. Follow Option 1 steps
2. Set `VITE_API_URL` to your Railway URL

---

## 🔐 Environment Variables

### Frontend (Vercel Dashboard)

```bash
VITE_API_URL=https://your-backend-url.com
VITE_DEFAULT_LANGUAGE=en
VITE_APP_NAME=MediMind AI
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/webp
```

### Backend (Railway/Render/Heroku)

```bash
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/medimind
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-encryption-key
CORS_ORIGIN=https://your-frontend-url.vercel.app
AI_PROVIDER=mock
# AI_PROVIDER=openai
# OPENAI_API_KEY=your-openai-key
```

---

## 🗄️ Database Setup

### Option A: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run migrations from `database/migrations/`
4. Get connection string
5. Set `DATABASE_URL` in backend environment

### Option B: Railway PostgreSQL

1. Create PostgreSQL database in Railway
2. Get connection string
3. Run migrations
4. Set `DATABASE_URL` in backend environment

### Running Migrations

```bash
cd database
npm install
npm run migrate:up
```

---

## 🧪 Testing Deployment

### Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Backend deployed and accessible
- [ ] Frontend builds without errors
- [ ] All routes tested locally
- [ ] API endpoints tested
- [ ] File upload tested
- [ ] Language switching tested
- [ ] Error handling tested

### Post-Deployment Testing

1. **Landing Page**
   - [ ] Loads correctly
   - [ ] All CTAs work
   - [ ] Language switching works

2. **Lab Report Reader**
   - [ ] File upload works
   - [ ] Processing animation shows
   - [ ] Results display correctly
   - [ ] Language switching works

3. **Symptom Checker**
   - [ ] Input works
   - [ ] Analysis completes
   - [ ] Results display correctly

4. **API Integration**
   - [ ] API calls succeed
   - [ ] Error handling works
   - [ ] Timeout handling works

---

## 🐛 Common Issues

### Issue 1: Build Fails

**Symptom:** Build fails with module not found errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Environment Variables Not Working

**Symptom:** `import.meta.env.VITE_*` returns undefined

**Solution:**
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names match exactly

### Issue 3: API Calls Fail

**Symptom:** CORS errors or 404s

**Solution:**
- Check `VITE_API_URL` is set correctly
- Verify backend CORS configuration
- Check backend is running and accessible

### Issue 4: Routing Issues

**Symptom:** 404 on page refresh

**Solution:**
- Verify `vercel.json` has rewrites configured
- Check SPA routing is enabled

### Issue 5: Large Bundle Size

**Symptom:** Slow initial load

**Solution:**
- Enable code splitting (already configured)
- Optimize images
- Use lazy loading for routes

---

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Web Vitals
- Analytics
- Speed Insights

### Error Tracking

Consider adding:
- Sentry for error tracking
- LogRocket for session replay

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` → Production
- Pull requests → Preview deployments

### Branch Strategy

```
main           → Production
develop        → Staging
feat/*         → Preview deployments
```

---

## 🎯 Custom Domain

### Add Custom Domain

1. Vercel dashboard → Settings → Domains
2. Add your domain
3. Configure DNS records:
   - **Type:** A or CNAME
   - **Value:** Provided by Vercel
4. Wait for DNS propagation (up to 48 hours)
5. Enable HTTPS (automatic)

---

## 📈 Performance Optimization

### Already Implemented

- ✅ Code splitting
- ✅ Lazy loading
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Gzip compression

### Additional Optimizations

1. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Use responsive images

2. **Caching**
   - Configure cache headers (already in vercel.json)
   - Use service workers for offline support

3. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

---

## 🔒 Security Checklist

- [ ] No API keys in frontend code
- [ ] Environment variables properly configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data in logs

---

## 📞 Support

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/guides/deploying-vite-projects-with-vercel)

### MediMind AI Support
- Check `docs/` directory
- Review deployment logs in Vercel dashboard
- Check backend logs if applicable

---

## ✅ Deployment Success Criteria

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ All pages are accessible
- ✅ API calls succeed
- ✅ File uploads work
- ✅ Language switching works
- ✅ Performance is acceptable (< 3s load time)
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Accessibility compliant

---

## 🎉 You're Live!

Congratulations! Your MediMind AI application is now deployed to Vercel.

**Next Steps:**
1. Share your deployed URL
2. Test all features thoroughly
3. Monitor performance and errors
4. Gather user feedback
5. Iterate and improve

---

**Deployment Date:** ___________  
**Deployed URL:** ___________  
**Deployed By:** ___________
