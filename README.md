# Waypoint — AI trip planner

Waypoint turns a free-form trip brief into a structured, editable day-by-day itinerary. It is deliberately an interactive planning tool, not a chat interface: each stop can be expanded by day, reordered, or removed.

## Data shape

The backend requests JSON with a trip title, summary, days, and fully structured stops (name, description, time, duration, and optional tip). The browser validates this response before it reaches the UI. Malformed JSON, wrong-shaped data, empty responses, slow requests, failed requests, and stale responses all route to visible, recoverable states.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add `OPENAI_API_KEY`.
3. Keep the key server-side only; never use a `VITE_` prefixed key.
4. Start the API and frontend together: `npm start`
5. Open the local Vite address displayed in the terminal.

`npm run dev` is an equivalent development shortcut. Build the client with `npm run build`.

## Architecture

The app uses a two-process architecture:

```text
React interface → Express API → OpenAI Structured Outputs
       ↑               ↓
interactive UI ← validated JSON itinerary
```

1. The browser submits only the free-form trip request to `src/lib/api.js`.
2. `server/index.js` passes the request to OpenAI with a strict JSON Schema and a 60-second timeout.
3. The client receives the raw model text but does not render it directly.
4. `src/lib/validateResult.js` parses and validates every required field before the React state changes.
5. `Itinerary.jsx` renders the approved data as stateful day sections and stops. Users can expand days, reorder stops, and remove stops without calling the model again.

The app also saves the five most recent itineraries in browser storage and can export any itinerary as JSON. These work without generating another model response.

This keeps the model boundary separate from UI rendering. The browser never calls the LLM directly, and the product remains a planning tool rather than a chatbot.

### Failure handling

| Scenario | Behavior |
| --- | --- |
| Malformed JSON | Validation rejects it and shows a retryable error. |
| Wrong JSON shape | Missing fields or invalid arrays never reach the itinerary UI. |
| Empty model response | The server returns a visible failure state. |
| Slow local model | A loading state is shown; the backend aborts after 60 seconds. |
| Failed request | The interface explains the OpenAI failure and offers retry. |
| Stale response | A request ID guard prevents an older result overwriting a newer request. |
| Cancelled request | The browser aborts the request and preserves the most recent completed plan. |
| Offline browser | New generation is disabled with a clear status message; saved plans remain available. |
| Oversized output | The backend caps raw output; the client caps days, stops, and text field sizes. |
| Duplicate itinerary days | Structural validation rejects duplicate day identifiers. |

### Key files

- `src/App.jsx`: request lifecycle and stale-response protection.
- `src/lib/api.js`: client-to-backend boundary.
- `src/lib/validateResult.js`: parsing and structural validation.
- `server/index.js`: OpenAI integration and timeout handling.
- `src/components/Itinerary.jsx`: interactive itinerary controls.

## AI usage note

I used AI assistance to help plan the component structure, write and review code, and refine copy. I reviewed and understand the resulting implementation, including the backend proxy, validation boundary, and state handling.

## Known limitations

Itineraries are not saved between browser sessions, and the app does not independently verify opening hours, booking availability, route transit times, or travel advisories. Always verify these before traveling.

## Time spent

Approximately 7 hours, including requirements review, design, implementation, testing, and documentation.

## Demo walkthrough

For a short demo, describe a two-day trip, generate the itinerary, expand a day, reorder a stop, remove a stop, then explain that the data is generated as JSON by Ollama and validated before React renders it. Mention the loading, error, timeout, and stale-response paths while showing the interface.
