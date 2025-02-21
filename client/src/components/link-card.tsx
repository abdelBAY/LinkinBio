import { Link } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getPlatformIcon } from "@/lib/platform-icons";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const queryClient = useQueryClient();
  const Icon = getPlatformIcon(link.url);

  const handleClick = async () => {
    await apiRequest("POST", `/api/links/${link.id}/click`);
    queryClient.invalidateQueries({ queryKey: [`/api/profiles/${link.profileId}/links`] });
    window.open(link.url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <Card 
        onClick={handleClick}
        className="cursor-pointer hover:shadow-lg transition-shadow backdrop-blur-lg bg-white/50 dark:bg-black/50 border border-transparent hover:border-primary/20"
      >
        <CardContent className="p-4 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-medium">{link.title}</h3>
            <p className="text-sm text-muted-foreground">
              {link.clicks} clicks
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}