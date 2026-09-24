import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', provider: 'openai' }));
const schema = { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, summary: { type: 'string' }, days: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { day: { type: 'integer' }, title: { type: 'string' }, stops: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, description: { type: 'string' }, time: { type: 'string' }, duration: { type: 'string' }, tip: { type: 'string' } }, required: ['name', 'description', 'time', 'duration', 'tip'] } } }, required: ['day', 'title', 'stops'] } } }, required: ['title', 'summary', 'days'] };
const prompt = 'You are a careful travel planner. Build a practical itinerary that reflects the traveler’s dates, pace, budget, interests, dietary needs, and constraints. Return only the requested structured itinerary. Use 2-5 days and 3-6 realistic stops each day. Do not invent confirmed reservations, live prices, availability, or transport schedules.';
app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ error: 'Please describe the trip you want to take.' });
  if (input.length > 5000) return res.status(400).json({ error: 'Keep your trip request under 5,000 characters.' });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OpenAI is not configured. Add OPENAI_API_KEY to the server environment.' });
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: prompt }, { role: 'user', content: input }], response_format: { type: 'json_schema', json_schema: { name: 'trip_itinerary', strict: true, schema } } }) });
    const body = await response.json().catch(() => null);
    if (!response.ok) return res.status(502).json({ error: body?.error?.message || 'OpenAI could not complete that request.' });
    const raw = body?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    if (raw.length > 50000) return res.status(502).json({ error: 'The AI response was unexpectedly large. Please try again with a shorter request.' });
    res.json({ raw });
  } catch (error) { res.status(502).json({ error: error.name === 'AbortError' ? 'The request took too long. Please try again.' : 'Could not reach OpenAI. Check your connection and try again.' }); } finally { clearTimeout(timer); }
});
app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
