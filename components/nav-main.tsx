"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { IconCirclePlusFilled, IconMail, IconShoppingBag, IconTool, IconBell, IconCheck, type Icon } from "@tabler/icons-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/contexts/language-context"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [notifications] = useState([
    {
      id: 1,
      title: "New order received",
      titleEs: "Nuevo pedido recibido",
      description: "Order #1234 from customer",
      descriptionEs: "Pedido #1234 de cliente",
      time: "5 min ago",
      timeEs: "Hace 5 min",
      unread: true,
    },
    {
      id: 2,
      title: "Service completed",
      titleEs: "Servicio completado",
      description: "House cleaning service finished",
      descriptionEs: "Servicio de limpieza finalizado",
      time: "2 hours ago",
      timeEs: "Hace 2 horas",
      unread: true,
    },
    {
      id: 3,
      title: "New review posted",
      titleEs: "Nueva reseña publicada",
      description: "5 stars for your store",
      descriptionEs: "5 estrellas para tu tienda",
      time: "1 day ago",
      timeEs: "Hace 1 día",
      unread: false,
    },
  ])
  const unreadCount = notifications.filter(n => n.unread).length
  const isEs = t("nav.home") === "Inicio"

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => router.push('/shops/manage')}>
                  <IconShoppingBag className="mr-2" />
                  {t("dashboard.newStore")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/services/manage')}>
                  <IconTool className="mr-2" />
                  {t("dashboard.newService")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0 relative"
                  variant="outline"
                >
                  <IconBell />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-2 border-b">
                  <span className="text-sm font-semibold">
                    {isEs ? "Notificaciones" : "Notifications"}
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} {isEs ? "nuevas" : "new"}
                    </Badge>
                  )}
                </div>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium flex items-center gap-2">
                          {isEs ? notification.titleEs : notification.title}
                          {notification.unread && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {isEs ? notification.descriptionEs : notification.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isEs ? notification.timeEs : notification.time}
                    </span>
                  </DropdownMenuItem>
                ))}
                <div className="border-t p-2">
                  <button className="w-full text-center text-sm text-primary hover:underline">
                    {isEs ? "Ver todas las notificaciones" : "View all notifications"}
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild 
                isActive={pathname === item.url}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
