import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema } from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function registerRoutes(app: Express): Promise<Server> {
  // This file is no longer needed for Vercel deployment.
}
