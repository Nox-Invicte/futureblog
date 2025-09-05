export async function getCategoryCounts(): Promise<Record<string, number>> {
  const res = await fetch('/api/categoryCounts');
  if (!res.ok) throw new Error('Failed to fetch category counts');
  const data = await res.json();
  return data;
}
