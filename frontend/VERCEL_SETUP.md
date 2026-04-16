# 🚀 Vela Health — Vercel Deployment Setup Guide

## Step 1: Push to GitHub

Make sure the `frontend/` folder is pushed to your GitHub repository.

```bash
git add .
git commit -m "feat: deployment-ready frontend with mock data layer"
git push origin main
```

---

## Step 2: Create a Vercel Project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `frontend` (NOT the repo root)
4. Framework should auto-detect as **Next.js**
5. Click **Continue**

---

## Step 3: Add Environment Variables

In the Vercel project settings → **Environment Variables**, add ALL of these:

| Variable Name | Value | Required? |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase Web API Key | ✅ Required |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | ✅ Required |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `your-project-id` | ✅ Required |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | ✅ Required |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | ✅ Required |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID | ✅ Required |
| `NEXT_PUBLIC_API_URL` | Leave EMPTY for demo mode, OR your Render backend URL | ⚙️ Optional |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Your Mapbox public token | ⚙️ Optional |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://vela-health.vercel.app`) | ⚙️ Optional |

> **Where to find Firebase values**: Go to [Firebase Console](https://console.firebase.google.com) → Your Project → Project Settings → General → "Your apps" → Web app → SDK setup and configuration

> **Demo Mode**: If `NEXT_PUBLIC_API_URL` is left blank, the app runs in mock/demo mode — all pages show realistic sample data. This is perfect for showing your work.

---

## Step 4: Configure Firebase Auth

In [Firebase Console](https://console.firebase.google.com):

1. **Authentication** → **Settings** → **Authorized Domains**
2. Add your Vercel URL: `your-project.vercel.app`
3. Also add any custom domain if you have one

This allows Google Sign-In and Phone OTP to work on your deployed URL.

---

## Step 5: Deploy

Click **Deploy** in Vercel. Build takes ~2 minutes.

Your URL: `https://your-project-name.vercel.app`

---

## Demo Mode Behavior

When running without a backend (`NEXT_PUBLIC_API_URL` is empty):

| Feature | Behavior |
|---|---|
| Landing Page | ✅ Fully functional |
| Login (Google/Email/Phone) | ✅ Works (Firebase auth) |
| Patient Dashboard | ✅ Shows mock appointments + vitals |
| Sehat AI Chat | ✅ Streams realistic mock medical responses |
| Find Doctors | ✅ Shows 6 demo doctors with full profiles |
| Medical Records | ✅ Shows demo vitals + documents |
| Emergency SOS | ✅ Geolocation + dispatch UI works |
| Pharmacy / Labs | ✅ Shows demo products/tests |
| Family Network | ✅ Shows demo family members |
| Doctor Dashboard | ✅ Shows mock stats + appointments |
| Doctor Prescriptions | ✅ Full builder works (save is local) |
| Video Consultation | ⚠️ Needs real ZegoCloud credentials |
| File Upload | ⚠️ Needs Firebase Storage configured |

---

## Troubleshooting

**Build fails: Module not found**
→ Make sure Root Directory is set to `frontend/` in Vercel project settings

**Google Sign-In fails**
→ Add your Vercel domain to Firebase Auth → Authorized Domains

**Blank screen after login**
→ Check that all 6 Firebase env vars are set correctly in Vercel

**CSS not loading properly**
→ Vercel may cache old CSS — do a fresh deploy (Settings → Redeploy)
