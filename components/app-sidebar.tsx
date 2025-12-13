"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconHome,
  IconInnerShadowTop,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavGroup } from "@/components/nav-group"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navGroups: [
    {
      title: "Platform",
      items: [
        {
          title: "Home",
          url: "/",
          icon: IconHome,
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "Profile",
          url: "/profile",
          icon: IconUser,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Manage Shops",
          url: "/shops/manage",
          icon: IconSettings,
        },
        {
          title: "Manage Services",
          url: "/services/manage",
          icon: IconSettings,
        },
        {
          title: "Team",
          url: "#",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          title: "Shop Analytics",
          url: "/shop-analytics",
          icon: IconChartBar,
        },
        {
          title: "Shop Metrics",
          url: "/shops/metrics",
          icon: IconChartBar,
        },
        {
          title: "Service Metrics",
          url: "/services/metrics",
          icon: IconChartBar,
        },
        {
          title: "System Logs",
          url: "/logs",
          icon: IconFileDescription,
        },
      ],
    },
    {
      title: "Explore",
      items: [
        {
          title: "Browse Stores",
          url: "/stores",
          icon: IconFolder,
        },
        {
          title: "Browse Services",
          url: "/services",
          icon: IconListDetails,
        },
      ],
    },
    {
      title: "Admin",
      items: [
        {
          title: "Super Profile",
          url: "/super-profile",
          icon: IconInnerShadowTop,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <span className="text-xl font-bold tracking-tight">ServiScore</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[]} />
        {data.navGroups.map((group) => (
          <NavGroup key={group.title} title={group.title} items={group.items} />
        ))}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
