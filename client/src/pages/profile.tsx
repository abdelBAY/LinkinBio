import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile, Link, InsertLink } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getPlatformName } from "@/lib/platform-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/components/profile-header";
import { LinkList } from "@/components/link-list";
import { Plus, Trash2 } from "lucide-react";
import { ThemeRecommendationCard } from "@/components/theme-recommendation";

const DEMO_PROFILE_ID = 1;

function ProfilePage() {
  const { toast } = useToast();

  const { data: profile } = useQuery<Profile>({
    queryKey: [`/api/profiles/${DEMO_PROFILE_ID}`],
  });

  const { data: links = [] } = useQuery<Link[]>({
    queryKey: [`/api/profiles/${DEMO_PROFILE_ID}/links`],
  });

  const profileForm = useForm({
    defaultValues: {
      name: "",
      bio: "",
      avatarSeed: "",
      theme: "light",
      background: "gradient1",
      glassEffect: true,
      themePreferences: ['professional', 'modern'],
    },
  });

  const linkForm = useForm({
    defaultValues: {
      profileId: DEMO_PROFILE_ID,
      title: "",
      url: "",
      platform: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset(profile);
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      return await apiRequest("PATCH", `/api/profiles/${DEMO_PROFILE_ID}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${DEMO_PROFILE_ID}`] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    },
  });

  const createLink = useMutation({
    mutationFn: async (data: InsertLink) => {
      return await apiRequest("POST", "/api/links", {
        ...data,
        order: links.length,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${DEMO_PROFILE_ID}/links`] });
      linkForm.reset();
      toast({
        title: "Link added",
        description: "Your new link has been added successfully.",
      });
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${DEMO_PROFILE_ID}/links`] });
      toast({
        title: "Link deleted",
        description: "The link has been removed successfully.",
      });
    },
  });

  if (!profile) {
    return <Skeleton className="w-full h-96" />;
  }

  const backgrounds = [
    { value: "gradient1", label: "Purple Dream" },
    { value: "gradient2", label: "Ocean Breeze" },
    { value: "gradient3", label: "Sunset Glow" },
    { value: "gradient4", label: "Forest Mist" },
  ] as const;

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <ProfileHeader profile={profile} />

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit((data) => updateProfile.mutate(data))} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="avatarSeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar Seed</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a background" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {backgrounds.map((bg) => (
                            <SelectItem key={bg.value} value={bg.value}>
                              {bg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="glassEffect"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Glass Effect</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
                  Save Changes
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <ThemeRecommendationCard profile={profile} />

        <Card>
          <CardHeader>
            <CardTitle>Manage Links</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...linkForm}>
              <form onSubmit={linkForm.handleSubmit((data) => createLink.mutate(data))} className="space-y-4">
                <FormField
                  control={linkForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={linkForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            try {
                              const platform = getPlatformName(e.target.value);
                              if (platform && !linkForm.getValues("title")) {
                                linkForm.setValue("title", platform.charAt(0).toUpperCase() + platform.slice(1));
                              }
                            } catch {}
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={createLink.isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </form>
            </Form>

            <div className="mt-8">
              <AnimatePresence>
                {links.map((link) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 mb-2"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteLink.mutate(link.id)}
                      disabled={deleteLink.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;