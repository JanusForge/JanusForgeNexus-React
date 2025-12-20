# PROJECT BRIEF: Janus Forge Nexus

## 🎯 Project Overview
**Janus Forge Nexus** is a multi-AI with human real-time conversation platform where AI models debate each other and humans can join the discussion. Named after Janus, the two-faced Roman god, it presents balanced arguments from multiple perspectives.

**Live Site**: https://janusforge.ai  
**Repo**: JanusForgeNexus-React  
**Status**: ✅ Production - Core UI complete, AI backend pending  

## 📁 Current Code Structure

/src
├── app/ # Next.js 14 App Router pages
│ ├── page.tsx # Homepage with Daily Forge preview
│ ├── layout.tsx # Root layout with metadata
│ ├── favicon.ico # Main favicon (25.9KB)
│ └── [15+ page routes]
├── components/
│ ├── Header.tsx # Main navigation
│ ├── Footer.tsx # Complete footer component
│ ├── auth/ # Authentication provider
│ └── layout/Footer.tsx
├── config/
│ └── tiers.ts # Pricing tier configurations
└── public/
├── logos/ # Brand assets & videos
├── favicon.svg # SVG favicon (1.4MB)
└── apple-touch-icon.png # iOS icon (placeholder)


## 🚀 Current Features - WORKING ✅
1. **Responsive UI** - Tailwind CSS with gradient aesthetics
2. **Homepage** - Video logo, Daily Forge preview, pricing grid
3. **The Daily Forge** - AI council preview with real 24-hour countdown timer & live simulation
4. **Authentication** - AuthProvider context setup
5. **Pricing System** - 4-tier model (free, basic, pro, enterprise)
6. **Deployment** - GitHub → Vercel auto-deployment pipeline
7. **Favicons/Metadata** - Proper social sharing configuration

## 🎨 Design System
- **Colors**: Gray-900/950 background, blue-purple-pink gradients
- **Font**: Inter (Next.js default)
- **Components**: Rounded cards, gradient borders, glow effects
- **Video Logo**: `/logos/nexus-video-logo.mp4` (440×440 container)

## 🏗️ Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Custom AuthProvider (to be integrated)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **State**: React hooks (useState, useEffect)

## 🔧 Recent Fixes (Completed)
- ✅ **Favicon conflict** - Removed manual `<link>` tags, let Next.js auto-handle
- ✅ **metadataBase warning** - Added production URL to layout metadata
- ✅ **Video container size** - Increased to w-110 h-110 (440px) for better visual impact
- ✅ **Daily Forge implementation** - Replaced "Platform Stats" with AI council preview & real countdown
- ✅ **Social metadata** - Open Graph & Twitter cards configured

## 🎯 Core Philosophy - "The Daily Forge"
**AI Scout → AI Council → Human Participation**
1. **AI Scout**: Searches datasphere for debate topics
2. **AI Council**: 3 AI systems + Scout debate daily topic
3. **Human Join**: Users add perspective via tokens/subscription
4. **24-hour Cycle**: Topic resets at midnight daily

## 📅 Immediate Next Priorities
### HIGH PRIORITY
1. **User Authentication** - Connect AuthProvider to backend
2. **Token System Backend** - Track token usage/balance
3. **Real AI Integration** - Connect to AI APIs for Daily Forge

### MEDIUM PRIORITY
4. **Apple Touch Icon** - Create proper 180×180 PNG
5. **Debate Interface** - Real-time chat UI for AI-human debates
6. **User Dashboard** - Token tracking, debate history

### LOW PRIORITY
7. **WebSocket Setup** - Real-time debate updates
8. **Analytics Dashboard** - Debate insights, user metrics
9. **Mobile App** - React Native wrapper

## 🔗 Critical File Paths
- `src/app/page.tsx` - Homepage with Daily Forge
- `src/app/layout.tsx` - Root layout with metadata
- `src/components/Footer.tsx` - Complete footer
- `src/components/Header.tsx` - Navigation header
- `src/config/tiers.ts` - Pricing configurations

## 🚨 Gotchas & Lessons Learned
1. **Next.js Favicons**: Place ONLY in `src/app/`, NO manual `<link>` tags
2. **Vercel Caching**: Use `--force` flag to bypass CDN cache
3. **Metadata**: Always set `metadataBase` for production URLs
4. **Video Optimization**: Keep videos in `/public/logos/` for easy access
5. **Project Memory**: Keep `PROJECT_BRIEF.md` updated and committed to Git

## 🎯 Success Metrics Needed
- [ ] User registration conversion rate
- [ ] Daily Forge participation rate
- [ ] Token purchase frequency
- [ ] Average debate duration

## 📞 Contact & Resources
**Developer**: Cassandra Raleigh
**Project Vision**: AI-to-AI-to-human discourse platform
**Last Updated**: 2024-12-20
**Next Review**: After auth system implementation

---

## 🧠 Conversation Memory Triggers
**START FUTURE CHATS WITH**: "Refer to PROJECT_BRIEF.md for context"
**KEY PHRASES**: "Daily Forge", "AI Council", "Token System", "Janus duality"
**TECH CONSTRAINTS**: Next.js App Router, Vercel deployment, TypeScript

> *"Where perspectives collide and wisdom emerges"*
