# Cryptolance Agent & Chat System

This project is a multi-agent platform for scouting freelancers, sending project proposals, and enabling real-time chat between clients and freelancers. It uses Next.js (frontend), FastAPI (backend), and Supabase (for real-time chat and message storage).

## Features
- Scout agent helps clients find and select freelancers.
- Project proposals are sent directly to freelancers' chat using Supabase.
- Real-time chat between clients and freelancers.
- All credentials and API keys are securely managed via environment variables.

## Setup

### 1. Environment Variables
Create a `.env.local` file in the project root with the following:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


- Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

### 2. FastAPI Backend (Python)
- Located at `src/app/agent/agent.py`.
- Uses environment variables for Supabase credentials.
- Run with:
  ```bash
  uvicorn src.app.agent.agent:app --reload
  ```

### 3. Next.js Frontend (JavaScript/TypeScript)
- Uses the same Supabase credentials from `.env.local`.
- Start with:
  ```bash
  npm run dev
  # or
  yarn dev
  ```

### 4. Project Proposal Flow
- Client uses the Agent UI to select a freelancer and provide project details.
- The Scout agent collects project details and prompts for the freelancer's wallet address.
- When both are provided, a project proposal message is sent to the freelancer's chat via Supabase.
- The freelancer sees the proposal in real time in their chat window.

### 5. Security
- All sensitive keys are loaded from environment variables.
- No credentials are hardcoded in the codebase.

## Notes
- Make sure to restart both frontend and backend servers after changing environment variables.
- Ensure your Supabase table `messages` has the correct schema and RLS policies for real-time chat.

---

For more details, see the code in `src/app/agent/agent.py`, `src/app/api/send-proposal/route.ts`, and `src/app/chat/ChatBox.tsx`.
