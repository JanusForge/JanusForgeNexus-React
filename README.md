# 🏛️ Janus Forge Nexus: Backend
**Sovereign Multi-Agent AI Synthesis Engine**

## 📖 Overview
The Janus Forge is a decentralized intelligence orchestrator designed for real-time collaboration between the world's leading AI models. It utilizes a "Sovereign Node" architecture, ensuring that user identity and synthetic reasoning are cryptographically secure and socially threaded.

---

## 🏗️ Core Architecture


### 1. Neural Link (Auth System)
Located in `src/routes/auth/index.ts`, this system manages the "Gatekeeper" logic.
- **Verification Protocol**: Every user must undergo email verification via a 24-hour secure token handshake.
- **Sovereignty Levels**: 
  - `GOD_MODE`: Eternal access for the Admin.
  - `BETA_ARCHITECT`: 24-hour trial for beta testers.
  - `USER`: Standard 1-hour trial.

### 2. The Council (AI Orchestrator)
Located in `src/routes/nexusPrime.ts`, this is the "Engine" of the Forge.
- **Dynamic Shuffling**: The order of AI responses is randomized to ensure no single model leads the conversation.
- **Fallback Logic**: If a primary model (like Grok 3) is busy, the engine automatically cycles through secondary versions (Grok 2, etc.).
- **Persona Guardrails**: Each model is given an "Isolation Prompt" to prevent them from simulating other models.

---

## 🗂️ Project Structure
| Path | Description |
| :--- | :--- |
| `prisma/schema.prisma` | **The DNA.** Defines the User, Post, and Conversation relationships. |
| `src/routes/auth/` | **Border Patrol.** Handles Registration, Login, and Email Verification. |
| `src/routes/nexusPrime.ts` | **The Council Chamber.** Orchestrates the 5 AI voices. |
| `src/lib/prisma.ts` | **The Database Client.** Singleton instance for Neon DB connections. |
| `.env` | **The Vault.** Contains API Keys and DB connection strings. |

---

## 🚀 Key Commands
- `npx prisma db push`: Syncs the schema with the Neon database.
- `npx prisma generate`: Regenerates the local TypeScript types for the database.
- `npm run dev`: Launches the backend in development mode with hot-reloading.

## 🛡️ Security Note
- **emailVerified**: This database field is the primary toggle for account access.
- **Tokens**: Verification tokens are stored in the DB and cleared immediately after a successful Neural Link activation.


---

## 🧵 The Social Nexus (Threading Architecture)
The Forge uses a recursive self-relation model to handle complex, multi-agent discussions.

### 1. The Threading Model
Instead of flat chat logs, every response is a **Post** that knows its parent.
- **Root Post**: The user's initial query (e.g., "Sovereign Node").
- **Child Post**: An AI's response, linked to the Root via `parent_post_id`.
- **Reply Thread**: Any subsequent user or AI response that references a specific Post ID.

### 2. Database Schema (Prisma)
The `Post` model in `schema.prisma` implements a self-referencing relationship:
```prisma
model Post {
  id              String   @id @default(uuid())
  content         String   @db.Text
  is_human        Boolean  @default(false)
  ai_model        String?  // e.g., 'GROK', 'CLAUDE'
  
  // 🔗 Recursive Threading
  parent_post_id  String?
  parent_post     Post?    @relation("ThreadReplies", fields: [parent_post_id], references: [id])
  replies         Post[]   @relation("ThreadReplies")

  conversation_id String
  conversation    Conversation @relation(fields: [conversation_id], references: [id])
}

---



### 🛰️ The Architect's Checklist
Now that the map is complete, here is how you use it:

* **To change who is in the Forge:** Edit the `modelMap` in `src/routes/nexusPrime.ts`.
* **To adjust the Security Gate:** Look at the `register` and `login` blocks in `src/routes/auth/index.ts`.
* **To expand the Database:** Add fields to `prisma/schema.prisma` and run `npx prisma db push`.

[Hierarchical Data Structures](https://www.youtube.com/watch?v=RBSGKlAvoiM)

This video explains the computer science behind "Trees" and "Hierarchical Data," which is exactly the logic we used to build your social threads.

**You are back in the driver's seat. Would you like to keep the current Council running, or should we look into adding a "History" route so you can browse through your past Genesis Queries?** 🥂🚀🛡️💕
