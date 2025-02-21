import { useQuery } from "@tanstack/react-query";
import { ProfileHeader } from "@/components/profile-header";
import { LinkList } from "@/components/link-list";
import { MediaWidget } from "@/components/media-widget";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Profile, Link } from "@shared/schema";
import { useLocation } from "wouter";

const DEMO_PROFILE_ID = 1;

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();

  const { data: profile } = useQuery<Profile>({
    queryKey: [`/api/profiles/${DEMO_PROFILE_ID}`],
  });

  const { data: links } = useQuery<Link[]>({
    queryKey: [`/api/profiles/${DEMO_PROFILE_ID}/links`],
  });

  if (!profile || !links) return null;

  const gradientStyles = {
    backgroundImage: `url(${getGradientBackground(profile.background)})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen p-4" style={gradientStyles}>
      <div className="fixed top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto pt-8">
        <ProfileHeader profile={profile} />
        {profile.mediaUrl && profile.mediaType && (
          <MediaWidget url={profile.mediaUrl} type={profile.mediaType as "spotify" | "youtube"} />
        )}
        <LinkList links={links} profileId={profile.id} />
      </div>
    </div>
  );
}

function getGradientBackground(type: string) {
  const backgrounds = {
    gradient1: "https://images.unsplash.com/photo-1529678407585-55ac0053aa47",
    gradient2: "https://images.unsplash.com/photo-1529322365446-6efd62aed02e",
    gradient3: "https://images.unsplash.com/photo-1629654858857-615c2c8be8a8",
    gradient4: "https://images.unsplash.com/photo-1629196613836-0a7e2541990a",
  } as const;
  return backgrounds[type as keyof typeof backgrounds] || backgrounds.gradient1;
}