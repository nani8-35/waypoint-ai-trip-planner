const notes = [
  { place: 'Nila Coast', name: 'Mira K.', note: 'Take the lower path just before sunset. It is quieter and the water changes colour every few minutes.' },
  { place: 'Saffron Quarter', name: 'Arun S.', note: 'The side streets are best before 10 AM. Leave the main square and follow the bakeries instead.' },
  { place: 'Mistral Lake', name: 'Leah R.', note: 'Pack an extra layer even in summer. The lake edge gets cold as soon as the light drops.' },
];

export default function CommunityNotes() {
  return <><section className="community-notes"><div className="shell"><div className="notes-heading"><p>PROTOTYPE COMMUNITY NOTES</p><h2>Useful things people<br />would tell a friend.</h2><span>Sample content for this assignment demo — not verified reviews.</span></div><div className="notes-grid">{notes.map((item) => <article key={item.place}><div><span>●</span><b>{item.place}</b></div><p>“{item.note}”</p><small>{item.name} · sample traveller note</small></article>)}</div></div></section><section className="quote-coda"><div className="shell"><p>THE LONG WAY HOME</p><h2>“A route is only useful<br />if it makes room to wonder.”</h2><div><span>Stay curious.</span><span>Travel gently.</span><span>Come back changed.</span></div></div></section><section className="site-coda"><div className="shell"><div><p>WAYPOINT</p><h2>Make space<br />for going.</h2></div><div><b>Using Waypoint</b><span>Plan routes</span><span>Save ideas</span><span>Build at your pace</span></div><div><b>Good to know</b><span>Prototype terms</span><span>Privacy on this device</span><span>Travel safety</span></div><div><b>A clear note</b><span>Waypoint is for planning, not booking.</span><span>Verify local guidance, availability, and opening hours before travel.</span></div></div></section></>;
}
