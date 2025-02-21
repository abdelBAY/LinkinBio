import { Profile } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const avatarUrl = "/assets/WhatsApp Image 2025-02-07 à 19.44.21_9d773911.jpg";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          bounce: 0.3
        }}
      >
        <Card className="w-full max-w-xl mx-auto backdrop-blur-lg bg-white/50 dark:bg-black/50 hover:bg-white/60 dark:hover:bg-black/60 transition-colors">
          <CardContent className="pt-6 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage src={avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {profile.name}
            </motion.h1>
            {profile.bio && (
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {profile.bio}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}