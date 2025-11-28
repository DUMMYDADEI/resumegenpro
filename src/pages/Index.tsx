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
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-28">
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              ResumeGenPro
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-2">
              Your AI-powered job hunting companion. Get personalized job recommendations tailored to your resume.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
              Get Started
              <Sparkles className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Features Section with Attractive Heading */}
          <div id="features" className="mt-16 sm:mt-20 md:mt-24">
            <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in px-2">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                ✨ Features
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                Everything You Need to Succeed
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful tools to accelerate your job search and land your dream role
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="group p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Upload Your Resume</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Securely upload your resume and let our AI analyze your skills and experience
                </p>
              </div>

              <div className="group p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-secondary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{
              animationDelay: '0.1s'
            }}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">AI-Powered Matching</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Our advanced AI finds the perfect job matches based on your unique profile
                </p>
              </div>

              <div className="group p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in sm:col-span-2 md:col-span-1" style={{
              animationDelay: '0.2s'
            }}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground">Daily Opportunities</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Receive 5 personalized job recommendations every day, tailored to your career goals
                </p>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mt-20 sm:mt-24 md:mt-32 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
          <div id="pricing" className="mt-20 sm:mt-24 md:mt-32 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">Simple Pricing</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
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
          <div id="contact-us" className="mt-20 sm:mt-24 md:mt-32 mb-12 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">Get In Touch</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
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
          <div id="developers" className="mt-20 sm:mt-24 md:mt-32 mb-12 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4">For Developers</h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-center mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
              Coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;