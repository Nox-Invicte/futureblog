import { supabase } from './supabase';

export async function getCategoryCounts(): Promise<Record<string, number>> {
  // Fetch all published post categories
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('published', true);

  if (error) throw error;

  // Count posts per category
  const result: Record<string, number> = {};
  let total = 0;
  for (const row of data) {
    total++;
    if (row.category) {
      // Normalize category to lower case and remove spaces/ampersands for matching
      let key = row.category.toLowerCase().replace(/\s|&/g, "");
      result[key] = (result[key] || 0) + 1;
    }
  }
  result['all'] = total;
  return result;
}
