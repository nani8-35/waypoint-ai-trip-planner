import { useEffect, useRef, useState } from 'react';
import coastHero from '../assets/waypoint-coast-hero.png';
import roadJourney from '../assets/waypoint-road-journey.png';
import discoveriesImage from '../assets/waypoint-discoveries.png';

const panels = [
  { kicker: '01 / EXPLORE', title: 'Find a place that changes the pace.', copy: 'Begin with the feeling. Follow it to a place worth staying for.', image: coastHero },
  { kicker: '02 / MOVE', title: 'See the journey before you take it.', copy: 'Shape a route with room for the view, the turn, and the unplanned stop.', image: roadJourney },
  { kicker: '03 / KEEP', title: 'Make the plan entirely yours.', copy: 'Save discoveries, adjust the details, and carry a calmer route with you.', image: discoveriesImage },
];

export default function SpatialShowcase() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight))));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <section className="spatial-showcase" ref={sectionRef}><div className="showcase-sticky"><div className="showcase-label"><span>WAYPOINT SYSTEM</span><b>{String(Math.round(progress * 100)).padStart(2, '0')}</b></div><div className="showcase-rail">{panels.map((panel, index) => { const x = (index - progress * (panels.length - 1)) * 108; const scale = 1 - Math.min(.14, Math.abs(x) / 650); return <article className="showcase-card" key={panel.kicker} style={{ transform: `translate3d(${x}%, 0, 0) scale(${scale})`, zIndex: panels.length - index }}><img src={panel.image} alt="" /><div className="showcase-shade" /><div className="showcase-content"><p>{panel.kicker}</p><h2>{panel.title}</h2><span>{panel.copy}</span></div></article>; })}</div><p className="showcase-hint">Scroll to explore <b>↓</b></p></div></section>;
}
