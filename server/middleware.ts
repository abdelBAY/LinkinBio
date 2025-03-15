
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const profileId = parseInt(req.params.id);
  const profile = await storage.getProfile(profileId);
  
  if (!profile || !profile.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  
  next();
}
