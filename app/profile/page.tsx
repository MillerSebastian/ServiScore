"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Briefcase, Settings, LogOut, Camera, BadgeCheck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { authService } from "@/lib/services/auth.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import SuperUserVerificationModal from "@/components/SuperUserVerificationModal"
import { SettingsSheet } from "@/components/settings-sheet"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function ProfilePage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [superOpen, setSuperOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const profileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extended profile from Firestore
        const profileData = await authService.getUserProfile(firebaseUser.uid);

        setUser({
          fullName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoUrl: firebaseUser.photoURL,
          // Merge Firestore data (rating, banner, etc) or partial overrides
          ...profileData,
          // Defaults if missing in Firestore (should ideally be set on creation, but safety check)
          rating: profileData?.rating ?? 5.0,
          completedServices: profileData?.completedServices ?? 0,
          publishedServices: profileData?.publishedServices ?? [],
          banner: profileData?.banner ?? null
        })
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    })
    return () => unsubscribe()
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
      setUser((prev: any) => ({ ...prev, photoUrl: photoURL }))
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
      setUser((prev: any) => ({ ...prev, banner: bannerUrl }))
      toast.success('Banner updated')
    } catch (error) {
      console.error('Failed to upload banner:', error)
      toast.error('Failed to upload banner')
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
      <SuperUserVerificationModal
        open={superOpen}
        onOpenChange={setSuperOpen}
        onFinished={async () => {
          // Refresh user profile from Firestore to get updated isVerified status
          if (auth.currentUser) {
            const updatedProfile = await authService.getUserProfile(auth.currentUser.uid)
            setUser((prev: any) => ({ ...prev, ...updatedProfile }))
          }
          setSuperOpen(false)
          toast.success("¡Verificación completada!", { description: "Ahora tienes acceso a todas las funciones" })
        }}
        currentEmail={user?.email}
      />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
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

        <div className="px-4 sm:px-8 pb-8">
          <div className="relative flex flex-col sm:flex-row justify-between items-center sm:items-end -mt-12 mb-6 gap-4">
            {/* Profile Picture */}
            <div
              className="h-24 w-24 rounded-2xl border-4 border-card bg-card shadow-sm overflow-hidden relative cursor-pointer group"
              onClick={handleProfilePictureClick}
            >
              <img
                src={user.photoUrl || user.profilePicture || user.avatar || "/placeholder.svg"}
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

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mb-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto" onClick={() => setSettingsOpen(true)}>
                <Settings className="h-4 w-4" /> <span className="hidden sm:inline">{t("profile.settings")}</span><span className="sm:hidden">Ajustes</span>
              </Button>
              {!user.isVerified && (
                <Button
                  size="sm"
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => setSuperOpen(true)}
                >
                  <BadgeCheck className="h-4 w-4" /> <span className="hidden md:inline">Convertirme en Super Usuario</span><span className="md:hidden">Super Usuario</span>
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border-none w-full sm:w-auto"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> {t("profile.logout")}
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {user.fullName || user.name || "User"}
              {user.isVerified && (
                <span title="Super Usuario Verificado">
                  <BadgeCheck className="h-5 w-5 text-blue-600" />
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mb-4">{user.email}</p>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-pastel-yellow/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.rating || "0.0"}</p>
                  <p className="text-xs text-muted-foreground">{t("service.rating")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">{user.completedServices || "0"}</p>
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
            {user.publishedServices && user.publishedServices.length > 0 ? (
              <div className="space-y-4">
                {user.publishedServices.map((id: any) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

