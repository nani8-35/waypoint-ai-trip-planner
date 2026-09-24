const text = (value, maxLength) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
const createId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function parseItinerary(raw) {
  let data;
  try { data = JSON.parse(raw); } catch { return { ok: false, message: 'The AI sent malformed data. Nothing was added to your trip.' }; }
  if (!data || !text(data.title, 120) || !text(data.summary, 500) || !Array.isArray(data.days) || data.days.length === 0) return { ok: false, message: 'The AI response was missing required itinerary details.' };
  if (data.days.length > 7 || new Set(data.days.map((day) => day.day)).size !== data.days.length) return { ok: false, message: 'The AI returned an itinerary that is too large or has duplicate days.' };
  const valid = data.days.every((day) => Number.isInteger(day.day) && day.day > 0 && text(day.title, 120) && Array.isArray(day.stops) && day.stops.length > 0 && day.stops.length <= 8 && day.stops.every((stop) => text(stop.name, 120) && text(stop.description, 600) && text(stop.time, 60) && text(stop.duration, 60) && (stop.tip === undefined || text(stop.tip, 300))));
  if (!valid) return { ok: false, message: 'The AI response had the wrong shape. Please generate again.' };
  return { ok: true, data: { title: data.title.trim(), summary: data.summary.trim(), days: data.days.map((day) => ({ ...day, title: day.title.trim(), stops: day.stops.map((stop, index) => ({ ...stop, id: `${day.day}-${index}-${createId()}`, name: stop.name.trim(), description: stop.description.trim(), time: stop.time.trim(), duration: stop.duration.trim(), tip: stop.tip?.trim() || '' })) })) } };
}
