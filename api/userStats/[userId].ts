import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('author_id', userId);

      if (postsError) throw postsError;

      // For demo, assuming shares and likes are stored in blog_posts table as columns total_shares and total_likes
      const { data: stats, error: statsError } = await supabase
        .from('blog_posts')
        .select('total_shares, total_likes')
        .eq('author_id', userId);

      if (statsError) throw statsError;

      const totalPosts = posts ? posts.length : 0;
      const totalShares = stats ? stats.reduce((acc, item) => acc + (item.total_shares || 0), 0) : 0;
      const totalLikes = stats ? stats.reduce((acc, item) => acc + (item.total_likes || 0), 0) : 0;

      res.json({ totalPosts, totalShares, totalLikes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
