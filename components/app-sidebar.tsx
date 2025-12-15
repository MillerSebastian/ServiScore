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
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

import { NavGroup } from "@/components/nav-group"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"
import { SettingsSheet } from "@/components/settings-sheet"
import { HelpDialog } from "@/components/help-dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useLanguage()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [helpOpen, setHelpOpen] = React.useState(false)
  
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navGroups: [
      {
        title: t("sidebar.platform"),
        items: [
          {
            title: t("sidebar.home"),
            url: "/",
            icon: IconHome,
          },
          {
            title: t("sidebar.dashboard"),
            url: "/dashboard",
            icon: IconDashboard,
          },
          {
            title: t("sidebar.profile"),
            url: "/profile",
            icon: IconUser,
          },
        ],
      },
      {
        title: t("sidebar.management"),
        items: [
          {
            title: t("sidebar.manageShops"),
            url: "/shops/manage",
            icon: IconSettings,
          },
          {
            title: t("sidebar.manageServices"),
            url: "/services/manage",
            icon: IconSettings,
          },
          {
            title: t("sidebar.team"),
            url: "/team",
            icon: IconUsers,
          },
        ],
      },
      {
        title: t("sidebar.analytics"),
        items: [
          {
            title: t("sidebar.shopAnalytics"),
            url: "/shop-analytics",
            icon: IconChartBar,
          },
          {
            title: t("sidebar.shopMetrics"),
            url: "/shops/metrics",
            icon: IconChartBar,
          },
          {
            title: t("sidebar.serviceMetrics"),
            url: "/services/metrics",
            icon: IconChartBar,
          },
          {
            title: t("sidebar.systemLogs"),
            url: "/logs",
            icon: IconFileDescription,
          },
        ],
      },
      {
        title: t("sidebar.explore"),
        items: [
          {
            title: t("sidebar.browseStores"),
            url: "/stores",
            icon: IconFolder,
          },
          {
            title: t("sidebar.browseServices"),
            url: "/services",
            icon: IconListDetails,
          },
        ],
      },
      {
        title: t("sidebar.admin"),
        items: [
          {
            title: t("sidebar.superProfile"),
            url: "/super-profile",
            icon: IconInnerShadowTop,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: t("sidebar.settings"),
        icon: IconSettings,
        onClick: () => setSettingsOpen(true),
      },
      {
        title: t("sidebar.getHelp"),
        icon: IconHelp,
        onClick: () => setHelpOpen(true),
      },
      {
        title: t("sidebar.search"),
        icon: IconSearch,
        onClick: () => setSearchOpen(true),
      },
    ],
  }
  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link href="/">
                  <span className="text-xl font-bold tracking-tight">ServiScore</span>
                </Link>
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
      
      {/* Dialogs and Sheets */}
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  )
}
