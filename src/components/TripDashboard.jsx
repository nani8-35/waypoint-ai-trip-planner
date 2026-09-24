const getStops = (itinerary) => itinerary.days.flatMap((day) => day.stops);

export default function TripDashboard({ itinerary }) {
  const stops = getStops(itinerary);
  const firstStop = stops[0]?.name || 'First stop';
  const lastStop = stops.at(-1)?.name || 'Final stop';
  const tips = stops.map((stop) => stop.tip).filter(Boolean).slice(0, 3);
  return <section className="trip-dashboard" aria-label="Trip overview">
    <div className="route-preview">
      <div className="route-preview-top"><span className="live-dot" /> Route overview <span>{itinerary.days.length} days</span></div>
      <div className="route-line"><i /><i /><i /><i /></div>
      <div className="route-points"><span><b>Start</b>{firstStop}</span><span><b>Finish</b>{lastStop}</span></div>
    </div>
    <div className="planning-notes">
      <p className="eyebrow">Before you go</p>
      <h2>Keep the trip flexible.</h2>
      <ul>
        <li>Confirm opening hours the day before.</li>
        <li>Save addresses and transport options offline.</li>
        {tips[0] && <li>{tips[0]}</li>}
      </ul>
    </div>
  </section>;
}
