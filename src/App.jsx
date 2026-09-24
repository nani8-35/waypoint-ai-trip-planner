import { useEffect, useRef, useState } from 'react';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Itinerary from './components/Itinerary';
import SavedTrips from './components/SavedTrips';
import { generateItinerary } from './lib/api';
import { parseItinerary } from './lib/validateResult';

const storageKey = 'waypoint-saved-trips';
const readSaved = () => { try { const trips = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(trips) ? trips.slice(0, 5) : []; } catch { return []; } };
export default function App() {
  const [input, setInput] = useState(''); const [itinerary, setItinerary] = useState(null); const [status, setStatus] = useState('idle'); const [error, setError] = useState(''); const [savedTrips, setSavedTrips] = useState(readSaved); const requestId = useRef(0); const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []); useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(savedTrips)); } catch {} }, [savedTrips]);
  const saveTrip = (trip) => { setItinerary(trip); setSavedTrips((items) => [{ id: crypto.randomUUID?.() || String(Date.now()), savedAt: new Date().toISOString(), itinerary: trip }, ...items.filter((item) => item.itinerary.title !== trip.title)].slice(0, 5)); };
  const submit = async (event) => { event.preventDefault(); const brief = input.trim(); if (!brief || status === 'loading') return; abortRef.current?.abort(); const controller = new AbortController(); abortRef.current = controller; const id = ++requestId.current; setStatus('loading'); setError(''); try { const parsed = parseItinerary(await generateItinerary(brief, controller.signal)); if (id !== requestId.current) return; if (!parsed.ok) { setError(parsed.message); setStatus('error'); return; } saveTrip(parsed.data); setStatus('success'); } catch (err) { if (id !== requestId.current || err.name === 'AbortError') return; setError(err.message || 'Something unexpected happened.'); setStatus('error'); } };
  const cancel = () => { requestId.current += 1; abortRef.current?.abort(); setStatus(itinerary ? 'success' : 'idle'); };
  return <main><header><a className="brand" href="#top"><span>W</span>Waypoint</a><nav><a href="#planner">Plan</a><a href="#saved">Saved trips</a></nav><button className="header-action" onClick={() => document.getElementById('trip-request')?.focus()}>Start planning</button></header><section className="hero-band" id="top"><div className="shell"><p className="eyebrow">Your next good story starts here</p><h1>Travel plans that feel like <em>you.</em></h1><p className="hero-copy">Turn a detailed brief into a flexible route. Reorder the day, save favorite ideas, and keep the parts that matter.</p><div className="trust-row"><span>Structured routes</span><span>Editable stops</span><span>Saved on your device</span></div></div></section><div className="shell planner-shell" id="planner"><PromptInput value={input} onChange={setInput} onSubmit={submit} loading={status === 'loading'} />{status === 'loading' && <LoadingState onCancel={cancel} />}{status === 'error' && <ErrorState message={error} retry={() => submit({ preventDefault() {} })} />}{status === 'success' && <Itinerary itinerary={itinerary} onChange={saveTrip} />}{<div id="saved"><SavedTrips trips={savedTrips} activeTitle={itinerary?.title} onLoad={(trip) => { abortRef.current?.abort(); setItinerary(trip); setStatus('success'); }} onDelete={(id) => setSavedTrips((trips) => trips.filter((trip) => trip.id !== id))} /></div>}</div><footer>Waypoint is for planning, not booking. Confirm local hours, transport, availability, and travel guidance before you go.</footer></main>;
}
