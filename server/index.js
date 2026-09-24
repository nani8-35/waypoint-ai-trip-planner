import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', provider: 'gemini' }));
const schema = { type: 'OBJECT', properties: { title: { type: 'STRING' }, summary: { type: 'STRING' }, days: { type: 'ARRAY', items: { type: 'OBJECT', properties: { day: { type: 'INTEGER' }, title: { type: 'STRING' }, stops: { type: 'ARRAY', items: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, time: { type: 'STRING' }, duration: { type: 'STRING' }, tip: { type: 'STRING' } }, required: ['name', 'description', 'time', 'duration', 'tip'] } } }, required: ['day', 'title', 'stops'] } } }, required: ['title', 'summary', 'days'] };
const prompt = 'You are a careful travel planner. Build a practical itinerary that reflects the traveler’s dates, pace, budget, interests, dietary needs, and constraints. Use 2-5 days and 3-6 realistic stops each day. Do not invent confirmed reservations, live prices, availability, or transport schedules.';
app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ error: 'Please describe the trip you want to take.' });
  if (input.length > 5000) return res.status(400).json({ error: 'Keep your trip request under 5,000 characters.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment.' });
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: prompt }] }, contents: [{ role: 'user', parts: [{ text: input }] }], generationConfig: { responseMimeType: 'application/json', responseSchema: schema, temperature: 0.35 } }) });
    const body = await response.json().catch(() => null);
    if (!response.ok) return res.status(502).json({ error: body?.error?.message || 'Gemini could not complete that request.' });
    const raw = body?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
    if (raw.length > 50000) return res.status(502).json({ error: 'The AI response was unexpectedly large. Please try again with a shorter request.' });
    res.json({ raw });
  } catch (error) { res.status(502).json({ error: error.name === 'AbortError' ? 'The request took too long. Please try again.' : 'Could not reach Gemini. Check your connection and try again.' }); } finally { clearTimeout(timer); }
});
app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
