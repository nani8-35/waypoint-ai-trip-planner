import { useEffect, useRef, useState } from 'react';

const chapters = [
  { city: 'Delhi', note: 'Begin with the old city and make room for the unexpected.' },
  { city: 'Jaipur', note: 'Trade the highway for warm walls, markets, and long evenings.' },
  { city: 'Udaipur', note: 'Slow down at the water. The best views take their time.' },
  { city: 'Goa', note: 'Arrive with nothing left to prove and a day free to wander.' },
];

export default function JourneyDrive() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const active = Math.min(chapters.length - 1, Math.round(progress * (chapters.length - 1)));
  return <section className="journey-drive" ref={sectionRef} style={{ '--journey-progress': progress }} aria-label="Scroll-driven journey from Delhi to Goa"><div className="journey-sticky"><div className="journey-copy"><p>THE OPEN ROAD / 01</p><h2>Every mile<br />has a story.</h2><span>Scroll to drive</span></div><div className="road-scene" aria-hidden="true"><div className="sun" /><div className="mountains mountain-back" /><div className="mountains mountain-front" /><div className="road"><i /><i /><i /><i /><i /><i /></div><div className="car"><b /><b /><span /></div></div><div className="journey-stops">{chapters.map((chapter, index) => <article className={index === active ? 'active' : ''} key={chapter.city}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{chapter.city}</h3><p>{chapter.note}</p></div></article>)}</div><div className="journey-progress"><span>DELHI</span><i><b /></i><span>GOA</span></div></div></section>;
}
