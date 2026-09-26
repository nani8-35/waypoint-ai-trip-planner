import TripDashboard from './TripDashboard';
import Itinerary from './Itinerary';

export default function RoutePage({ itinerary, onBack, onChange }) {
  return <main className="route-page"><header className="route-page-nav"><button onClick={onBack}>← Back to Waypoint</button><span>WAYPOINT / ROUTE BOOK</span><button onClick={() => window.print()}>Print route</button></header><section className="route-page-hero"><p>YOUR PERSONAL ROUTE</p><h1>{itinerary.title}</h1><span>{itinerary.summary}</span><div><button onClick={onBack}>Plan another trip</button><small>Saved to your local plan library</small></div></section><section className="route-page-content"><TripDashboard itinerary={itinerary} /><Itinerary itinerary={itinerary} onChange={onChange} /></section><footer>Waypoint is an itinerary-planning prototype. Confirm opening hours, availability, transport, and travel guidance before you go.</footer></main>;
}
