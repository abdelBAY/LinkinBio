import { Express, Request, Response } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertLinkSchema } from "@shared/schema";
import { requireAdmin } from "./middleware";

export async function registerRoutes(app: Express) {
  app.get("/api/profiles/:id", async (req: Request, res: Response) => {
    const profile = await storage.getProfile(parseInt(req.params.id));
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  });

  app.post("/api/profiles", async (req: Request, res: Response) => {
    const parsed = insertProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const profile = await storage.createProfile(parsed.data);
    res.json(profile);
  });

  app.patch("/api/profiles/:id", requireAdmin, async (req: Request, res: Response) => {
    const profile = await storage.updateProfile(parseInt(req.params.id), req.body);
    res.json(profile);
  });

  app.get("/api/profiles/:id/links", async (req: Request, res: Response) => {
    const links = await storage.getLinks(parseInt(req.params.id));
    res.json(links);
  });

  app.post("/api/links", async (req: Request, res: Response) => {
    const parsed = insertLinkSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const link = await storage.createLink(parsed.data);
    res.json(link);
  });

  app.patch("/api/links/:id", async (req: Request, res: Response) => {
    const link = await storage.updateLink(parseInt(req.params.id), req.body);
    res.json(link);
  });

  app.delete("/api/links/:id", async (req: Request, res: Response) => {
    await storage.deleteLink(parseInt(req.params.id));
    res.status(204).end();
  });

  app.post("/api/links/:id/click", async (req: Request, res: Response) => {
    const link = await storage.incrementClicks(parseInt(req.params.id));
    res.json(link);
  });

  return createServer(app);
}
