# SCENVY — Full Platform

Turn every place into a scrollable experience.

## Routes

| URL                    | What it shows              |
|------------------------|---------------------------|
| `/`                    | Landing page               |
| `/login`               | Login (demo accounts below)|
| `/dashboard`           | CMS Dashboard              |
| `/admin`               | Super Admin Panel          |
| `/l/:locationId`       | Guest Reel Experience      |

## Demo Accounts

| Email                 | Password   | Role        |
|-----------------------|------------|-------------|
| admin@scenvy.de      | admin123   | Super Admin |
| venue@scenvy.de      | venue123   | Tenant CMS  |

## API Endpoints

| Method | URL                  | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/reels           | List all reels           |
| POST   | /api/reels           | Create a reel            |
| PUT    | /api/reels           | Update a reel            |
| DELETE | /api/reels?id=xxx    | Delete a reel            |
| GET    | /api/locations       | List all locations       |
| POST   | /api/locations       | Create a location        |
| GET    | /api/tenants         | List all tenants (admin) |
| GET    | /api/analytics       | Get analytics data       |
| POST   | /api/ai/generate     | AI reel generation       |

## Setup

```bash
npm install
npm run dev         # Local dev at localhost:5173
```

## Deploy to Vercel

```bash
npm install -g vercel
vercel              # Follow prompts
```

## AI Generator Setup (optional)

1. Get your API key at console.anthropic.com
2. Vercel Dashboard → Project → Settings → Environment Variables
3. Add: `ANTHROPIC_API_KEY` = your key
4. Redeploy

## Production Checklist

- [ ] Replace localStorage auth with Clerk / Firebase / Supabase Auth
- [ ] Replace in-memory API storage with Postgres / Supabase
- [ ] Connect media uploads to Cloudflare Stream or AWS S3
- [ ] Add ANTHROPIC_API_KEY to Vercel env vars
- [ ] Set up a real domain in Vercel settings

---
Built with React + Vite + Vercel · app.scenvy.de
