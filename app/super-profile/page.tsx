"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShieldCheck, 
  Crown, 
  Zap, 
  Trophy, 
  TrendingUp, 
  Users, 
  Star, 
  Activity,
  Award,
  Settings,
  Bell,
  FileText,
  Store,
  Briefcase
} from "lucide-react"
import { auth } from "@/lib/firebase"
import { authService } from "@/lib/services/auth.service"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuperProfilePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser
        if (currentUser) {
          const idToken = await currentUser.getIdToken()
          const profile = await authService.getProfile(idToken)
          setUser(profile)
        } else {
          const unsubscribe = auth.onAuthStateChanged(async (u) => {
            if (u) {
              const idToken = await u.getIdToken()
              const profile = await authService.getProfile(idToken)
              setUser(profile)
            }
            unsubscribe()
            setLoading(false)
          })
          return // Let auth listener handle loading state
        }
      } catch (error) {
        console.error("Failed to fetch profile", error)
      } finally {
        // If we didn't return early for auth listener
        if (auth.currentUser) {
            setLoading(false)
        }
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
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
        <SidebarInset>
          <SiteHeader />
          <div className="p-8 space-y-8">
             <Skeleton className="h-64 w-full rounded-xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
             </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
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
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-8 space-y-8">
          
          {/* Super Profile Header */}
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border text-card-foreground shadow-soft">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Crown className="w-64 h-64 rotate-12 text-primary" />
            </div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary shadow-lg overflow-hidden bg-muted">
                        <img 
                            src={user?.profilePicture || user?.avatar || "/placeholder.svg"} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full border-4 border-card">
                        <Crown className="w-6 h-6 fill-current" />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-3xl md:text-5xl font-bold">{user?.fullName || user?.name || "Super User"}</h1>
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 border-none text-sm px-3 py-1">PRO</Badge>
                        </div>
                        <p className="text-muted-foreground mt-2 text-lg">Senior Administrator & Shop Manager</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2 border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm">Verified Admin</span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-500/10 rounded-full px-4 py-2 border border-yellow-500/20">
                            <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm">4.9/5.0 Rating</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2 border border-blue-500/20">
                            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm">Online Now</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                    <Button variant="outline" className="border-border hover:bg-accent">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </Button>
                    <Link href="/super-profile/logs">
                        <Button 
                            variant="outline" 
                            className="border-border hover:bg-accent"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View Logs
                        </Button>
                    </Link>
                </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-pastel-blue/30 border-border shadow-soft hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Number of Shops</CardTitle>
                    <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Active stores managed
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-pastel-purple/30 border-border shadow-soft hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Number of Services</CardTitle>
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">38</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total services offered
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-pastel-yellow/30 border-border shadow-soft hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
                    <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-current" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold flex items-center gap-2">
                        4.9<span className="text-lg text-muted-foreground">/5.0</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        From 2,450 reviews
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-pastel-green/30 border-border shadow-soft hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">$128K</div>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +24.5% this month
                    </p>
                </CardContent>
            </Card>
            <Card className="bg-pastel-pink/30 border-border shadow-soft hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
                    <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">48</div>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +3 new this week
                    </p>
                </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                <TabsTrigger 
                    value="overview" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                    Overview
                </TabsTrigger>
                <TabsTrigger 
                    value="achievements" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                    Achievements
                </TabsTrigger>
                <TabsTrigger 
                    value="activity" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                    Activity Log
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Bio Section */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>Professional bio and description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            Senior Administrator with over 5 years of experience managing multiple shops and services across various platforms. 
                            Specialized in business optimization, team leadership, and customer satisfaction. Proven track record of increasing 
                            revenue by 120% year-over-year while maintaining exceptional service quality and team morale. Passionate about 
                            leveraging technology to streamline operations and deliver outstanding customer experiences.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="secondary">Business Management</Badge>
                            <Badge variant="secondary">Team Leadership</Badge>
                            <Badge variant="secondary">Customer Service</Badge>
                            <Badge variant="secondary">Analytics</Badge>
                            <Badge variant="secondary">Strategy</Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Level Progress</CardTitle>
                            <CardDescription>Experience points towards next level</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Level 42</span>
                                <span>Level 43</span>
                            </div>
                            <Progress value={78} className="h-4 bg-muted" />
                            <p className="text-xs text-muted-foreground text-center">2,450 XP remaining until level up</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Badges</CardTitle>
                            <CardDescription>Latest earned achievements</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-3xl">🏆</div>
                                <span className="text-xs font-medium">Champion</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">💎</div>
                                <span className="text-xs font-medium">Diamond</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">🚀</div>
                                <span className="text-xs font-medium">Early Bird</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="achievements">
                <Card>
                    <CardHeader>
                        <CardTitle>All Achievements</CardTitle>
                        <CardDescription>Collection of all unlocked milestones</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Placeholders for achievements */}
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="flex flex-col items-center p-4 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-sm">Achievement {i}</h3>
                                    <p className="text-xs text-muted-foreground text-center mt-1">Unlocked on Dec {i}, 2024</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
