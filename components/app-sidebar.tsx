"use client";

import { Activity, FolderGit, TrendingUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Metrics",
    url: "/metrics",
    icon: Activity,
  },
  {
    title: "Repos",
    url: "/repos",
    icon: FolderGit,
  },
  {
    title: "Trends",
    url: "/trends",
    icon: TrendingUpDown,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <h2 className="text-4xl font-semibold text-violet-200">
              Pulse<span className="font-extralight text-primary">Ops</span>
            </h2>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarTrigger className="float-end cursor-pointer" />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  disabled={!user}
                  className="cursor-pointer"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
