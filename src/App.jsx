import { useEffect, useRef, useState } from 'react';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Itinerary from './components/Itinerary';
import SavedTrips from './components/SavedTrips';
import { generateItinerary } from './lib/api';
import { parseItinerary } from './lib/validateResult';

const storageKey = 'waypoint-saved-trips';
const readSaved = () => { try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value.slice(0, 5) : []; } catch { return []; } };

export default function App() {
  const [input, setInput] = useState(''); const [itinerary, setItinerary] = useState(null); const [status, setStatus] = useState('idle'); const [error, setError] = useState(''); const [online, setOnline] = useState(() => navigator.onLine); const [savedTrips, setSavedTrips] = useState(readSaved);
  const requestId = useRef(0); const abortRef = useRef(null);
  useEffect(() => { const update = () => setOnline(navigator.onLine); window.addEventListener('online', update); window.addEventListener('offline', update); return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); }; }, []);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(savedTrips)); } catch {} }, [savedTrips]);
  const saveTrip = (next) => { setItinerary(next); setSavedTrips((current) => [{ id: crypto.randomUUID?.() || String(Date.now()), savedAt: new Date().toISOString(), itinerary: next }, ...current.filter((item) => item.itinerary.title !== next.title)].slice(0, 5)); };
  const submit = async (event) => { event.preventDefault(); const trimmed = input.trim(); if (!trimmed || status === 'loading') return; if (!online) { setError('You appear to be offline. Reconnect before asking the local planner to generate a route.'); setStatus('error'); return; } abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; const id = ++requestId.current; setStatus('loading'); setError(''); try { const raw = await generateItinerary(trimmed, controller.signal); if (id !== requestId.current) return; const parsed = parseItinerary(raw); if (!parsed.ok) { setError(parsed.message); setStatus('error'); return; } saveTrip(parsed.data); setStatus('success'); } catch (err) { if (id !== requestId.current || err.name === 'AbortError') return; setError(err.message || 'Something unexpected happened.'); setStatus('error'); } finally { if (id === requestId.current) abortRef.current = null; } };
  const cancel = () => { requestId.current += 1; abortRef.current?.abort(); abortRef.current = null; setStatus(itinerary ? 'success' : 'idle'); };
  const retry = () => { if (input.trim()) submit({ preventDefault() {} }); };
  const deleteSaved = (id) => setSavedTrips((current) => current.filter((trip) => trip.id !== id));
  return <main><header><a className="brand" href="#top" aria-label="Waypoint home"><span>W</span> waypoint</a><p>{online ? 'AI trip planner' : 'Offline'}</p></header><div className="shell" id="top"><section className="hero"><p className="eyebrow">Plan with intention</p><h1>A better trip begins with a good brief.</h1><p className="hero-copy">Tell us what you’re dreaming of. We’ll shape it into a flexible, day-by-day route you can make your own.</p><PromptInput value={input} onChange={setInput} onSubmit={submit} loading={status === 'loading'} /></section>{!online && <p className="network-note" role="status">You are offline. Saved trips remain available, but new AI routes need a connection to your local Ollama service.</p>}{status === 'loading' && <LoadingState onCancel={cancel} />}{status === 'error' && <ErrorState message={error} retry={retry} />}{status === 'success' && <Itinerary itinerary={itinerary} onChange={saveTrip} />}{<SavedTrips trips={savedTrips} activeTitle={itinerary?.title} onLoad={(trip) => { abortRef.current?.abort(); setItinerary(trip); setStatus('success'); }} onDelete={deleteSaved} />}</div><footer>Waypoint plans are starting points. Check local hours, availability, and travel advisories before you go.</footer></main>;
}
