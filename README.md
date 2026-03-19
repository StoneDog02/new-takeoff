# Takeoff

**Open source.** Upload build plans (residential, commercial, landscaping, electrical, plumbing, framing, HVAC) and get an exact material takeoff list for faster contractor bids. Powered by Anthropic Claude.

## Quick start

1. **Install and run**

   ```bash
   npm install
   cp .env.example .env
   # Add your ANTHROPIC_API_KEY to .env
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000), drag or select a PDF or text build plan, and get a structured takeoff.

## Mirroring your Claude custom project

The takeoff behavior is controlled by a **single system prompt** in the codebase. To match your dialed-in custom project in Claude:

- Edit **`src/lib/takeoff-agent/prompt.ts`** and replace `TAKEOFF_SYSTEM_PROMPT` with the exact system instructions from your Claude project. That file is the only place that defines how the agent reads plans and formats the takeoff. No other config is required.

The app uses the same prompt on every request, so your custom project’s behavior is replicated here.

### Knowledge base (reference files)

Your Claude project’s **reference files, rules, and docs** live in the **`knowledge/`** folder at the project root:

1. Copy your 37 (or any) reference files into **`knowledge/`**.
2. Use **`.md`**, **`.txt`**, or **`.json`** (e.g. export or convert from .docx).
3. Files are loaded in **alphabetical order** by filename; use prefixes like `01-rules.md` if order matters.
4. They are appended to the system prompt on every takeoff so the agent has the same context as your custom project.

Content is cached after first load. Restart the dev server (or call `clearKnowledgeCache()` if you expose it) after adding or editing knowledge files.

## Structure

- **`src/app/`** — Next.js App Router: page, layout, API route.
- **`src/components/`** — UI: `FileUploader`, `TakeoffResultView`; export via `index.ts`.
- **`src/lib/takeoff-agent/`** — Takeoff agent: `prompt.ts` (system instructions), `get-system-prompt.ts` (prompt + knowledge), `load-knowledge.ts` (reads `knowledge/`), `client.ts` (Anthropic call, parsing), `index.ts` (public API).
- **`knowledge/`** — Reference files and rules (same role as your Claude project’s knowledge base). Supported: `.md`, `.txt`, `.json`.
- **`src/types/`** — Shared types (disciplines, takeoff result, API response).
- **`src/utils/`** — Constants and file validation; single helpers (e.g. `validatePlanFile`, `fileToBase64`).

Reusable logic lives in one place; components and API route import from these modules (DRY).

## Environment

| Variable            | Required | Description                          |
|---------------------|----------|--------------------------------------|
| `ANTHROPIC_API_KEY` | Yes      | API key from [console.anthropic.com](https://console.anthropic.com/). |

## Tech

- Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS.
- Anthropic Messages API with document (PDF/text) input; system prompt in codebase.

## License

Open source.
