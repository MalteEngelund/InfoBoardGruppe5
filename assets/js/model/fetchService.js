export async function fetchFeedJson(apiUrl) {
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
  return await res.json();
}
