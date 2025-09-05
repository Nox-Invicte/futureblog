import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  }
  if (req.method === 'POST') {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const { data, error } = await supabase.from('blog_posts').insert([
      {
        title,
        content,
        category,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]).select('*').single();
    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json(data);
  }
}
