"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  IconPlus, 
  IconDotsVertical, 
  IconMail, 
  IconPhone,
  IconCrown,
  IconShield,
  IconUser,
  IconTrash,
  IconEdit,
  IconSend
} from "@tabler/icons-react"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "manager" | "member"
  avatar: string
  phone?: string
  joinedDate: string
  status: "active" | "pending" | "inactive"
}

export default function TeamPage() {
  const { t } = useLanguage()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "owner",
      avatar: "/avatars/01.png",
      phone: "+1 (555) 123-4567",
      joinedDate: "Jan 2024",
      status: "active"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "admin",
      avatar: "/avatars/02.png",
      phone: "+1 (555) 234-5678",
      joinedDate: "Feb 2024",
      status: "active"
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "manager",
      avatar: "/avatars/03.png",
      joinedDate: "Mar 2024",
      status: "active"
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "member",
      avatar: "/avatars/04.png",
      joinedDate: "Apr 2024",
      status: "pending"
    }
  ])

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "member" as TeamMember["role"]
  })

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner": return <IconCrown className="h-4 w-4" />
      case "admin": return <IconShield className="h-4 w-4" />
      case "manager": return <IconUser className="h-4 w-4" />
      default: return <IconUser className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner": return "default"
      case "admin": return "secondary"
      case "manager": return "outline"
      default: return "outline"
    }
  }

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">Pending</Badge>
      case "inactive":
        return <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20">Inactive</Badge>
    }
  }

  const handleInvite = () => {
    if (!inviteForm.email) {
      toast.error("Please enter an email address")
      return
    }

    toast.success(`Invitation sent to ${inviteForm.email}`)
    setInviteOpen(false)
    setInviteForm({ email: "", role: "member" })
  }

  const handleResendInvite = (member: TeamMember) => {
    toast.success(`Invitation resent to ${member.email}`)
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId))
    toast.success("Member removed from team")
  }

  const handleChangeRole = (memberId: string, newRole: TeamMember["role"]) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ))
    toast.success("Role updated successfully")
  }

  const rolePermissions = {
    owner: ["Full access", "Manage billing", "Delete team", "Manage all members"],
    admin: ["Manage members", "Manage shops", "Manage services", "View analytics"],
    manager: ["Manage shops", "Manage services", "View analytics", "Limited member access"],
    member: ["View shops", "View services", "View basic analytics"]
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="overflow-y-auto overflow-x-hidden">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
              <p className="text-muted-foreground">Manage your team members and their permissions</p>
            </div>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as TeamMember["role"] })}
                    >
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleInvite} className="w-full">
                    <IconSend className="mr-2 h-4 w-4" />
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {members.filter(m => m.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {members.filter(m => m.status === "pending").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {members.filter(m => m.role === "admin" || m.role === "owner").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>All members of your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <IconMail className="h-3 w-3" />
                            {member.email}
                          </span>
                          {member.phone && (
                            <span className="flex items-center gap-1">
                              <IconPhone className="h-3 w-3" />
                              {member.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                            {getRoleIcon(member.role)}
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Joined {member.joinedDate}</p>
                        </div>
                        {member.role !== "owner" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <IconEdit className="mr-2 h-4 w-4" />
                                Edit Profile
                              </DropdownMenuItem>
                              {member.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                                  <IconSend className="mr-2 h-4 w-4" />
                                  Resend Invite
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, "admin")}>
                                <IconShield className="mr-2 h-4 w-4" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, "manager")}>
                                <IconUser className="mr-2 h-4 w-4" />
                                Make Manager
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, "member")}>
                                <IconUser className="mr-2 h-4 w-4" />
                                Make Member
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Roles & Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Overview of role capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <div key={role} className="space-y-3">
                    <Badge variant={getRoleBadgeVariant(role as TeamMember["role"])} className="gap-1">
                      {getRoleIcon(role as TeamMember["role"])}
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Badge>
                    <ul className="space-y-2">
                      {permissions.map((permission) => (
                        <li key={permission} className="text-sm flex items-start gap-2">
                          <IconShield className="h-3 w-3 mt-0.5 text-primary" />
                          <span className="text-muted-foreground">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
