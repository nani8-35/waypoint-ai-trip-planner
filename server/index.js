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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${(process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, '')}/api/chat`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        stream: false,
        format: 'json',
        options: { temperature: 0.35 },
        messages: [{ role: 'system', content: `You are a careful travel planner. Return ONLY valid JSON matching this exact shape: ${itineraryShape}. Make 2-5 days and 3-6 practical stops per day. Every field must be a non-empty string except day, which must be a positive integer.` }, { role: 'user', content: input }]
      })
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) return res.status(502).json({ error: body?.error || 'The local AI service could not complete that request.' });
    const raw = body?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    res.json({ raw: cleaned });
  } catch (error) {
    const message = error.name === 'AbortError' ? 'The local model took too long. Please try again.' : 'Could not reach Ollama. Start it locally and try again.';
    res.status(502).json({ error: message });
  } finally { clearTimeout(timer); }
});

app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
