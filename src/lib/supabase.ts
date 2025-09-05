import { createClient } from '@supabase/supabase-js';

// Supabase client for auth and database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          user_id: string; // UUID
          author: string | null;
          title: string;
          content: string;
          excerpt: string;
          category: string;
          image_url: string | null;
          published: boolean;
          share_count: number;
          created_at: string; // timestamptz
          updated_at: string; // timestamptz
        };
        Insert: {
          id?: string;
          user_id: string; // UUID
          author?: string | null;
          title: string;
          content: string;
          excerpt: string;
          category: string;
          image_url?: string | null;
          published?: boolean;
          share_count?: number;
          created_at?: string; // timestamptz
          updated_at?: string; // timestamptz
        };
        Update: {
          id?: string;
          user_id?: string; // UUID
          author?: string | null;
          title?: string;
          content?: string;
          excerpt?: string;
          category?: string;
          image_url?: string | null;
          published?: boolean;
          share_count?: number;
          created_at?: string; // timestamptz
          updated_at?: string; // timestamptz
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      post_shares: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
