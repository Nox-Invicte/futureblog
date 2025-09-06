import { type BlogPost, type InsertBlogPost, type UpdateBlogPost, type BlogPostWithAuthor } from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export interface IStorage {
  // Blog post methods
  getAllPublishedPosts(): Promise<BlogPostWithAuthor[]>;
  getPostById(id: string): Promise<BlogPostWithAuthor | undefined>;
  getUserPosts(userId: string): Promise<BlogPost[]>;
  createPost(post: InsertBlogPost): Promise<BlogPost>;
  updatePost(id: string, post: UpdateBlogPost): Promise<BlogPost | undefined>;
  deletePost(id: string, userId: string): Promise<boolean>;
  getUserStats(userId: string): Promise<{ totalPosts: number; totalViews: number; totalLikes: number }>;
}

export class DatabaseStorage implements IStorage {

  async getAllPublishedPosts(): Promise<BlogPostWithAuthor[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    // Map the data to match our interface
    const postsWithAuthors = data.map((row) => {
      return {
        id: row.id,
        userId: row.user_id,
        title: row.title,
        content: row.content,
        excerpt: row.excerpt,
        category: row.category,
        imageUrl: row.image_url,
        published: row.published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        author: row.author || 'Unknown Author',
      };
    });

    return postsWithAuthors;
  }

  async getPostById(id: string): Promise<BlogPostWithAuthor | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      imageUrl: data.image_url,
      published: data.published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      author: data.author || 'Unknown Author',
    };
  }

  async getUserPosts(userId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('user_id', userId);
    if (error || !data) return [];
    return data.map(row => ({
      id: row.id,
      userId: row.user_id,
      author: row.author,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      category: row.category,
      imageUrl: row.image_url,
      published: row.published,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async createPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const newPost = {
      user_id: insertPost.userId,
      author: insertPost.author || 'Unknown Author',
      title: insertPost.title,
      content: insertPost.content,
      excerpt: insertPost.excerpt,
      category: insertPost.category,
      image_url: insertPost.imageUrl || null,
      published: insertPost.published || false,
    };

    const { data, error } = await supabase.from('blog_posts').insert(newPost).select().single();
    if (error) throw error;
    return data;
  }

  async updatePost(id: string, updatePost: UpdateBlogPost): Promise<BlogPost | undefined> {
    const updateData: any = { ...updatePost, updated_at: new Date().toISOString() };
    if (updatePost.imageUrl !== undefined) updateData.image_url = updatePost.imageUrl;

    const { data, error } = await supabase.from('blog_posts').update(updateData).eq('id', id).select().single();
    if (error || !data) return undefined;
    return data;
  }

  async deletePost(id: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase.from('blog_posts').delete().eq('id', id).eq('user_id', userId);
    if (error) return false;
    return true;
  }

  async getUserStats(userId: string): Promise<{ totalPosts: number; totalViews: number; totalLikes: number }> {
    const userPosts = await this.getUserPosts(userId);
    return {
      totalPosts: userPosts.length,
      totalViews: userPosts.reduce((sum, post) => sum + 0, 0), // Mock data for now
      totalLikes: userPosts.reduce((sum, post) => sum + 0, 0), // Mock data for now
    };
  }
}

export const storage = new DatabaseStorage();
