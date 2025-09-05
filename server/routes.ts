import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema } from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function registerRoutes(app: Express): Promise<Server> {
  // Note: Authentication is handled by Supabase Auth directly
  // No need for custom auth routes since we're using Supabase Auth

  // Blog post routes
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getAllPublishedPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User's posts routes (requires authentication)
  app.get("/api/posts/my", async (req, res) => {
    try {
      const authorId = req.headers['x-user-id'] as string;
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const posts = await storage.getUserPosts(authorId);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/posts/my/stats", async (req, res) => {
    try {
      const authorId = req.headers['x-user-id'] as string;
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const stats = await storage.getUserStats(authorId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const authorId = req.headers['x-user-id'] as string;
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId,
      });

      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const authorId = req.headers['x-user-id'] as string;
      
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Check if post exists and belongs to user
      const existingPost = await storage.getPostById(id);
      if (!existingPost || existingPost.userId !== authorId) {
        return res.status(404).json({ message: "Post not found" });
      }

      const updateData = updateBlogPostSchema.parse(req.body);
      const updatedPost = await storage.updatePost(id, updateData);
      
      res.json(updatedPost);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const authorId = req.headers['x-user-id'] as string;
      
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const deleted = await storage.deletePost(id, authorId);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
