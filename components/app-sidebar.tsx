import { Activity, FolderGit, TrendingUpDown } from "lucide-react";

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
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <h2 className="text-4xl font-semibold">
              Pulse<span className="font-extralight">Ops</span>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
