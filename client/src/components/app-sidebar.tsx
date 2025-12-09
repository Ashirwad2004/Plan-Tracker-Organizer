import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  User,
  BarChart3,
} from "lucide-react";
import { categoryConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Today", url: "/?filter=today", icon: CalendarDays },
  { title: "This Week", url: "/?filter=week", icon: CalendarRange },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const categoryIcons = {
  work: Briefcase,
  study: GraduationCap,
  health: Heart,
  finance: Wallet,
  personal: User,
};

export function AppSidebar() {
  const [location] = useLocation();

  const isActive = (url: string) => {
    if (url === "/") return location === "/" && !location.includes("filter=");
    return location.includes(url.replace("/", ""));
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-2 px-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">SmartPlan</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(categoryConfig).map(([key, config]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons];
                const url = `/?category=${key}`;
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.includes(`category=${key}`)}
                      data-testid={`nav-category-${key}`}
                    >
                      <Link href={url}>
                        <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
                        <span>{config.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          SmartPlan v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
