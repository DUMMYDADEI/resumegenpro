import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Briefcase, FileCheck, Sparkles } from "lucide-react";
import PillNavBar from "@/components/PillNavBar";
const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setSession(session);
      setLoading(false);
    });
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="animate-pulse text-2xl font-semibold text-primary">Loading...</div>
      </div>;
  }
  if (session) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="animate-pulse text-2xl font-semibold text-primary">Redirecting…</div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <PillNavBar />
      <div className="container max-w-6xl mx-auto px-4 py-16 pt-28">
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

          {/* Features Section with Attractive Heading */}
          <div id="features" className="mt-24">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                ✨ Features
              </div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent px-0 py-[6px] my-[5px] md:text-6xl">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools to accelerate your job search and land your dream role
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Upload Your Resume</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Securely upload your resume and let our AI analyze your skills and experience
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
              animationDelay: '0.1s'
            }}>
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">AI-Powered Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced AI finds the perfect job matches based on your unique profile
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
              animationDelay: '0.2s'
            }}>
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Daily Opportunities</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive 5 personalized job recommendations every day, tailored to your career goals
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mt-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold text-primary">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up quickly with your email and set up your profile
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold text-secondary">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
                <p className="text-muted-foreground">
                  Upload your resume and our AI will analyze your skills and experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold text-accent">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Matched</h3>
                <p className="text-muted-foreground">
                  Receive daily personalized job recommendations directly to your dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="mt-32">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/40 transition-colors">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>5 job recommendations/day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>Basic AI matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>Resume storage</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </div>

              <div className="p-8 rounded-2xl bg-card border-2 border-primary hover:border-primary/60 transition-colors relative overflow-hidden">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>15 job recommendations/day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>Advanced AI matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>Auto-generated cover letters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">✓</div>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full rounded-full" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </div>

              <div className="p-8 rounded-2xl bg-card border-2 border-border hover:border-accent/40 transition-colors">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹2,999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                    <span>Unlimited recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</div>
                    <span>API access</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full rounded-full" onClick={() => navigate("/auth")}>
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div id="contact-us" className="mt-32 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Get In Touch</h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="p-8 rounded-2xl bg-card border-2 border-border">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a href="mailto:support@resumegenpro.com" className="text-primary hover:underline">
                      support@resumegenpro.com
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a href="tel:+911234567890" className="text-primary hover:underline">
                      +91 12345 67890
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Office</h3>
                    <p className="text-muted-foreground">
                      Bangalore, Karnataka, India
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full rounded-full" onClick={() => window.location.href = 'mailto:support@resumegenpro.com'}>
                      Send us a message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developers Section (Placeholder) */}
          <div id="developers" className="mt-32 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">For Developers</h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;