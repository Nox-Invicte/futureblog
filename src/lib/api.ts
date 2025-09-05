
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


// Create a new post
export async function createPost(data: { title: string; content: string; category: string }) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json();
}

// Update an existing post
export async function updatePost(id: string, data: { title: string; content: string; category: string }) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return await res.json();
}

// Fetch posts for a specific user
export async function getUserPosts(userId: string): Promise<BlogPost[]> {
  const res = await fetch(`/api/posts/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user posts');
  return await res.json();
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete post');
}

// Fetch user stats
export async function getUserStats(userId: string): Promise<{ totalPosts: number; totalShares: number; totalLikes: number }> {
  const res = await fetch(`/api/userStats/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user stats');
  return await res.json();
}
