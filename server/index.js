import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: '32kb' }));

const itineraryShape = `{
  "title": "short trip title",
  "summary": "one sentence summary",
  "days": [{
    "day": 1,
    "title": "area or theme",
    "stops": [{ "name": "place", "description": "why go / what to do", "time": "Morning", "duration": "1.5 hours", "tip": "optional practical tip" }]
  }]
}`;

app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ error: 'Please describe the trip you want to take.' });
  if (input.length > 5000) return res.status(400).json({ error: 'Keep your trip request under 5,000 characters.' });
  if (!process.env.LLM_API_KEY) return res.status(503).json({ error: 'The AI service is not configured yet. Add LLM_API_KEY to your .env file.' });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`${(process.env.LLM_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '')}/chat/completions`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.LLM_API_KEY}` },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'openrouter/free',
        temperature: 0.55,
        messages: [{ role: 'system', content: `You are a careful travel planner. Return ONLY valid JSON, without markdown fences or prose. Match this exact shape: ${itineraryShape}. Make 2-5 days and 3-6 practical stops per day. Every field must be a non-empty string except day, which must be a positive integer.` }, { role: 'user', content: input }]
      })
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) return res.status(502).json({ error: body?.error?.message || 'The AI service could not complete that request.' });
    const raw = body?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    // Some providers wrap otherwise-valid JSON in a Markdown fence despite the prompt.
    // Remove only that outer wrapper; malformed or wrong-shaped JSON is still rejected in the browser.
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    res.json({ raw: cleaned });
  } catch (error) {
    const message = error.name === 'AbortError' ? 'The request took too long. Please try again.' : 'Could not reach the AI service. Check your connection and try again.';
    res.status(502).json({ error: message });
  } finally { clearTimeout(timer); }
});

app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
