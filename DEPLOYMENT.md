# Deployment Guide — B'Day Made With Love 🚀

This document details how to deploy **B'Day Made With Love** to production environments such as Vercel, Netlify, or AWS Amplify with a Supabase PostgreSQL backend.

---

## 1. Supabase Backend Setup

### A. Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings > API**, note your:
   - `Project URL`
   - `anon public key`

### B. Run Migrations
Run the SQL migration scripts in order under the **SQL Editor** tab:
1. Copy contents of `supabase/migrations/20261021000001_initial_schema.sql` and execute.
2. Copy contents of `supabase/migrations/20261021000002_rls_and_storage.sql` and execute.

### C. Verify Storage Buckets
Ensure the following buckets are present in **Storage**:
- `memories` (Public: ON)
- `public-media` (Public: ON)
- `private-media` (Public: OFF)

### D. Configure Authentication
Under **Authentication > URL Configuration**:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**:
  - `https://your-domain.com/**`
  - `http://localhost:5173/**` (for local dev)

---

## 2. Deploying Frontend to Vercel

### Step 1: Connect GitHub Repository
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).

### Step 2: Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Set Environment Variables
Add the following under **Project Settings > Environment Variables**:
- `VITE_SUPABASE_URL`: `https://<your-project>.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `<your-anon-key>`
- `VITE_APP_URL`: `https://your-domain.vercel.app`

### Step 4: Configure SPA Fallback
Create `vercel.json` at root if routing redirects to 404 on page refresh:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 3. Production Verification Checklist

- [ ] Sign up a new user account at `/auth/sign-up`.
- [ ] Confirm confirmation email or disable email verification in Supabase Auth settings for instant activation.
- [ ] Create a new birthday project in Dashboard.
- [ ] Customize sections, upload a memory photo, and click **Publish**.
- [ ] Open the shareable URL `/birthday/<slug>` in an incognito window without being logged in.
- [ ] Verify that candles blow out and hidden surprises reveal smoothly.
