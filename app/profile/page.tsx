"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Briefcase, Settings, LogOut } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user)
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!user) return <div>Please log in</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <div className="bg-card text-card-foreground rounded-3xl shadow-soft border border-border/50 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-pastel-blue to-pastel-purple opacity-50"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-2xl border-4 border-card bg-card shadow-sm overflow-hidden">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" /> {t("profile.settings")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-none"
              >
                <LogOut className="h-4 w-4" /> {t("profile.logout")}
              </Button>
            </div>
          </div>

          <div>
            {isLoading ? (
              <div className="space-y-2 mb-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground mb-4">{user.phone}</p>
              </>
            )}

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.rating}</p>
                  <p className="text-xs text-muted-foreground">{t("service.rating")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.completedServices}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.completed")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Published Services */}
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.publishedServices")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : user.publishedServices.length > 0 ? (
              <div className="space-y-4">
                {user.publishedServices.map((id) => (
                  <div key={id} className="p-4 bg-muted/30 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">Service #{id}</p>
                      <p className="text-xs text-muted-foreground">{t("profile.active")}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      {t("profile.manage")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("profile.noServices")}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white bg-pastel-blue shadow-sm"></div>
                  <p className="text-sm font-medium">Applied to "Dog Walking"</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white bg-pastel-green shadow-sm"></div>
                  <p className="text-sm font-medium">Reviewed "Sweet Delights Bakery"</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white bg-pastel-pink shadow-sm"></div>
                  <p className="text-sm font-medium">Completed profile setup</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
