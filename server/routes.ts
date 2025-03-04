import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertElementsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/extract", async (req, res) => {
    try {
      const data = insertElementsSchema.parse(req.body);
      const result = await storage.saveExtractedElements(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  app.get("/api/elements/:id", async (req, res) => {
    const elements = await storage.getExtractedElements(parseInt(req.params.id));
    if (!elements) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(elements);
  });

  const httpServer = createServer(app);
  return httpServer;
}
