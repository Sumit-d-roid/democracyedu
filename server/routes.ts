import contactRoute from './contactRoute';
import type { Express } from "express";
import express from 'express';
import { z } from 'zod';
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const API_VERSION = 'v1';
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // API routes with versioning
  app.use(`/api/${API_VERSION}`, contactRoute);

  // Unified progress sync endpoint
  const progressSchema = z.object({
    progress: z.array(z.object({
      lessonId: z.string(),
      sectionId: z.string().optional(),
      completed: z.boolean().optional(),
      points: z.number().optional(),
      timestamp: z.string().optional()
    })).min(1)
  });

  app.post(`/api/${API_VERSION}/progress/sync`, express.json(), (req, res) => {
    const parse = progressSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid payload', issues: parse.error.issues });
    }
    // TODO: Persist progress to storage (stub)
    res.status(200).json({ status: 'ok', received: parse.data.progress.length });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
