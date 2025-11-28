import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PillNavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-between px-6 py-3 rounded-full bg-card/80 backdrop-blur-lg border border-border/50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent" />
          <span className="font-bold text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ResumeGenPro
          </span>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => navigate("/auth")}
          className="rounded-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
        >
          Get Started
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 rounded-full bg-card/80 backdrop-blur-lg border border-border/50 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary via-secondary to-accent" />
            <span className="font-bold text-base bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ResumeGenPro
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mt-2 p-4 rounded-3xl bg-card/95 backdrop-blur-lg border border-border/50 shadow-lg animate-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="px-4 py-3 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all duration-200 text-left"
                >
                  {item.label}
                </button>
              ))}
              <Button
                size="sm"
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PillNavBar;
