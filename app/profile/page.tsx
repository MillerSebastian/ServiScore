"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Briefcase, Settings, LogOut, Camera, TrendingUp, Award, Clock, ShoppingBag, Heart, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ChatbaseWidget from "@/components/ChatbaseWidget";
import { authService } from "@/lib/services/auth.service"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming sonner is used, or I'll use console.log/alert if not sure. I'll use simple alert or console for now if toast isn't obvious, but let's check imports. No toast imported. I'll use standard alert or just state for errors.

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const profileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser
        if (currentUser) {
          const idToken = await currentUser.getIdToken()
          const profile = await authService.getProfile(idToken)
          setUser(profile)
        } else {
          // Wait a bit for firebase to init
          const unsubscribe = auth.onAuthStateChanged(async (u) => {
            if (u) {
              const idToken = await u.getIdToken()
              const profile = await authService.getProfile(idToken)
              setUser(profile)
            } else {
              router.push("/login")
            }
            unsubscribe()
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleProfilePictureClick = () => {
    profileInputRef.current?.click()
  }

  const handleBannerClick = () => {
    bannerInputRef.current?.click()
  }

  const handleProfileFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProfile(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        const idToken = await currentUser.getIdToken()
        const updatedUser = await authService.uploadProfilePicture(idToken, file)
        setUser(updatedUser) // Update local state with new profile data

        // Re-fetch profile to ensure we have the latest data
        const refreshedProfile = await authService.getProfile(idToken)
        setUser(refreshedProfile)
      }
    } catch (error) {
      console.error("Failed to upload profile picture", error)
      alert("Failed to upload profile picture")
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBanner(true)
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        const idToken = await currentUser.getIdToken()
        const updatedUser = await authService.uploadBanner(idToken, file)

        // Update state with returned data
        setUser(updatedUser)

        // Re-fetch profile to ensure we have the latest data
        const refreshedProfile = await authService.getProfile(idToken)
        setUser(refreshedProfile)
      }
    } catch (error) {
      console.error("Failed to upload banner", error)
      alert("Failed to upload banner")
    } finally {
      setUploadingBanner(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <div className="px-8">
            <div className="-mt-12 mb-6">
              <Skeleton className="h-24 w-24 rounded-2xl" />
            </div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) return <div>Please log in</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-in slide-in-from-bottom-4 duration-700">
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={profileInputRef}
        onChange={handleProfileFileChange}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={bannerInputRef}
        onChange={handleBannerFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Profile Header */}
      <div className="bg-card text-card-foreground rounded-3xl shadow-soft border border-border/50 overflow-hidden mb-8">
        {/* Banner */}
        <div
          className="h-32 bg-gradient-to-r from-pastel-blue to-pastel-purple relative cursor-pointer group"
          onClick={handleBannerClick}
        >
          {(() => {
            const bannerUrl = user.banner
              ? `${user.banner}${user.banner.includes('?') ? '&' : '?'}t=${Date.now()}`
              : null
            return bannerUrl ? (
              <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full opacity-50"></div>
            )
          })()}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white h-8 w-8" />
          </div>
          {uploadingBanner && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            {/* Profile Picture */}
            <div
              className="h-24 w-24 rounded-2xl border-4 border-card bg-card shadow-sm overflow-hidden relative cursor-pointer group"
              onClick={handleProfilePictureClick}
            >
              <img
                src={user.profilePicture || user.avatar || "/placeholder.svg"}
                alt={user.fullName || user.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white h-6 w-6" />
              </div>
              {uploadingProfile && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled>
                <Settings className="h-4 w-4" /> {t("profile.settings")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-none"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> {t("profile.logout")}
              </Button>
            </div>
          </div>
          <>
            <ChatbaseWidget />
          </>
          <div>
            <h1 className="text-2xl font-bold">{user.fullName || user.name || "User"}</h1>
            <p className="text-muted-foreground mb-4">{user.email}</p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.rating || "4.8"}</p>
                  <p className="text-xs text-muted-foreground">{t("service.rating")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.completedServices || "24"}</p>
                  <p className="text-xs text-muted-foreground">{t("profile.completed")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-600 dark:text-green-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.badges || "8"}</p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.responseTime || "2h"}</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.totalEarnings || "12,450"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.activeOrders || "5"}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.satisfactionRate || "98"}%</div>
            <p className="text-xs text-muted-foreground mt-1">From 124 reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Published Services */}
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.publishedServices")}</CardTitle>
            <CardDescription>Services you're offering to customers</CardDescription>
          </CardHeader>
          <CardContent>
            {user.publishedServices && user.publishedServices.length > 0 ? (
              <div className="space-y-3">
                {user.publishedServices.map((id: any) => (
                  <div key={id} className="p-4 bg-muted/30 rounded-xl flex justify-between items-center hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium text-sm">Service #{id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{t("profile.active")}</Badge>
                        <span className="text-xs text-muted-foreground">24 bookings</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {t("profile.manage")}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">{t("profile.noServices")}</p>
                <Button size="sm" className="mt-4">Create Service</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{t("profile.recentActivity")}</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
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
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white bg-pastel-purple shadow-sm"></div>
                <p className="text-sm font-medium">Updated service pricing</p>
                <p className="text-xs text-muted-foreground">5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="border-none shadow-soft mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Achievements & Badges</CardTitle>
          <CardDescription>Your earned accomplishments and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-3xl mb-2">
                🏆
              </div>
              <p className="text-sm font-medium text-center">Top Seller</p>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-3xl mb-2">
                ⭐
              </div>
              <p className="text-sm font-medium text-center">5-Star Master</p>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-3xl mb-2">
                💎
              </div>
              <p className="text-sm font-medium text-center">Premium User</p>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-3xl mb-2">
                🚀
              </div>
              <p className="text-sm font-medium text-center">Fast Response</p>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
