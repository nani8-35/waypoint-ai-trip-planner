import { useRef, useState } from 'react';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Itinerary from './components/Itinerary';
import { generateItinerary } from './lib/api';
import { parseItinerary } from './lib/validateResult';

export default function App() {
  const [input, setInput] = useState(''); const [itinerary, setItinerary] = useState(null); const [status, setStatus] = useState('idle'); const [error, setError] = useState(''); const requestId = useRef(0);
  const submit = async (event) => { event.preventDefault(); if (!input.trim()) return; const id = ++requestId.current; setStatus('loading'); setError(''); try { const raw = await generateItinerary(input); if (id !== requestId.current) return; const parsed = parseItinerary(raw); if (!parsed.ok) { setError(parsed.message); setStatus('error'); return; } setItinerary(parsed.data); setStatus('success'); } catch (err) { if (id !== requestId.current) return; setError(err.message || 'Something unexpected happened.'); setStatus('error'); } };
  return <main><header><a className="brand" href="#top" aria-label="Waypoint home"><span>W</span> waypoint</a><p>AI trip planner</p></header><div className="shell" id="top"><section className="hero"><p className="eyebrow">Plan with intention</p><h1>A better trip begins with a good brief.</h1><p className="hero-copy">Tell us what you’re dreaming of. We’ll shape it into a flexible, day-by-day route you can make your own.</p><PromptInput value={input} onChange={setInput} onSubmit={submit} loading={status === 'loading'} /></section>{status === 'loading' && <LoadingState />}{status === 'error' && <ErrorState message={error} retry={() => document.getElementById('trip-request')?.focus()} />}{status === 'success' && <Itinerary itinerary={itinerary} onChange={setItinerary} />}</div><footer>Waypoint plans are starting points. Check local hours, availability, and travel advisories before you go.</footer></main>;
}
