import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', provider: 'gemini' }));
const schema = { type: 'OBJECT', properties: { title: { type: 'STRING' }, summary: { type: 'STRING' }, days: { type: 'ARRAY', items: { type: 'OBJECT', properties: { day: { type: 'INTEGER' }, title: { type: 'STRING' }, stops: { type: 'ARRAY', items: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, time: { type: 'STRING' }, duration: { type: 'STRING' }, tip: { type: 'STRING' } }, required: ['name', 'description', 'time', 'duration', 'tip'] } } }, required: ['day', 'title', 'stops'] } } }, required: ['title', 'summary', 'days'] };
const prompt = 'You are Waypoint, an exacting travel planner. Read the traveler brief closely and turn every stated detail into a practical itinerary. Follow explicit duration, dates, origin, destination, budget, pace, group size, interests, accessibility needs, dietary needs, and exclusions. If the duration is explicit, return exactly that many days, from 1 through 7. If it is not explicit, use 3 days. Each day must have 3-6 stops that are geographically sensible, with plausible time windows, travel breathing room, and a clear progression from morning to evening. Prefer specific, well-known places where the request provides a real destination. Never repeat a place, invent a reservation, claim live availability, quote current prices, or promise opening hours or transport schedules. Respect a low budget by prioritizing free and low-cost ideas, respect a slow pace by limiting the schedule, and clearly avoid anything the traveler asks to skip. Write concise natural descriptions that explain why each stop belongs in this traveler’s plan. The summary must reflect the traveler’s priorities and one practical planning trade-off. The tip for every stop must be genuinely useful and should remind the traveler to verify time-sensitive details when relevant.';
app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ error: 'Please describe the trip you want to take.' });
  if (input.length > 5000) return res.status(400).json({ error: 'Keep your trip request under 5,000 characters.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment.' });
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    let body; let response;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: prompt }] }, contents: [{ role: 'user', parts: [{ text: input }] }], generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.35 } }) });
      body = await response.json().catch(() => null);
      const retryable = response.status === 429 || response.status === 503 || /high demand|temporarily unavailable|rate limit/i.test(body?.error?.message || '');
      if (response.ok || !retryable || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
    if (!response.ok) { const message = body?.error?.message || 'Gemini could not complete that request.'; const retryable = response.status === 429 || response.status === 503 || /high demand|temporarily unavailable|rate limit/i.test(message); return res.status(502).json({ error: retryable ? 'Waypoint retried automatically, but the model is temporarily busy. Please try again in a moment.' : message }); }
    const raw = body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
    if (raw.length > 50000) return res.status(502).json({ error: 'The AI response was unexpectedly large. Please try again with a shorter request.' });
    res.json({ raw });
  } catch (error) { res.status(502).json({ error: error.name === 'AbortError' ? 'The request took too long. Please try again.' : 'Could not reach Gemini. Check your connection and try again.' }); } finally { clearTimeout(timer); }
});
app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
