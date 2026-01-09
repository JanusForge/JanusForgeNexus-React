# Janus Forge Nexus: Deployment Guide

**Last Updated:** January 09, 2026  
**Project Status:** Production Live  
**Deployment Platforms:** Vercel (Frontend) + Render (Backend) + Neon (Database)

This guide provides step-by-step instructions to deploy, update, and maintain Janus Forge Nexus.

## 1. Prerequisites

Before deploying, ensure you have:

- Git installed
- Node.js 18+ and npm/pnpm/yarn
- Accounts on:
  - GitHub (for repo hosting)
  - Vercel (for frontend)
  - Render (for backend)
  - Neon.tech (PostgreSQL database)
  - Stripe (for token purchases)
  - Resend (for emails)
  - Google AI Studio / Gemini API key
  - xAI Grok API key
  - DeepSeek API key
  - Anthropic (Claude) API key (optional)

## 2. Project Structure

Two separate repositories:

- **Frontend**: `JanusForgeNexus-React` (Next.js 14, App Router)
- **Backend**: `JanusForgeNexus-Backend` (Express + Socket.io)

Both should be pushed to GitHub.

## 3. Database Setup (Neon PostgreSQL)

1. Create a new project in Neon.tech
2. Choose **Professional Tier** ($19/mo) for production reliability
3. Get the **pooler connection string** (ends with `-pooler`)
4. Set as `DATABASE_URL` in both frontend `.env.local` and backend `.env`

Run Prisma migrations (backend only):
```bash
cd JanusForgeNexus-Backend
npx prisma migrate deploy
npx prisma generate
```

## 4. Environment Variables

### Frontend (.env.local / Vercel Environment Variables)

```env
NEXT_PUBLIC_API_URL=https://janusforgenexus-backend.onrender.com
```

### Backend (.env / Render Environment Variables)

```env
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[db]?sslmode=require&connect_timeout=20&pool_timeout=20  # Neon pooler URL

GEMINI_API_KEY=your-google-gemini-key
DEEPSEEK_API_KEY=your-deepseek-key
GROK_API_KEY=your-xai-grok-key
ANTHROPIC_API_KEY=your-claude-key  # Optional
OPENAI_API_KEY=your-openai-key     # Optional for GPT

RESEND_API_KEY=your-resend-key

STRIPE_SECRET_KEY=sk_live_...

PORT=5000  # Render requires this
```

## 5. Deploy Frontend (Vercel)

1. Go to vercel.com → New Project → Import Git Repository → JanusForgeNexus-React
2. Framework Preset: **Next.js**
3. Root Directory: leave blank (or `/` if monorepo)
4. Environment Variables: add `NEXT_PUBLIC_API_URL`
5. Deploy → automatic on every push to main

## 6. Deploy Backend (Render)

1. Go to render.com → New → Web Service → Connect GitHub repo (JanusForgeNexus-Backend)
2. Runtime: **Node**
3. Build Command: `npm install`
4. Start Command: `npm start` (which runs `tsx src/server.ts`)
5. Port: 5000 (Render exposes it)
6. Environment Variables: add all from .env above
7. Cron Jobs (for automation):
   - Scout: `0 5 * * *` → `npx tsx src/scripts/aiScout.ts` (midnight EST)
   - Vote/Debate: `5 5 * * *` → `npx tsx src/scripts/aiVoteAndDebate.ts` (~5 min after)
8. Deploy → automatic on push to main

## 7. Post-Deployment Checklist

1. Visit https://janusforge.ai → loads frontend
2. Check https://janusforgenexus-backend.onrender.com/ → `{ "status": "ONLINE", ... }`
3. Register new account → receive verification email (Resend)
4. Click verify link → redirects to success page (no 404)
5. Log in → works
6. Visit /daily-forge → see current topic, votes, debate, interject (1 token)
7. Wait for midnight EST cron → new forge appears automatically

## 8. Common Troubleshooting

- **Login fails**: Check `emailVerified = true` in Neon DB
- **Interjection 500**: Ensure `ai_model` uses valid `AIParticipant` enum values
- **Gemini 404**: Use `gemini-3-flash-preview` or `gemini-2.5-flash`
- **Timer drift**: Ensure `aiScout.ts` sets date to midnight EST (05:00 UTC)
- **Email not sending**: Verify RESEND_API_KEY in Render env vars

## 9. Updating the Site

1. Make changes locally
2. Commit & push to main (both repos)
3. Vercel/Render auto-deploy
4. Run `npx prisma migrate deploy` if schema changes (backend only)

## 10. Backup & Safety

- **Daily backups**: Neon has point-in-time recovery
- **Git**: All code versioned
- **Manual reset**: Use GOD_MODE /force-new-topic endpoint

**Deployed & Live:** https://janusforge.ai  
**Backend Health:** https://janusforgenexus-backend.onrender.com

For questions, contact the Architect: Cassandra Williamson  
Happy forging! 🚀
