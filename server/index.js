import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json({ limit: '32kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const systemPrompt = `You are a careful travel planner. Return ONLY one valid JSON object with no markdown or extra keys. Use this exact shape: {"title":"short trip title","summary":"one sentence summary","days":[{"day":1,"title":"area or theme","stops":[{"name":"place","description":"why go or what to do","time":"Morning","duration":"1.5 hours","tip":"practical tip"}]}]}. Make 2-5 days and 3-6 practical stops per day. Every listed field is required. Do not use a type field.`;
const itinerarySchema = { type: 'object', additionalProperties: false, properties: { title: { type: 'string' }, summary: { type: 'string' }, days: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { day: { type: 'integer' }, title: { type: 'string' }, stops: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, description: { type: 'string' }, time: { type: 'string' }, duration: { type: 'string' }, tip: { type: 'string' } }, required: ['name', 'description', 'time', 'duration', 'tip'] } } }, required: ['day', 'title', 'stops'] } } }, required: ['title', 'summary', 'days'] };

app.post('/api/generate', async (req, res) => {
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  if (!input) return res.status(400).json({ error: 'Please describe the trip you want to take.' });
  if (input.length > 5000) return res.status(400).json({ error: 'Keep your trip request under 5,000 characters.' });
  const provider = process.env.AI_PROVIDER || 'ollama';
  if (!['ollama', 'openai'].includes(provider)) return res.status(500).json({ error: 'The configured AI provider is not supported.' });
  if (provider === 'openai' && !process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'OpenAI is not configured. Add OPENAI_API_KEY to the server environment.' });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const isOpenAI = provider === 'openai';
    const response = await fetch(isOpenAI ? 'https://api.openai.com/v1/chat/completions' : `${(process.env.OLLAMA_HOST || 'http://127.0.0.1:11434').replace(/\/$/, '')}/api/chat`, {
      method: 'POST', signal: controller.signal,
      headers: isOpenAI ? { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } : { 'Content-Type': 'application/json' },
      body: JSON.stringify(isOpenAI ? { model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }], response_format: { type: 'json_schema', json_schema: { name: 'trip_itinerary', strict: true, schema: itinerarySchema } } } : { model: process.env.OLLAMA_MODEL || 'llama3.1:8b', stream: false, format: 'json', options: { temperature: 0.35 }, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }] })
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) return res.status(502).json({ error: isOpenAI ? body?.error?.message || 'OpenAI could not complete that request.' : body?.error || 'The local AI service could not complete that request.' });
    const raw = isOpenAI ? body?.choices?.[0]?.message?.content : body?.message?.content;
    if (typeof raw !== 'string' || !raw.trim()) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    if (raw.length > 50000) return res.status(502).json({ error: 'The AI response was unexpectedly large. Please try again with a shorter request.' });
    res.json({ raw: raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '') });
  } catch (error) {
    const message = error.name === 'AbortError' ? 'The model took too long. Please try again.' : `Could not reach ${provider === 'openai' ? 'OpenAI' : 'Ollama'}. Check the service and try again.`;
    res.status(502).json({ error: message });
  } finally { clearTimeout(timer); }
});

app.listen(port, () => console.log(`Waypoint API listening on http://localhost:${port}`));
