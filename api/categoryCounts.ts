import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('blog_posts').select('category').eq('published', true);
    if (error) return res.status(500).json({ message: error.message });
    const result: Record<string, number> = {};
    let total = 0;
    for (const row of data) {
      total++;
      if (row.category) {
        let key = row.category.toLowerCase().replace(/\s|&/g, "");
        result[key] = (result[key] || 0) + 1;
      }
    }
    result['all'] = total;
    res.json(result);
  }
}
