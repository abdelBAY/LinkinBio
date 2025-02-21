import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile, ThemeRecommendation } from "@shared/schema";
import { generateThemeRecommendation, getThemeDescription } from "@/lib/theme-recommender";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ThemeRecommendationProps {
  profile: Profile;
}

export function ThemeRecommendationCard({ profile }: ThemeRecommendationProps) {
  const [recommendation, setRecommendation] = useState<ThemeRecommendation | null>(null);
  const { toast } = useToast();

  const generateRecommendation = () => {
    const newRecommendation = generateThemeRecommendation(profile.themePreferences as any[]);
    setRecommendation(newRecommendation);
  };

  const applyTheme = useMutation({
    mutationFn: async (theme: ThemeRecommendation) => {
      return await apiRequest("PATCH", `/api/profiles/${profile.id}`, {
        background: theme.background,
        glassEffect: theme.glassEffect,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${profile.id}`] });
      toast({
        title: "Theme applied",
        description: "Your profile theme has been updated successfully.",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Theme Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={generateRecommendation}
          className="w-full mb-4"
          variant="outline"
        >
          Generate New Theme
        </Button>

        <AnimatePresence mode="wait">
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="rounded-lg p-4 bg-muted">
                <h3 className="font-semibold mb-2 capitalize">
                  {recommendation.style} Theme
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {getThemeDescription(recommendation)}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => applyTheme.mutate(recommendation)}
                    disabled={applyTheme.isPending}
                  >
                    Apply Theme
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
