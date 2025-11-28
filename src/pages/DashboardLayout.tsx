import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!session) return null;

  return (
    <>
      {/* Mobile Layout with Sheet */}
      <div className="md:hidden min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <header className="h-16 border-b border-primary/10 bg-background/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-0">
              <AppSidebar />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Desktop Layout with Sidebar */}
      <SidebarProvider defaultOpen={true}>
        <div className="hidden md:flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b border-primary/10 bg-background/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
              <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
            </header>

            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
