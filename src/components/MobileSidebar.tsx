import { useState, useEffect } from "react";
import { LayoutDashboard, Briefcase, CheckSquare, Share2, FileText, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Job Recommendations", url: "/dashboard/daily-jobs", icon: Briefcase },
  { title: "Applied Job Recommendations", url: "/dashboard/applied-jobs", icon: CheckSquare },
  { title: "Cover Letters", url: "/dashboard/cover-letters", icon: FileText },
  { title: "Social Media", url: "/dashboard/social-media", icon: Share2 },
];

interface MobileSidebarProps {
  onNavigate?: () => void;
}

export function MobileSidebar({ onNavigate }: MobileSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Signed out successfully",
    });
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-sidebar-background">
      {/* Header Section */}
      <div className="shrink-0 px-6 py-6 bg-sidebar-header border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground text-center mb-1">
          ResumeGenPro
        </h2>
        <p className="text-xs text-sidebar-foreground/70 text-center uppercase tracking-wider">
          Employee Dashboard
        </p>
      </div>

      {/* User Profile Section */}
      <div className="shrink-0 px-6 py-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-sidebar-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {userName}
          </p>
          <p className="text-xs text-sidebar-foreground/60">
            Job Seeker
          </p>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-sidebar-foreground/70 uppercase tracking-wider text-xs px-3 mb-2">
          Main Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              onClick={handleNavClick}
              className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-menu-hover hover:text-sidebar-foreground rounded-lg transition-all duration-200 [&.active]:bg-sidebar-menu-hover [&.active]:text-sidebar-menu-active-foreground [&.active]:font-medium [&.active]:shadow-sm"
              activeClassName="active"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <div className="shrink-0 p-3 border-t border-sidebar-border">
        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="w-full justify-start gap-3 bg-destructive hover:bg-destructive/90"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
