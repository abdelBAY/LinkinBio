import { SiGithub, SiX, SiInstagram, SiLinkedin, SiYoutube, SiTiktok, SiFacebook, SiMedium, SiTwitch } from "react-icons/si";
import { Globe } from "lucide-react";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

export function getPlatformIcon(url: string): IconType | LucideIcon {
  const domain = new URL(url).hostname.toLowerCase();

  if (domain.includes("github")) return SiGithub;
  if (domain.includes("twitter") || domain.includes("x.com")) return SiX;
  if (domain.includes("instagram")) return SiInstagram;
  if (domain.includes("linkedin")) return SiLinkedin;
  if (domain.includes("youtube")) return SiYoutube;
  if (domain.includes("tiktok")) return SiTiktok;
  if (domain.includes("facebook")) return SiFacebook;
  if (domain.includes("medium")) return SiMedium;
  if (domain.includes("twitch")) return SiTwitch;

  return Globe;
}

export function getPlatformName(url: string): string {
  const domain = new URL(url).hostname.toLowerCase();
  return domain.split(".")[1] || "website";
}