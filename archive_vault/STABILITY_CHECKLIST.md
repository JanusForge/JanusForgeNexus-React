🛰️ Janus Forge Nexus: Stability & Deployment Checklist
Use this checklist before starting a new development session or after any major architectural change to prevent "rollbacks" and "ReferenceErrors."

1. 🛡️ Pre-Flight: Database & Environment
• Neon Connection: Ensure `DATABASE_URL` in `.env` and Render includes `connect_timeout=20&pool_timeout=20`.

• Schema Sync: If you added a new model, verify it exists in the `AIParticipant` enum in `schema.prisma`.

• Phase Check: Run `UPDATE "DailyForge" SET phase = 'IDLE';` if the Scout refuses to start a new cycle.

2. 🏛️ Backend: The "Sequential Sight" Audit
• Variable Scope: Ensure `isGodMode`, `isBeta`, and `user` are defined inside the socket handler before the `councilQueue` loop.

• Prisma Mapping: Verify AI responses use `ai_model: ai.name` (Enum) instead of `name: ai.name` (String).

• Model IDs: Confirm `CLAUDE` is pointing to the 4.5 family IDs (`claude-opus-4-5-20251101`).

3. 🛰️ Scout & Automation
• Cold Start: Run `npx tsx ./src/scripts/aiScout.ts` locally first to "wake up" the database before testing on Render.

• Retry Logic: Ensure the script has the 5s sleep interval for Neon wake-ups.

4. 🚀 Deployment Safety
• Bracket Audit: Check the end of `src/server.ts` for a clean `httpServer.listen` and closing brackets to avoid `Unexpected end of file`.

• Render Logs: After pushing, watch the "Events" tab for the `Detected service running on port 5000` confirmation.

🧪 The "Dialectic" Test
After every deploy, ask the chat: "Claude, what do you think of Gemini's last point?"

• Success: Claude acknowledges Gemini by name.

• Failure: Claude gives a generic response (history is not passing correctly).
