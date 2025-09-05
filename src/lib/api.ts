
// Local type definitions
export interface BlogPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  author?: any;
}

export interface BlogPostWithAuthor extends BlogPost {
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

// Fetch all published posts
export async function getAllPosts(): Promise<BlogPostWithAuthor[]> {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
}

// Fetch a single post by ID
export async function getPostById(id: string): Promise<BlogPostWithAuthor | null> {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) return null;
  return await res.json();
}

// The following features require new API endpoints to be implemented in /api:
// - getUserPosts
// - createPost
// - updatePost
// - deletePost
// - likePost
// - unlikePost
// - getPostLikes
// - isPostLikedByUser
// - addComment
// - getPostComments
// - sharePost
// - getPostShares
// - getUserStats

// You can add fetch-based implementations here once the corresponding endpoints exist in /api.
