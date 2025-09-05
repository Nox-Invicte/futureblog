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
  if (req.method === 'PUT') {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const { data, error } = await supabase.from('blog_posts')
      .update({
        title,
        content,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  }
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) return res.status(500).json({ message: error.message });
    res.status(204).end();
  }
}
