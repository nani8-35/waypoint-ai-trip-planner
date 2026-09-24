# Waypoint — AI trip planner

Waypoint turns a free-form trip brief into a structured, editable day-by-day itinerary. It is deliberately an interactive planning tool, not a chat interface: each stop can be expanded by day, reordered, or removed.

## Data shape

The backend requests JSON with a trip title, summary, days, and fully structured stops (name, description, time, duration, and optional tip). The browser validates this response before it reaches the UI. Malformed JSON, wrong-shaped data, empty responses, slow requests, failed requests, and stale responses all route to visible, recoverable states.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`.
3. Add an OpenAI-compatible provider key to `LLM_API_KEY`. Optionally update `LLM_BASE_URL` and `LLM_MODEL`.
4. Start the API and frontend together: `npm start`
5. Open the local Vite address displayed in the terminal.

`npm run dev` is an equivalent development shortcut. Build the client with `npm run build`.

## Architecture

- `src/lib/api.js` is the browser's only API boundary; no LLM key is shipped to the client.
- `server/index.js` owns the key, prompts the provider for JSON only, and times out slow upstream calls.
- `src/lib/validateResult.js` structurally validates the model response before rendering.
- A request-id guard prevents older, slower responses from replacing newer plans.

## AI usage note

I used AI assistance to help plan the component structure, write and review code, and refine copy. I reviewed and understand the resulting implementation, including the backend proxy, validation boundary, and state handling.

## Known limitations

Itineraries are not saved between browser sessions, and the app does not independently verify opening hours, booking availability, route transit times, or travel advisories. Always verify these before traveling.

## Time spent

Approximately 7 hours, including requirements review, design, implementation, testing, and documentation.
