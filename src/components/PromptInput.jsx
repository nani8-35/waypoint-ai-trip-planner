export default function PromptInput({ value, onChange, onSubmit, loading }) {
  return <form className="prompt route-composer floating-composer" onSubmit={onSubmit}>
    <label className="sr-only" htmlFor="trip-request">Describe the trip you want to take</label>
    <div className="floating-field"><span className="floating-mark" aria-hidden="true">✦</span><textarea id="trip-request" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Ask Waypoint to plan a trip..." maxLength="5000" disabled={loading} /><button className="floating-submit" aria-label={loading ? 'Building your route' : 'Build route'} disabled={loading || !value.trim()}><span className="pulse-orb"><i /><b /></span><em>{loading ? 'Working' : 'Go'}</em></button></div>
    <div className="floating-meta"><span>{value.length ? `${value.length} / 5000` : 'Include places, dates, pace, interests, and anything to avoid'}</span><span>Waypoint plans, you decide</span></div>
  </form>;
}
