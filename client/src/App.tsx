import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { LoginDialog } from "@/components/login-dialog";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to SmartPlan</h1>
          <p className="text-muted-foreground">Please login to continue</p>
          <LoginDialog />
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-4 p-2 border-b sticky top-0 bg-background z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{user.username}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Router />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="smartplan-theme">
        <TooltipProvider>
          <AuthProvider>
            <AppContent />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
