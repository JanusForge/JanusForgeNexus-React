# Janus Forge Nexus: Key File Structure (as of January 09, 2026)

This document lists the most important and actively used files in the project. It is maintained for transparency, onboarding, and investor/technical review purposes.

## Frontend (Next.js / Vercel) - Repository: JanusForgeNexus-React

- **src/app/daily-forge/page.tsx**  
  Main Daily Forge page: displays current forge, topic selection transparency, council votes, initial debate, community interjections, interjection form (token-gated), timer, and history grid.

- **src/app/login/page.tsx**  
  Login page: handles user sign-in with email/password, shows verification success message on ?verified=true, error handling.

- **src/app/login/verify-success/page.tsx**  
  Post-verification success page: shows confirmation UI after clicking verification link, auto-redirects to /login after 5 seconds.

- **src/app/register/page.tsx** (implied, not shown but standard)  
  Registration page: collects email, username, password, submits to /api/auth/register.

- **src/app/pricing/page.tsx**  
  Pricing & token purchase page: displays plans, triggers Stripe checkout.

- **src/components/auth/AuthProvider.tsx**  
  Authentication context provider: manages user state, login/register/logout functions, handles flat API responses, stores user in localStorage.

- **src/lib/api.ts** (implied)  
  API fetch helpers for conversations, daily-forge endpoints, etc.

## Backend (Express / Render) - Repository: JanusForgeNexus-Backend

### Core Server & Socket
- **src/server.ts**  
  Main Express server + Socket.io: handles real-time council responses, routes mounting, auth, Stripe, admin manual archive, council queue (3 AIs for Daily Forge, 5 for Live Showdown), Gemini model fixed to gemini-3-flash-preview.

### Routes
- **src/routes/auth.ts**  
  Authentication endpoints: /register (with email verification), /login (checks emailVerified), /verify-email (activation), /resend-verification.

- **src/routes/conversations.ts**  
  Conversation & post endpoints: list user convos, get single convo/posts, create convo, create post (triggers council response), fixed ai_model enum usage.

- **src/routes/dailyForge.ts**  
  Daily Forge API: /current (get active forge), /history (get past forges), /force-new-topic (GOD_MODE only: full scout + vote + debate cycle).

### Scripts (Cron & Automation)
- **src/scripts/aiScout.ts**  
  Daily topic scout: runs at midnight EST, generates 3 topics using randomized AI (Gemini fixed to gemini-3-flash-preview), creates forge in TOPIC_SELECTION.

- **src/scripts/aiVoteAndDebate.ts**  
  Voting & initial debate: runs ~5-10 min after scout, votes on topics, selects winner, generates randomized 3-post debate, updates forge to CONVERSATION.

### Prisma & Config
- **prisma/schema.prisma**  
  Database schema: User (with emailVerified, verificationToken, etc.), DailyForge, Conversation, Post, TokenTransaction, enums (UserRole, AIParticipant).

- **.env**  
  Environment variables: DATABASE_URL (Neon pooler), GEMINI_API_KEY, DEEPSEEK_API_KEY, GROK_API_KEY, RESEND_API_KEY, STRIPE_SECRET_KEY, etc.

### Business & Documentation
- **BUSINESS_PLAN.md**  
  Token economics, 90% margin model, growth phases.

- **MARKETING_STRATEGY.md**  
  Social media funnel, content pillars, virality hacks.

- **PROJECT_BRIEF.md**  
  Vision, current status, technical stack.

- **README.md**  
  Project overview, setup, deployment instructions.

- **STABILITY_CHECKLIST.md**  
  Pre-flight checks, deployment safety, dialectic test.

## Deployment & Infrastructure
- **Render** → Backend (Express + cron jobs)
- **Vercel** → Frontend (Next.js)
- **Neon** → PostgreSQL Professional Tier database
- **Resend** → Email delivery (verification, resets)
- **Stripe** → Token purchases

This structure is current and complete as of January 09, 2026. All core features (autonomy, email verification, token gating, admin override) are live and functional.
