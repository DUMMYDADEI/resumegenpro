import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Trash2, Plus, Edit } from "lucide-react";

const SocialMedia = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [socialMediaId, setSocialMediaId] = useState<string | null>(null);
  const [rssFeeds, setRssFeeds] = useState<any[]>([]);
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSocialMediaDetails();
    fetchRssFeeds();
  }, []);

  const fetchSocialMediaDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("social_media_details")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setWhatsappNumber(data.whatsapp_number || "");
        setSocialMediaId(data.id);
      }
    } catch (error: any) {
      console.error("Error fetching social media details:", error);
    }
  };

  const fetchRssFeeds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("rss_feeds")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRssFeeds(data || []);
    } catch (error: any) {
      console.error("Error fetching RSS feeds:", error);
    }
  };

  const handleSaveSocialMedia = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (socialMediaId) {
        const { error } = await supabase
          .from("social_media_details")
          .update({ whatsapp_number: whatsappNumber })
          .eq("id", socialMediaId);

        if (error) throw error;
        toast.success("WhatsApp number updated successfully!");
      } else {
        const { data, error } = await supabase
          .from("social_media_details")
          .insert({ user_id: user.id, whatsapp_number: whatsappNumber })
          .select()
          .single();

        if (error) throw error;
        setSocialMediaId(data.id);
        toast.success("WhatsApp number saved successfully!");
      }
    } catch (error: any) {
      toast.error("Failed to save WhatsApp number");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRssFeed = async () => {
    if (!newFeedName || !newFeedUrl) {
      toast.error("Please fill in both feed name and URL");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (editingFeedId) {
        const { error } = await supabase
          .from("rss_feeds")
          .update({ feed_name: newFeedName, feed_url: newFeedUrl })
          .eq("id", editingFeedId);

        if (error) throw error;
        toast.success("RSS feed updated successfully!");
        setEditingFeedId(null);
      } else {
        const { error } = await supabase
          .from("rss_feeds")
          .insert({ user_id: user.id, feed_name: newFeedName, feed_url: newFeedUrl });

        if (error) throw error;
        toast.success("RSS feed added successfully!");
      }

      setNewFeedName("");
      setNewFeedUrl("");
      fetchRssFeeds();
    } catch (error: any) {
      toast.error("Failed to save RSS feed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFeed = (feed: any) => {
    setEditingFeedId(feed.id);
    setNewFeedName(feed.feed_name);
    setNewFeedUrl(feed.feed_url);
  };

  const handleDeleteFeed = async (feedId: string) => {
    try {
      const { error } = await supabase
        .from("rss_feeds")
        .delete()
        .eq("id", feedId);

      if (error) throw error;
      toast.success("RSS feed deleted successfully!");
      fetchRssFeeds();
    } catch (error: any) {
      toast.error("Failed to delete RSS feed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Social Media & RSS Feeds
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your contact details and job aggregator feeds
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            WhatsApp Contact
          </CardTitle>
          <CardDescription>
            Add your WhatsApp number for job notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="+1234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveSocialMedia} disabled={loading}>
            {socialMediaId ? "Update" : "Save"} WhatsApp Number
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Job Aggregator</CardTitle>
          <CardDescription>
            Add RSS feed links to aggregate job postings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 p-4 border rounded-lg bg-accent/5">
            <div className="space-y-2">
              <Label htmlFor="feedName">Feed Name</Label>
              <Input
                id="feedName"
                placeholder="e.g., Indeed Tech Jobs"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedUrl">RSS Feed URL</Label>
              <Input
                id="feedUrl"
                type="url"
                placeholder="https://example.com/rss/feed"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRssFeed} disabled={loading}>
                {editingFeedId ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingFeedId ? "Update Feed" : "Add Feed"}
              </Button>
              {editingFeedId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingFeedId(null);
                    setNewFeedName("");
                    setNewFeedUrl("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Your RSS Feeds</h3>
            {rssFeeds.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No RSS feeds added yet
              </p>
            ) : (
              rssFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{feed.feed_name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {feed.feed_url}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFeed(feed)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMedia;
