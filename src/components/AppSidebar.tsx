import { useState, useEffect } from "react";
import { LayoutDashboard, Briefcase, CheckSquare, Share2, FileText, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Job Recommendations", url: "/dashboard/daily-jobs", icon: Briefcase },
  { title: "Applied Job Recommendations", url: "/dashboard/applied-jobs", icon: CheckSquare },
  { title: "Cover Letters", url: "/dashboard/cover-letters", icon: FileText },
  { title: "Social Media", url: "/dashboard/social-media", icon: Share2 },
];

export function AppSidebar() {
  const { open } = useSidebar();
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

  return (
    <Sidebar collapsible="icon" className="border-0">
      <SidebarContent className="bg-sidebar-background">
        {/* Header Section */}
        <div className="px-6 py-8 bg-sidebar-header border-b border-sidebar-border">
          {open ? (
            <>
              <h2 className="text-xl font-bold text-sidebar-foreground text-center mb-1">
                ResumeGenPro
              </h2>
              <p className="text-xs text-sidebar-foreground/70 text-center uppercase tracking-wider">
                Employee Dashboard
              </p>
            </>
          ) : (
            <div className="w-8 h-8 mx-auto bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">R</span>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        {open && (
          <div className="px-6 py-4 flex items-center gap-3 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
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
        )}

        {/* Main Menu */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase tracking-wider text-xs px-3 mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground/80 hover:bg-sidebar-menu-hover hover:text-sidebar-foreground rounded-lg transition-all duration-200 [&.active]:bg-white [&.active]:text-black [&.active]:font-medium [&.active]:shadow-sm [&.active:hover]:text-black"
                      activeClassName="active"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button at Bottom */}
      <SidebarFooter className="p-3 bg-sidebar-background border-t border-sidebar-border">
        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="w-full justify-start gap-3 bg-destructive hover:bg-destructive/90"
        >
          <LogOut className="w-5 h-5" />
          {open && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
