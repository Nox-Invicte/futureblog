import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ message: 'Post not found' });
    res.json(data);
  }
  // Add PUT/DELETE logic here if needed
}
