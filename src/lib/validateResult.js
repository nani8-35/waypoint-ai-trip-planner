const text = (value) => typeof value === 'string' && value.trim().length > 0;

export function parseItinerary(raw) {
  let data;
  try { data = JSON.parse(raw); } catch { return { ok: false, message: 'The AI sent malformed data. Nothing was added to your trip.' }; }
  if (!data || !text(data.title) || !text(data.summary) || !Array.isArray(data.days) || data.days.length === 0) return { ok: false, message: 'The AI response was missing required itinerary details.' };
  const valid = data.days.every((day) => Number.isInteger(day.day) && day.day > 0 && text(day.title) && Array.isArray(day.stops) && day.stops.length > 0 && day.stops.every((stop) => text(stop.name) && text(stop.description) && text(stop.time) && text(stop.duration) && (stop.tip === undefined || text(stop.tip))));
  if (!valid) return { ok: false, message: 'The AI response had the wrong shape. Please generate again.' };
  return { ok: true, data: { title: data.title.trim(), summary: data.summary.trim(), days: data.days.map((day) => ({ ...day, title: day.title.trim(), stops: day.stops.map((stop, index) => ({ ...stop, id: `${day.day}-${index}-${crypto.randomUUID()}`, name: stop.name.trim(), description: stop.description.trim(), time: stop.time.trim(), duration: stop.duration.trim(), tip: stop.tip?.trim() || '' })) })) } };
}
