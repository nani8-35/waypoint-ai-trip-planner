export async function generateItinerary(input, signal) {
  const response = await fetch('/api/generate', { method: 'POST', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input }) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Something went wrong while generating your itinerary.');
  return payload.raw;
}
