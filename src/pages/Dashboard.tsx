import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Send, CheckCircle, XCircle } from "lucide-react";

const Dashboard = () => {
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [rssFeeds, setRssFeeds] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchResumes();
    fetchWhatsappNumber();
    fetchRssFeeds();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch resumes");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("resumes").insert({
        user_id: user.id,
        file_name: file.name,
        file_path: fileName,
      });

      if (dbError) throw dbError;

      toast.success("Resume uploaded successfully!");
      fetchResumes();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const fetchWhatsappNumber = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("social_media_details")
        .select("whatsapp_number")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setWhatsappNumber(data?.whatsapp_number || "");
    } catch (error: any) {
      console.error("Failed to fetch WhatsApp number");
    }
  };

  const fetchRssFeeds = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("rss_feeds")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setRssFeeds(data || []);
    } catch (error: any) {
      console.error("Failed to fetch RSS feeds");
    }
  };

  const handleDeleteResume = async (resume: any) => {
    try {
      const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([resume.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resume.id);

      if (dbError) throw dbError;

      toast.success("Resume deleted successfully!");
      fetchResumes();
    } catch (error: any) {
      toast.error("Failed to delete resume");
    }
  };

  const canSendWebhook = selectedResumeId && whatsappNumber && rssFeeds.length > 0;

  const handleSendWebhook = async () => {
    if (!canSendWebhook) {
      toast.error("Please ensure resume, WhatsApp number, and RSS feed are configured");
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      
      // Download the resume file from Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("resumes")
        .download(selectedResume.file_path);

      if (downloadError) throw downloadError;

      // Get the first RSS feed URL
      const rssFeedUrl = rssFeeds[0]?.feed_url || "";

      // Create FormData to send binary file and metadata
      const formData = new FormData();
      formData.append("resume", fileData, selectedResume.file_name);
      formData.append("file_name", selectedResume.file_name);
      formData.append("user_id", user.id);
      formData.append("whatsapp_number", whatsappNumber);
      formData.append("rss_feed_url", rssFeedUrl);

      const response = await fetch("https://n8n.techverseinfo.tech/webhook-test/resume-intake", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to send webhook");

      toast.success("Resume data sent successfully!");
      setSelectedResumeId("");
    } catch (error: any) {
      toast.error("Failed to send webhook: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back! Manage your resumes here.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload your resume to get personalized job recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-12 h-12 text-primary" />
                    <span className="text-sm font-medium">
                      {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-muted-foreground">PDF files only</span>
                  </Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Your Resumes
              </CardTitle>
              <CardDescription>
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resumes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No resumes uploaded yet
                  </p>
                ) : (
                  resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{resume.file_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resume.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteResume(resume)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send to Webhook
              </CardTitle>
              <CardDescription>
                Select a resume and send it with your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume-select">Select Resume</Label>
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger id="resume-select">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.file_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {whatsappNumber ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className={whatsappNumber ? "text-foreground" : "text-muted-foreground"}>
                    WhatsApp: {whatsappNumber || "Not configured"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {rssFeeds.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <span className={rssFeeds.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                    RSS Feeds: {rssFeeds.length} configured
                  </span>
                </div>
              </div>

              <Button 
                onClick={handleSendWebhook} 
                disabled={!canSendWebhook || sending}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending..." : "Send to Webhook"}
              </Button>

              {!canSendWebhook && (
                <p className="text-xs text-muted-foreground text-center">
                  Configure all required fields in Social Media settings
                </p>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default Dashboard;
