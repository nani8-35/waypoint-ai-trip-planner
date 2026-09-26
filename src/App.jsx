import { useEffect, useRef, useState } from 'react';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import Itinerary from './components/Itinerary';
import SavedTrips from './components/SavedTrips';
import TripDashboard from './components/TripDashboard';
import Discoveries from './components/Discoveries';
import RouteCollections from './components/RouteCollections';
import CommunityNotes from './components/CommunityNotes';
import SpatialShowcase from './components/SpatialShowcase';
import coastHero from './assets/waypoint-coast-hero.png';
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
  const focusComposer = () => document.getElementById('trip-request')?.focus();
  const chooseCollection = (brief) => { setInput(brief); focusComposer(); };
  const closeFollowup = () => setStatus('idle');
  return <main className="waypoint-app"><header className="topbar"><a className="wordmark" href="#top">WAYPOINT</a><nav><a href="#discover">Explore</a><a href="#planner">Plan</a><a href="#saved">Trips</a></nav><button onClick={focusComposer}>Start a trip <span>↗</span></button></header><section className="cover" id="top"><img src={coastHero} alt="A traveler walking along a peaceful coast" /><div className="cover-shade" /><div className="cover-copy"><p>TRAVEL, CONSIDERED</p><h1>There is more<br />out <em>there.</em></h1><button onClick={focusComposer}>Explore Waypoint <span>↓</span></button></div><div className="cover-meta"><span>INDIA / 2026</span><span>Designed for the unhurried</span></div></section><section className="intro-statement"><p>WAYPOINT IS A PERSONAL TRAVEL DESK.</p><h2>Discover more.<br />Plan less.</h2><span>“A good route leaves room for the unexpected.”</span></section><SpatialShowcase /><Discoveries /><RouteCollections onSelect={chooseCollection} /><section className="planner-area" id="planner"><div className="planner-shell shell"><div className="planner-copy"><p>YOUR NEXT ROUTE</p><h2>Start with<br />the feeling.</h2><span>Tell us where, when, and what matters. The response will appear right above your prompt.</span></div><PromptInput value={input} onChange={setInput} onSubmit={submit} loading={status === 'loading'} /></div></section>{status !== 'idle' && <section className={`planner-followup ${status}`} aria-live="polite"><div className="followup-header"><span>{status === 'success' ? 'YOUR ROUTE IS READY' : status === 'loading' ? 'WAYPOINT IS PLANNING' : 'A QUICK NOTE'}</span><button onClick={closeFollowup} aria-label="Close route response">×</button></div><div className="followup-content">{status === 'loading' && <LoadingState onCancel={cancel} />}{status === 'error' && <ErrorState message={error} retry={() => submit({ preventDefault() {} })} />}{status === 'success' && <><TripDashboard itinerary={itinerary} /><Itinerary itinerary={itinerary} onChange={saveTrip} /></>}</div></section>}<section className="saved-zone shell" id="saved"><SavedTrips trips={savedTrips} activeTitle={itinerary?.title} onLoad={(trip) => { abortRef.current?.abort(); setItinerary(trip); setStatus('success'); }} onDelete={(id) => setSavedTrips((trips) => trips.filter((trip) => trip.id !== id))} /></section><CommunityNotes /><footer>Waypoint is an itinerary-planning prototype. Confirm opening hours, availability, transport, and travel guidance before you go.</footer></main>;
}
