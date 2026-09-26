const collections = [
  { number: '01', title: 'The long weekend', copy: 'Three unhurried days of coast, good food, and one thing worth waking up early for.', brief: 'Plan a slow 3-day coast escape with local food, one cultural experience, beach time, and no rushed schedule.' },
  { number: '02', title: 'The food trail', copy: 'Markets at first light, a table worth waiting for, and a neighbourhood you never meant to find.', brief: 'Plan a 3-day food-focused city trip with markets, casual local restaurants, one cooking experience, and a relaxed pace.' },
  { number: '03', title: 'The open road', copy: 'A few hours behind the wheel, wide views, and stops that are better than the destination.', brief: 'Plan a 4-day scenic road trip with short driving days, viewpoints, local stays, and flexible stops.' },
];

export default function RouteCollections({ onSelect }) {
  return <section className="route-collections shell"><div className="collections-heading"><p className="eyebrow">Start somewhere good</p><h2>Routes with a point<br /><span className="tone-muted">of view.</span></h2></div><div>{collections.map((collection) => <article key={collection.number}><span>{collection.number}</span><h3>{collection.title}</h3><p>{collection.copy}</p><button onClick={() => onSelect(collection.brief)}>Use this route idea <b>→</b></button></article>)}</div></section>;
}
