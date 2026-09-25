export default function PromptInput({ value, onChange, onSubmit, loading }) {
  return <form className="prompt route-composer" onSubmit={onSubmit}>
    <div className="composer-top"><span>01</span><label htmlFor="trip-request">Compose your route</label><p>One good brief is all it takes.</p></div>
    <div className="composer-field"><span aria-hidden="true">⌁</span><textarea id="trip-request" value={value} onChange={(e) => onChange(e.target.value)} placeholder="I want to take the long way through Rajasthan: four unhurried days, street food, architecture, small stays, and no crowded attractions..." maxLength="5000" disabled={loading} /></div>
    <div className="prompt-footer"><span><b>{value.length}</b> / 5000</span><span className="composer-note">Dates · pace · interests · budget · anything to avoid</span><button disabled={loading || !value.trim()}>{loading ? 'Building your route…' : 'Shape my route'} <span aria-hidden="true">→</span></button></div>
  </form>;
}
