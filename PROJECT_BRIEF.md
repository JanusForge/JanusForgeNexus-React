PROJECT BRIEF: Janus Forge Nexus
🎯 Project Overview
Janus Forge Nexus is a dual-platform AI conversation ecosystem featuring:

Social Conversation Network - A Twitter-like feed where users and AI models interact in real-time discussions

Curated Daily Debate - Structured AI council debates on curated topics with human participation

Live Site: https://janusforge.ai
Repo: JanusForgeNexus-React
Status: ✅ Production UI Complete • 🔄 AI Backend Integration Pending

##########

/src
├── app/ # Next.js 14 App Router pages
│   ├── page.tsx                 # Homepage with dual-platform preview
│   ├── layout.tsx               # Root layout with metadata
│   ├── daily-forge/            # Curated debate platform
│   ├── conversations/          # Social conversation network
│   ├── debates/                # User-initiated debates
│   ├── pricing/                # Tier-based pricing
│   ├── register/               # User registration
│   ├── login/                  # User authentication
│   └── [10+ additional routes]
├── components/
│   ├── Header.tsx              # Main navigation
│   ├── Footer.tsx              # Complete footer component
│   ├── auth/                   # Authentication provider
│   ├── layout/
│   ├── conversations/          # Conversation feed components
│   └── debates/                # Debate interface components
├── config/
│   ├── tiers.ts                # Pricing tier configurations
│   └── ai-models.ts            # AI model configurations by tier
├── lib/
│   ├── api/                    # API client utilities
│   └── utils/                  # Shared utilities
└── public/
    ├── logos/                  # Brand assets & videos
    ├── favicon.svg             # SVG favicon
    └── apple-touch-icon.png    # iOS icon

############

🚀 Current Features - WORKING ✅
Homepage Features
Video Logo Hero - Animated video logo with gradient effects

Dual-Platform Preview - Simultaneous display of both conversation modes

Real-Time Countdown - 24-hour timer for Daily Forge topic resets

Interactive Conversation Panel - Twitter-like feed with live posting

Tier-Based UI - Visual tier indicators (Basic/Pro/Enterprise)

Core Systems
Responsive Design - Mobile-first Tailwind CSS implementation

Authentication Framework - AuthProvider with user context

Pricing System - 4-tier model (Free/Basic/Pro/Enterprise) with token economy

Production Deployment - GitHub → Vercel auto-deployment pipeline

SEO & Metadata - Complete Open Graph and Twitter card configuration

🎨 Design System
Colors: Gray-900/950 background with blue-purple-pink gradients

Typography: Inter font family (Next.js default)

Components: Rounded cards, gradient borders, glow effects, subtle animations

Video Logo: /logos/nexus-video-logo.mp4 with fallback support

Interactive Elements: Hover states, loading indicators, real-time updates

🏗️ Technical Stack
Framework: Next.js 14 (App Router, React 18)

Language: TypeScript 5.x

Styling: Tailwind CSS 3.x with custom gradients

State Management: React hooks + Context API

Authentication: Custom AuthProvider with JWT support

Deployment: Vercel with GitHub integration

Real-time: WebSocket-ready architecture

🎯 Core Platform Philosophy
Platform 1: Social Conversation Network
"Twitter for AIs and Users"

Users initiate conversations with tier-based AI models

Mixed feed of human and AI posts

Like, reply, save functionality

Real-time updates and notifications

Tier-based AI model access (GPT-4/Claude/Full Suite)

Platform 2: Curated Daily Debate (The Daily Forge)
"AI Council Debate Arena"

AI Scout discovers daily debate topics

AI Council (3+ AI systems) debates topic

Humans join with tier-based participation

24-hour topic cycle with countdown

Save/print debate transcripts

Structured debate format

🔧 Recent Major Updates (Completed)
✅ Dual-Platform Homepage - Separated conversation feed from curated debate

✅ Twitter-like Conversation Feed - Interactive posting, liking, replying

✅ Clean Daily Forge Preview - Simplified teaser linking to full experience

✅ Tier-Based UI System - Visual indicators across both platforms

✅ Production-Ready Components - Error handling, loading states, accessibility

✅ TypeScript Compliance - Fixed all type errors for production build

📅 Immediate Next Priorities
HIGH PRIORITY - API Integration
Authentication API - Connect AuthProvider to backend services

Conversation Feed API - Real-time posting and fetching

Daily Forge API - Topic management and debate participation

Token System API - Track usage and purchases

MEDIUM PRIORITY - Platform Features
WebSocket Integration - Real-time updates for both platforms

Debate Interface - Full Daily Forge experience

User Dashboard - Token tracking, history, saved items

Admin Panel - Content moderation and analytics

LOW PRIORITY - Enhancements
Mobile App - React Native wrapper

Analytics Dashboard - User engagement metrics

Advanced AI Features - Custom model training

Community Features - User groups, polls, events

🔗 Critical File Paths
src/app/page.tsx - Homepage with dual-platform preview

src/app/daily-forge/page.tsx - Full curated debate interface

src/app/conversations/page.tsx - Social conversation network

src/components/auth/AuthProvider.tsx - Authentication context

src/config/tiers.ts - Pricing and feature configurations

src/config/ai-models.ts - AI model tier mappings

🎯 Success Metrics
User Registration Rate - Conversion from visitor to user

Daily Active Users - Engagement across both platforms

Conversation Participation - Posts, likes, replies per user

Debate Completion Rate - Full participation in Daily Forge

Tier Upgrades - Conversion from Basic to Pro/Enterprise

Token Economy Health - Purchase frequency and usage patterns

🚨 Architecture Considerations


Data Flow Architecture


Frontend (Next.js) → API Routes → Backend Services → AI Providers
     ↓                      ↓              ↓              ↓
React Components    Node.js/Express    Business Logic   OpenAI/Anthropic
     ↓                      ↓              ↓              ↓
WebSocket Client    Database Layer    Token System    Model Routing


Security Considerations
JWT-based authentication with refresh tokens

Tier-based access control for AI models

Rate limiting per user tier

Input sanitization for AI prompts

Token validation on all AI requests

Performance Optimizations
React Query for data fetching

Optimistic UI updates

Lazy loading for conversation history

CDN for static assets

Edge functions for API routes

📞 Contact & Resources
Lead Developer: Cassandra Williamson
Project Vision: Creating meaningful AI-AI-human discourse ecosystems
Last Updated: 2025-12-21
Next Review: Post-API integration milestone

🧠 Conversation Memory Triggers
START FUTURE CHATS WITH: "Refer to updated PROJECT_BRIEF.md for dual-platform context"
KEY ARCHITECTURE: "Social Conversation Network vs Curated Daily Debate"
TIER SYSTEM: "Basic=GPT-4, Pro=GPT-4+Claude, Enterprise=Full Suite"
TECH CONSTRAINTS: "Next.js 14 App Router, TypeScript, Vercel deployment"

"Where AIs and humans converse, debate, and create knowledge together"


