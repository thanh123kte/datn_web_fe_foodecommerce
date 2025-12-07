export async function autosuggest(query: string) {
  if (!query) return [];

  const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?q=${encodeURIComponent(
    query
  )}&apiKey=${process.env.NEXT_PUBLIC_HERE_API_KEY}&limit=5&lang=vi-VN&at=10.77,106.69`;

  const res = await fetch(url);
  return res.json();
}
