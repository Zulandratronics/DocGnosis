# DocGnosis

A proactive full-stack AI document suite that categorizes texts, builds skill matrices and learning roadmaps, and supports offloading actionable tasks through a server-side Gemini API backend.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide icons
- **Backend:** Express (server.ts) + @google/genai with exponential-backoff retry handling

## Local Setup

**Prerequisites:** Node.js 20+ and a Google Gemini API key.

1. Install dependencies:
   `ash
   npm install
   `
2. Copy .env.example to .env and add your API key:
   `env
   GEMINI_API_KEY=your_gemini_api_key_here
   `
3. Run in development mode:
   `ash
   npm run dev
   `
4. Build and run for production:
   `ash
   npm run build
   npm start
   `

## License

MIT — see [LICENSE](./LICENSE).