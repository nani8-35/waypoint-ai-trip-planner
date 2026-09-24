export default function PromptInput({ value, onChange, onSubmit, loading }) {
  return <form className="prompt" onSubmit={onSubmit}>
    <label htmlFor="trip-request">Where would you like to go?</label>
    <p>Include dates, interests, pace, budget, and anything you want to avoid.</p>
    <textarea id="trip-request" value={value} onChange={(e) => onChange(e.target.value)} placeholder="A relaxed 3-day food and art trip to Lisbon in October..." maxLength="5000" disabled={loading} />
    <div className="prompt-footer"><span>{value.length}/5000</span><button disabled={loading || !value.trim()}>{loading ? 'Planning your trip…' : 'Build itinerary'} <span aria-hidden="true">→</span></button></div>
  </form>;
}
