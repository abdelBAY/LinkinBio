import { Profile } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${profile.avatarSeed}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-xl mx-auto backdrop-blur-lg bg-white/50 dark:bg-black/50">
        <CardContent className="pt-6 text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={avatarUrl} alt={profile.name} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
