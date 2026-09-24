export default function PromptInput({ value, onChange, onSubmit, loading }) {
  return <form className="prompt" onSubmit={onSubmit}>
    <label htmlFor="trip-request">Your travel brief</label>
    <p>Dates, budget, pace, interests, accessibility needs, or anything to avoid—add whatever matters.</p>
    <textarea id="trip-request" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Four slow days in Goa from Hyderabad: beach walks, local food, one heritage day, and no packed schedule..." maxLength="5000" disabled={loading} />
    <div className="prompt-footer"><span><b>{value.length}</b> / 5000 characters</span><button disabled={loading || !value.trim()}>{loading ? 'Building your route…' : 'Build my route'} <span aria-hidden="true">→</span></button></div>
  </form>;
}
