import { useState } from 'react';
import coastHero from '../assets/waypoint-coast-hero.png';
import roadJourney from '../assets/waypoint-road-journey.png';
import discoveriesImage from '../assets/waypoint-discoveries.png';

const panels = [
  { kicker: '01 / EXPLORE', title: 'Follow the feeling, not the crowd.', copy: 'Find a place that makes the familiar feel new again.', image: coastHero },
  { kicker: '02 / SHAPE', title: 'Keep the best part unscheduled.', copy: 'Build a route around what matters, with room for a better detour.', image: roadJourney },
  { kicker: '03 / RETURN', title: 'Bring back more than photos.', copy: 'Save the details that will make the next trip feel more yours.', image: discoveriesImage },
];

export default function SpatialShowcase() {
  const [active, setActive] = useState(0);
  return <section className="spatial-showcase"><div className="showcase-sticky"><div className="showcase-label"><span>THE WAYPOINT SYSTEM</span><b>Move through the journey</b></div><div className="showcase-rail linear-showcase">{panels.map((panel, index) => <article className={`showcase-card${active === index ? ' is-active' : ''}`} key={panel.kicker} onPointerEnter={() => setActive(index)}><img src={panel.image} alt="" /><div className="showcase-shade" /><div className="showcase-content"><p>{panel.kicker}</p><h2>{panel.title}</h2><span>{panel.copy}</span><b>See the idea →</b></div></article>)}</div></div></section>;
}
