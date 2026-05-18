# Deploy ClearPath AI Email Assistant

## Step 1 — Upload to GitHub
1. Go to github.com → New repository → name it: clearpath-email-ai
2. Upload all files in this folder
3. Commit

## Step 2 — Deploy to Vercel
1. vercel.com → Add New Project → import clearpath-email-ai
2. Deploy (leave settings as-is)
3. Copy your URL (e.g. https://clearpath-email-ai.vercel.app)

## Step 3 — Set up Google OAuth (so users can connect Gmail)
1. Go to console.cloud.google.com
2. Create a new project → name it "ClearPath AI"
3. APIs & Services → Enable APIs → search "Gmail API" → Enable
4. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: https://YOUR-VERCEL-URL/api/auth/callback/google
7. Copy Client ID and Client Secret

## Step 4 — Add Environment Variables to Vercel
In Vercel → Project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| ANTHROPIC_API_KEY | your sk-ant-... key |
| GOOGLE_CLIENT_ID | from Step 3 |
| GOOGLE_CLIENT_SECRET | from Step 3 |
| NEXTAUTH_SECRET | any random 32-char string (e.g. abc123xyz789abc123xyz789abc12345) |
| NEXTAUTH_URL | https://your-vercel-url.vercel.app |

## Step 5 — Redeploy
Vercel → Deployments → 3 dots → Redeploy

## Step 6 — Add to Shopify as a product
1. Shopify Admin → Products → Add product
2. Name: "ClearPath AI Email Assistant — Real Estate"
3. Price: $400/month (use a subscription app like Seal Subscriptions)
4. Description: paste the landing page copy
5. When customers buy, send them your Vercel URL to sign up
