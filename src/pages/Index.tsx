import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Briefcase, FileCheck, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="animate-pulse text-2xl font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="animate-pulse text-2xl font-semibold text-primary">Redirecting…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ResumeGenPro
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered job hunting companion. Get personalized job recommendations tailored to your resume.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Get Started
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-xl bg-card border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
              <p className="text-muted-foreground">
                Securely upload your resume and let our AI analyze your skills and experience
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Our advanced AI finds the perfect job matches based on your unique profile
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Opportunities</h3>
              <p className="text-muted-foreground">
                Receive 5 personalized job recommendations every day, tailored to your career goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
