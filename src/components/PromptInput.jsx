import { useState } from 'react';

const suggestions = [
  { title: 'Goa, India', detail: 'Coast, food, and heritage', prompt: 'Plan a relaxed 3-day Goa trip with local food, Portuguese heritage, quiet beaches, and sunset walks.' },
  { title: 'Jaipur, India', detail: 'Forts, craft, and old city lanes', prompt: 'Plan a 3-day Jaipur culture trip with forts, markets, traditional food, and a comfortable pace.' },
  { title: 'Ladakh, India', detail: 'Mountains and high-altitude calm', prompt: 'Plan a careful 5-day Ladakh trip with acclimatization, scenic drives, local culture, and a relaxed pace.' },
  { title: 'Tokyo, Japan', detail: 'Design, food, and neighbourhoods', prompt: 'Plan a 4-day Tokyo trip with local food, design, quiet neighbourhoods, and no rushed schedule.' },
  { title: 'Paris, France', detail: 'Art, cafés, and slow walks', prompt: 'Plan a relaxed 3-day Paris trip for art museums, cafés, walkable neighbourhoods, and evening views.' },
  { title: 'Kerala, India', detail: 'Backwaters and spice country', prompt: 'Plan a peaceful 4-day Kerala trip with backwaters, local food, heritage, and nature.' },
];

export default function PromptInput({ value, onChange, onSubmit, loading }) {
  const [focused, setFocused] = useState(false);
  const normalized = value.trim().toLowerCase();
  const matches = suggestions.filter((item) => !normalized || `${item.title} ${item.detail}`.toLowerCase().includes(normalized)).slice(0, 4);
  return <form className="prompt route-composer floating-composer" onSubmit={onSubmit}>
    <label className="sr-only" htmlFor="trip-request">Describe the trip you want to take</label>
    {focused && matches.length > 0 && <div className="floating-suggestions" role="listbox" aria-label="Suggested destinations">{matches.map((item) => <button key={item.title} type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => onChange(item.prompt)}><span className="suggestion-pin">⌖</span><span><b>{item.title}</b><small>{item.detail}</small></span><em>Use →</em></button>)}</div>}
    <div className="floating-field"><span className="floating-mark" aria-hidden="true">✦</span><textarea id="trip-request" value={value} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={(e) => onChange(e.target.value)} placeholder="Ask Waypoint to plan a trip..." maxLength="5000" disabled={loading} /><button className="floating-submit" aria-label={loading ? 'Building your route' : 'Build route'} disabled={loading || !value.trim()}><span className="pulse-orb"><i /><b /></span><em>{loading ? 'Working' : 'Go'}</em></button></div>
    <div className="floating-meta"><span>{value.length ? `${value.length} / 5000` : 'Include places, dates, pace, interests, and anything to avoid'}</span><span>Waypoint plans, you decide</span></div>
  </form>;
}
