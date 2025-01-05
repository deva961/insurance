"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Grid2X2,
  Inbox,
  Search,
  Users,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Grid2X2,
  },
  {
    title: "Channels",
    url: "/category",
    icon: Inbox,
    role: [Role.ADMIN],
  },
  {
    title: "Locations",
    url: "/showrooms",
    icon: Warehouse,
    role: [Role.ADMIN],
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    role: [Role.ADMIN, Role.MANAGER],
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Records",
    url: "/records",
    icon: Search,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const role = session?.user.role;

  if (!session || !session.user) {
    return <>Loading....</>;
  }

  // Filter sidebar items based on user role
  const filteredItems = items.filter((item) => {
    // If no role is specified for the route, allow access
    if (!item.role) {
      return true;
    }
    // Check if the user's role matches any of the required roles for this route
    return item.role.includes(role);
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="mx-auto">
          <Image src={"/logo.png"} alt="Logo" width={100} height={100} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="p-5" tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
