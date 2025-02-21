import { Card } from "@/components/ui/card";

interface MediaWidgetProps {
  url: string;
  type: "spotify" | "youtube";
}

export function MediaWidget({ url, type }: MediaWidgetProps) {
  // Extract IDs from URLs
  const getSpotifyEmbedUrl = (url: string) => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? `https://open.spotify.com/embed/track/${match[1]}` : null;
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = type === "spotify" ? getSpotifyEmbedUrl(url) : getYoutubeEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <Card className="w-full max-w-xl mx-auto mt-6 overflow-hidden backdrop-blur-lg bg-white/50 dark:bg-black/50">
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow={type === "spotify" ? "encrypted-media" : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}
          allowFullScreen={type === "youtube"}
        />
      </div>
    </Card>
  );
}
