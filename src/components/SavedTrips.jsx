export default function SavedTrips({ trips, activeTitle, onLoad, onDelete }) {
  if (!trips.length) return null;
  return <aside className="saved-trips" aria-label="Saved itineraries"><div><p className="eyebrow">Saved on this device</p><h2>Continue planning</h2></div><div className="saved-list">{trips.map((trip) => <div className="saved-item" key={trip.id}><button className={trip.itinerary.title === activeTitle ? 'saved-name active' : 'saved-name'} onClick={() => onLoad(trip.itinerary)}><span>{trip.itinerary.title}</span><small>{trip.itinerary.days.length} days · {new Date(trip.savedAt).toLocaleDateString()}</small></button><button className="saved-delete" aria-label={`Delete saved trip ${trip.itinerary.title}`} onClick={() => onDelete(trip.id)}>×</button></div>)}</div></aside>;
}
