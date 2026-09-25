import { useEffect, useRef, useState } from 'react';

export default function HaloTransit() {
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
  const halo = { transform: `translate(-50%, -50%) scale(${0.38 + progress * 3.6}) rotate(${progress * 90}deg)` };
  const copy = { opacity: Math.max(0, 1 - progress * 2.3), transform: `translateY(${-progress * 60}px)` };
  return <section className="halo-transit" ref={sectionRef} aria-label="Scroll through a halo into space"><div className="halo-sticky"><div className="star-field" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ '--x': `${(index * 37) % 101}%`, '--y': `${(index * 61) % 101}%`, '--delay': `${index % 7}s` }} />)}</div><div className="halo" style={halo}><i /><b /><em /></div><div className="halo-copy" style={copy}><p>BEYOND THE MAP</p><h2>Step into<br />the unknown.</h2><span>Scroll to enter</span></div><div className="halo-end"><span>THE POSSIBILITIES ARE WIDER THAN THE ROUTE.</span></div></div></section>;
}
