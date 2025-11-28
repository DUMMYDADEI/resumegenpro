import { LayoutDashboard, Briefcase, CheckSquare, Share2, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Job Recommendations", url: "/dashboard/daily-jobs", icon: Briefcase },
  { title: "Applied Job Recommendations", url: "/dashboard/applied-jobs", icon: CheckSquare },
  { title: "Cover Letters", url: "/dashboard/cover-letters", icon: FileText },
  { title: "Social Media", url: "/dashboard/social-media", icon: Share2 },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="w-64 border-r border-primary/10">
      <SidebarContent className="bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ResumeGenPro
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/70 uppercase tracking-wider text-xs px-6">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="mx-3 rounded-lg">
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-all duration-200"
                      activeClassName="bg-gradient-to-r from-primary/20 to-secondary/20 font-semibold border-l-4 border-primary"
                    >
                      <item.icon className="w-5 h-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
