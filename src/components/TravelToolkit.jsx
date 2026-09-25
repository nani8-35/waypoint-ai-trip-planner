const tools = [
  ['Route, not a rule', 'Open each day, reorder stops, and remove the places that no longer fit.'],
  ['Always yours', 'Plans live privately on this device and can be exported as a JSON file.'],
  ['Ready for reality', 'Every route reminds you to check live hours, transport, safety, and availability.'],
];

export default function TravelToolkit() {
  return <section className="travel-toolkit"><p className="eyebrow">More than an itinerary</p><h2>Built for leaving<br />room in the plan.</h2><div>{tools.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}
