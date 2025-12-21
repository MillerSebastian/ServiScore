"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Briefcase, Settings, LogOut, Camera, BadgeCheck, Edit2, User, Trophy, Activity } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import SuperUserVerificationModal from "@/components/SuperUserVerificationModal"
import { SettingsSheet } from "@/components/settings-sheet"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [superOpen, setSuperOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ displayName: "", aboutMe: "" })
  const [isSaving, setIsSaving] = useState(false)

  // Completion & Activity
  const [completionPercent, setCompletionPercent] = useState(0)
  const [activities, setActivities] = useState<any[]>([])

  const profileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extended profile from Firestore
        const profileData = await authService.getUserProfile(firebaseUser.uid);

        const userData = {
          uid: firebaseUser.uid,
          fullName: profileData?.fullName || firebaseUser.displayName || "User",
          email: firebaseUser.email,
          photoUrl: profileData?.photoURL || firebaseUser.photoURL,
          // Merge Firestore data
          ...profileData,
          rating: profileData?.rating ?? 5.0,
          completedServices: profileData?.completedServices ?? 0,
          publishedServices: profileData?.publishedServices ?? [],
          banner: profileData?.banner ?? null,
          aboutMe: profileData?.aboutMe || "",
          isVerified: profileData?.isVerified || false
        }

        setUser(userData)
        setEditForm({
          displayName: userData.fullName,
          aboutMe: userData.aboutMe
        })

        // Calculate Completion
        calculateCompletion(userData)

        // Fetch Activity
        fetchUserActivity(firebaseUser.uid)

      } else {
        router.push("/login")
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  const calculateCompletion = (userData: any) => {
    let score = 0
    let total = 5 // Photo, Banner, Name, About Me, Verification

    if (userData.photoUrl) score++
    if (userData.banner) score++
    if (userData.fullName && userData.fullName !== "User") score++
    if (userData.aboutMe && userData.aboutMe.length > 10) score++
    if (userData.isVerified) score++

    setCompletionPercent(Math.round((score / total) * 100))
  }

  const fetchUserActivity = async (uid: string) => {
    try {
      // Fetch latest logs from store_logs and service_logs
      // Since we don't have a unified 'user_activity' collection, we'll fetch a few from each
      // and merge them.

      const logs = []

      // 1. Service Logs (e.g. Views, Interactions)
      // Actually, 'service_logs' logs actions ON a service. We want actions BY the user.
      // But maybe we tracked 'userId' in the logs? 
      // Let's check 'store_logs' first, it has 'userId'.

      const storeLogsRef = collection(db, "store_logs")
      const qStore = query(storeLogsRef, where("userId", "==", uid), orderBy("timestamp", "desc"), limit(5))
      const storeSnap = await getDocs(qStore)

      storeSnap.forEach(doc => {
        const data = doc.data()
        logs.push({
          id: doc.id,
          title: `${getActionVerb(data.action)} "${data.storeName || 'Store'}"`,
          date: data.timestamp,
          type: 'store'
        })
      })

      // If we implemented 'service_logs' with userId, fetch those too.
      // Assuming we did/will.
      const serviceLogsRef = collection(db, "service_logs")
      // Check if service_logs has userId field. ServicesService logs additionalData...
      // but standard logs might not have 'userId' indexed or present if not explicitly added.
      // For now, let's stick to store logs + system logs if available.

      // Sort merged logs
      logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setActivities(logs.slice(0, 5))

    } catch (e) {
      console.error("Failed to fetch activity", e)
    }
  }

  const getActionVerb = (action: string) => {
    switch (action) {
      case 'View': return 'Viewed'
      case 'Favorite': return 'Favorited'
      case 'Review': return 'Reviewed'
      case 'Comment': return 'Commented'
      default: return 'Interacted with'
    }
  }

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
    if (!file || !user) return

    try {
      setUploadingProfile(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'profiles')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      const photoURL = data.secure_url

      // Update Firestore
      await authService.updateUserProfile(auth.currentUser?.uid!, { photoURL })

      // Update local state
      const updatedUser = { ...user, photoUrl: photoURL }
      setUser(updatedUser)
      calculateCompletion(updatedUser)

      toast.success('Profile picture updated')
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
      toast.error('Failed to upload profile picture')
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setUploadingBanner(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'banners')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      const bannerUrl = data.secure_url

      // Update Firestore
      await authService.updateUserProfile(auth.currentUser?.uid!, { banner: bannerUrl })

      // Update local state
      const updatedUser = { ...user, banner: bannerUrl }
      setUser(updatedUser)
      calculateCompletion(updatedUser)

      toast.success('Banner updated')

      // Force reload profile data to ensure persistent sync if needed
      // But local state update should be enough for UX
    } catch (error) {
      console.error('Failed to upload banner:', error)
      toast.error('Failed to upload banner')
    } finally {
      setUploadingBanner(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      setIsSaving(true)
      await authService.updateUserProfile(user.uid, {
        fullName: editForm.displayName,
        aboutMe: editForm.aboutMe
      })

      const updatedUser = { ...user, fullName: editForm.displayName, aboutMe: editForm.aboutMe }
      setUser(updatedUser)
      calculateCompletion(updatedUser)

      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Failed to update profile", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-3xl" /> {/* Taller banner skeleton */}
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
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in slide-in-from-bottom-4 duration-700">
      <SuperUserVerificationModal
        open={superOpen}
        onOpenChange={setSuperOpen}
        onFinished={async () => {
          // Refresh user profile from Firestore to get updated isVerified status
          if (auth.currentUser) {
            const updatedProfile = await authService.getUserProfile(auth.currentUser.uid)
            setUser((prev: any) => ({ ...prev, ...updatedProfile }))
            calculateCompletion({ ...user, ...updatedProfile })
          }
          setSuperOpen(false)
          toast.success("¡Verificación completada!", { description: "Ahora tienes acceso a todas las funciones" })
        }}
        currentEmail={user?.email}
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={editForm.displayName}
                onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="resize-none min-h-[100px]"
                value={editForm.aboutMe}
                onChange={(e) => setEditForm({ ...editForm, aboutMe: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Profile Card */}
          <div className="bg-card text-card-foreground rounded-3xl shadow-soft border border-border/50 overflow-hidden relative">
            {/* Banner */}
            <div
              className="h-48 bg-gradient-to-r from-pastel-blue to-pastel-purple relative cursor-pointer group"
              onClick={handleBannerClick}
            >
              {user.banner ? (
                <img src={user.banner} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <Camera className="h-12 w-12 text-white/50" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  Change Banner
                </span>
              </div>
              {uploadingBanner && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              <div className="flex justify-between items-end -mt-12 mb-4">
                {/* Avatar */}
                <div
                  className="h-28 w-28 rounded-3xl border-[6px] border-card bg-card shadow-lg overflow-hidden relative cursor-pointer group"
                  onClick={handleProfilePictureClick}
                >
                  <img
                    src={user.photoUrl || "/placeholder.svg"}
                    alt={user.fullName}
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

                {/* Desktop Buttons */}
                <div className="hidden sm:flex gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* User Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  {user.isVerified && <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />}
                </div>
                <p className="text-muted-foreground mb-4">{user.email}</p>

                {user.aboutMe ? (
                  <p className="text-sm border-l-2 border-primary/20 pl-4 mb-6 italic text-muted-foreground/80">
                    {user.aboutMe}
                  </p>
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-muted-foreground/50 italic mb-6 cursor-pointer hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary/20 pl-4"
                  >
                    Add a bio to tell people about yourself...
                  </div>
                )}

                <div className="flex gap-6 pt-4 border-t border-border/50">
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {user.rating || "5.0"} <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-2xl font-bold flex items-center gap-1">
                      {user.completedServices || "0"} <Briefcase className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Services</div>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className="flex sm:hidden gap-2 mt-6">
                  <Button className="flex-1" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <Card className="border-none shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" /> Profile Strength
                </CardTitle>
                <span className="text-sm font-bold text-muted-foreground">{completionPercent}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercent} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {completionPercent < 100
                  ? "Complete your profile to build trust and get more clients."
                  : "Excellent! Your profile is fully optimized."}
              </p>
            </CardContent>
          </Card>

          {/* Published Services (Placeholder for now, relying on real data eventually) */}
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Services</CardTitle>
            </CardHeader>
            <CardContent>
              {user.publishedServices && user.publishedServices.length > 0 ? (
                <div className="space-y-4">
                  {user.publishedServices.map((id: any) => (
                    <div key={id} className="p-4 bg-muted/30 rounded-xl flex justify-between items-center group hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">Service ID: {id}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm mb-4">You haven't published any services yet.</p>
                  <Button variant="outline" onClick={() => router.push('/services/manage')}>
                    Create Service
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* Verification Card */}
          {!user.isVerified && (
            <Card className="border-none shadow-soft bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <CardContent className="p-6 relative z-10">
                <BadgeCheck className="h-10 w-10 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Get Verified</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Verified users get 3x more visibility and trust from clients.
                </p>
                <Button
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg"
                  onClick={() => setSuperOpen(true)}
                >
                  Verify Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 pl-2">
                {activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <div key={activity.id || i} className="relative pl-6 border-l border-border/50 last:border-0 pb-1">
                      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background"></div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{getTimeAgo(activity.date)}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No recent activity found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>

        </div>
      </div>
    </div>
  )
}

