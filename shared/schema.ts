import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  isAdmin: boolean("is_admin").notNull().default(false),
  avatarSeed: text("avatar_seed").notNull(),
  theme: text("theme").notNull().default("light"),
  background: text("background").notNull().default("gradient1"),
  glassEffect: boolean("glass_effect").notNull().default(true),
  mediaUrl: text("media_url"),
  mediaType: text("media_type"),
  themePreferences: jsonb("theme_preferences").default(['professional', 'modern']).notNull(),
  lastThemeUpdate: text("last_theme_update"),
});

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  platform: text("platform"),
  order: integer("order").notNull(),
  clicks: integer("clicks").notNull().default(0),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertLinkSchema = createInsertSchema(links).omit({ id: true, clicks: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Link = typeof links.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;

// Theme types
export type ThemeStyle = 'professional' | 'modern' | 'playful' | 'minimal' | 'bold';
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';

export interface ThemeRecommendation {
  style: ThemeStyle;
  color: ThemeColor;
  background: string;
  glassEffect: boolean;
}