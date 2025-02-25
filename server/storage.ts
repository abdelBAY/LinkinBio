import { Profile, InsertProfile, Link, InsertLink } from "@shared/schema";

export interface IStorage {
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<Profile>;

  getLinks(profileId: number): Promise<Link[]>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, link: Partial<Link>): Promise<Link>;
  deleteLink(id: number): Promise<void>;
  incrementClicks(id: number): Promise<Link>;
}

export class MemStorage implements IStorage {
  private profiles: Map<number, Profile>;
  private links: Map<number, Link>;
  private profileId: number;
  private linkId: number;

  constructor() {
    this.profiles = new Map();
    this.links = new Map();
    this.profileId = 1;
    this.linkId = 1;

    // Create initial profile
    this.createProfile({
      name: "Abdellatif Bayejou (ⵄⴰⴱⴷⵍⵟⵉⴼ ⴱⴰⵢⵊⵓ)",
      bio: "Welcome to my links page!",
      avatarSeed: "abdellatif",
      theme: "light",
      background: "gradient1",
      glassEffect: true,
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      mediaType: "youtube",
      themePreferences: ["professional", "modern"],
    });

    // Create some initial links
    this.createLink({
      profileId: 1,
      title: "GitHub",
      url: "https://github.com/abdelBAY",
      order: 0,
    });

    this.createLink({
      profileId: 1,
      title: "Instagram",
      url: "https://www.instagram.com/abdellatif_bj/",
      order: 1,
    });

    this.createLink({
      profileId: 1,
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/abdellatif-bayejou-337770233",
      order: 2,
    });

    this.createLink({
      profileId: 1,
      title: "Facebook",
      url: "https://web.facebook.com/red.moon.161/",
      order: 3,
    });
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.profileId++;
    const newProfile: Profile = {
      id,
      name: profile.name,
      bio: profile.bio ?? null,
      avatarSeed: profile.avatarSeed,
      theme: profile.theme ?? "light",
      background: profile.background ?? "gradient1",
      glassEffect: profile.glassEffect ?? true,
      mediaUrl: profile.mediaUrl ?? null,
      mediaType: profile.mediaType ?? null,
      themePreferences: profile.themePreferences ?? ["professional", "modern"],
      lastThemeUpdate: null,
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile> {
    const existing = await this.getProfile(id);
    if (!existing) throw new Error("Profile not found");
    const updated = { ...existing, ...profile };
    this.profiles.set(id, updated);
    return updated;
  }

  async getLinks(profileId: number): Promise<Link[]> {
    return Array.from(this.links.values())
      .filter((link) => link.profileId === profileId)
      .sort((a, b) => a.order - b.order);
  }

  async createLink(link: InsertLink): Promise<Link> {
    const id = this.linkId++;
    const newLink: Link = {
      id,
      profileId: link.profileId,
      title: link.title,
      url: link.url,
      platform: link.platform ?? null,
      order: link.order,
      clicks: 0,
    };
    this.links.set(id, newLink);
    return newLink;
  }

  async updateLink(id: number, link: Partial<Link>): Promise<Link> {
    const existing = this.links.get(id);
    if (!existing) throw new Error("Link not found");
    const updated = { ...existing, ...link };
    this.links.set(id, updated);
    return updated;
  }

  async deleteLink(id: number): Promise<void> {
    this.links.delete(id);
  }

  async incrementClicks(id: number): Promise<Link> {
    const link = this.links.get(id);
    if (!link) throw new Error("Link not found");
    const updated = { ...link, clicks: link.clicks + 1 };
    this.links.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();