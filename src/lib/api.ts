import { supabase } from './supabase';

// Local type definitions

export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export async function getAllPosts(): Promise<BlogPostWithAuthor[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Map the data to match our interface

  const postsWithAuthors = data.map((post) => {
    return {
      id: post.id,
      authorId: post.user_id,
      title: post.title,
      content: post.content,
      category: post.category || 'General',
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      excerpt: post.excerpt,
      author: {
        id: post.user_id,
        name: post.author || 'Unknown Author',
        avatar: null,
      },
    };
  });

  return postsWithAuthors;
}

export async function getPostById(id: string): Promise<BlogPostWithAuthor | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }

  return {
    id: data.id,
    authorId: data.user_id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category || 'General',
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    author: {
      id: data.user_id,
      name: data.author || 'Unknown Author',
      avatar: null,
    },
  };
}

export async function getUserPosts(userId: string): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(post => ({
    id: post.id,
    authorId: post.user_id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    category: post.category || 'General',
    createdAt: new Date(post.created_at),
    updatedAt: new Date(post.updated_at),
  }));
}

export async function createPost(post: {
  title: string;
  content: string;
}): Promise<BlogPost> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      user_id: user.id,
      author: user.user_metadata?.name || 'Unknown Author',
      title: post.title,
      content: post.content,
      excerpt: post.content.substring(0, 150) + '...',
      category: 'General',
  published: true,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    authorId: data.user_id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category || 'General',
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function updatePost(id: string, updates: {
  title?: string;
  content?: string;
}): Promise<BlogPost> {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Build the update object
  const updateData: any = {};
  
  if (updates.title) {
    updateData.title = updates.title;
  }
  
  if (updates.content) {
    updateData.content = updates.content;
    updateData.excerpt = updates.content.substring(0, 150) + '...';
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own posts
    .select()
    .single();

  if (error) {
    console.error('Update error:', error);
    throw error;
  }

  return {
    id: data.id,
    authorId: data.user_id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category || 'General',
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function deletePost(id: string): Promise<void> {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own posts

  if (error) throw error;
}

// Like functionality
export async function likePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id });

  if (error) throw error;
}

export async function unlikePost(postId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function getPostLikes(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) throw error;
  return count || 0;
}

export async function isPostLikedByUser(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Use .maybeSingle() if available, otherwise .limit(1) and check array length
  let data, error;
  if (typeof supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', user.id).maybeSingle === 'function') {
    ({ data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle());
    if (error) throw error;
    return !!data;
  } else {
    ({ data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .limit(1));
    if (error) throw error;
    return Array.isArray(data) && data.length > 0;
  }
}

// Comment functionality
export async function addComment(postId: string, content: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('post_comments')
    .insert({ post_id: postId, user_id: user.id, content });

  if (error) throw error;
}

export async function getPostComments(postId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      user:user_id (
        id,
        user_metadata
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Share functionality with tracking
export async function sharePost(postId: string, title: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Track the share if user is authenticated
  if (user) {
    try {
      // Insert share record (will fail silently if user already shared this post)
      await supabase
        .from('post_shares')
        .insert({ post_id: postId, user_id: user.id });
      
      // Increment share count
      await supabase.rpc('increment_post_share_count', {
        post_uuid: postId
      });
    } catch (error) {
      // Ignore duplicate share errors (user already shared this post)
      console.log('Share tracking error (likely duplicate):', error);
    }
  }

  // Perform the actual sharing
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out this blog post: ${title}`,
        url: `${window.location.origin}/post/${postId}`,
      });
    } catch (error) {
      // User cancelled sharing or error occurred
      console.log('Share cancelled or failed:', error);
    }
  } else {
    // Fallback: copy to clipboard
    const url = `${window.location.origin}/post/${postId}`;
    await navigator.clipboard.writeText(url);
  }
}

export async function getPostShares(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('post_shares')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) throw error;
  return count || 0;
}

// User stats functionality
export async function getUserStats(userId: string): Promise<{
  totalPosts: number;
  totalShares: number;
  totalLikes: number;
  avgSharesPerPost: number;
}> {
  // Get user's posts with share counts
  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select('id, share_count')
    .eq('user_id', userId);

  if (postsError) throw postsError;

  const totalPosts = posts?.length || 0;
  const totalShares = posts?.reduce((sum, post) => sum + (post.share_count || 0), 0) || 0;
  const avgSharesPerPost = totalPosts > 0 ? Math.round(totalShares / totalPosts) : 0;

  // Get total likes across all user's posts
  const { count: totalLikes, error: likesError } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .in('post_id', posts?.map(p => p.id) || []);

  if (likesError) throw likesError;

  return {
    totalPosts,
    totalShares,
    totalLikes: totalLikes || 0,
    avgSharesPerPost,
  };
}
