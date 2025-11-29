Chat endpoint (backend)
======================

This project includes a lightweight chat endpoint at POST /api/chat. It accepts a JSON body:

  { message: string, history?: Array<{role:string,content:string}>, model?: string }

Behavior:
- If the env var OPENAI_API_KEY is set, the endpoint forwards the conversation to OpenAI's Chat Completion API (gpt-3.5-turbo by default).
- If OPENAI_API_KEY is not set, the endpoint returns a safe fallback reply from a small heuristic responder.

Notes:
- For good AI answers you should set an environment variable OPENAI_API_KEY on your server.
- Node.js 18+ includes fetch natively — if you run older Node versions add a fetch polyfill (e.g., node-fetch) and install it.

Security:
- When deploying, do NOT store API keys in client code. Keep OPENAI_API_KEY only on the server and don't commit secrets to your repo.
