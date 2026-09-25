import { useEffect, useState } from 'react';
import discoveriesImage from '../assets/waypoint-discoveries.png';

const places = [
  { name: 'Nila Coast', type: 'Coastline', categories: ['Outdoors', 'Stay'], mood: 'Slow mornings and clear water', position: '0% 50%' },
  { name: 'Saffron Quarter', type: 'Heritage', categories: ['Culture', 'Food'], mood: 'Courtyards, craft, and late lunches', position: '50% 50%' },
  { name: 'Mistral Lake', type: 'Outdoors', categories: ['Outdoors', 'Stay'], mood: 'Cold air and wide-open trails', position: '100% 50%' },
];
const categories = ['All', 'Outdoors', 'Food', 'Culture', 'Stay'];

export default function Discoveries() {
  const [category, setCategory] = useState('All');
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('waypoint-saved-places') || '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem('waypoint-saved-places', JSON.stringify(saved)); } catch {} }, [saved]);
  const toggleSave = (name) => setSaved((items) => items.includes(name) ? items.filter((item) => item !== name) : [...items, name]);
  return <section className="discoveries shell" id="discover"><div className="discoveries-heading"><div><p className="eyebrow">Discover a little differently</p><h2>Places for the<br />way you want to feel.</h2></div><p>Fictional destination concepts for this Waypoint prototype. Save the ones that pull you in, then build your route around them.</p></div><div className="discovery-controls" aria-label="Explore interests">{categories.map((item) => <button className={item === category ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}<span>{saved.length} saved</span></div><div className="place-grid">{places.map((place) => <article className={category !== 'All' && !place.categories.includes(category) ? 'place-card muted' : 'place-card'} key={place.name}><div className="place-image" style={{ backgroundImage: `url(${discoveriesImage})`, backgroundPosition: place.position }}><button onClick={() => toggleSave(place.name)} aria-label={`Save ${place.name}`} className={saved.includes(place.name) ? 'saved' : ''}>{saved.includes(place.name) ? '✓' : '+'}</button><span>{place.type}</span></div><div><h3>{place.name}</h3><p>{place.mood}</p></div></article>)}</div></section>;
}
