"use client"

import { useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { type RootState, addComment } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Share2, Heart, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Skeleton } from "@/components/ui/skeleton"
import ChatbaseWidget from "@/components/ChatbaseWidget";
import dynamic from "next/dynamic";

// 👇 Importación dinámica para evitar errores de SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});


export default function StoreDetailPage() {
  const params = useParams()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const store = useSelector((state: RootState) => state.stores.items.find((s) => s.id === params.id))
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const [isLoading, setIsLoading] = useState(true)

  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!store && !isLoading)
    return (
      <div className="p-8 text-center">
        <Link
          href="/stores"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("store.back")}
        </Link>
        <div>{t("store.notFound")}</div>
      </div>
    )

  const handlePostComment = () => {
    if (!commentText.trim() || !currentUser || !store) return

    dispatch(
      addComment({
        storeId: store.id,
        comment: {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          text: commentText,
          date: new Date().toLocaleDateString(),
          replies: [],
        },
      }),
    )
    setCommentText("")
  }

  if (isLoading) {
    return (
      <div className="pb-20 animate-pulse">
        <div className="h-64 md:h-80 w-full bg-muted" />
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-60 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!store) return null

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 w-full bg-muted">
        <img src={store.image || "/placeholder.svg"} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.name}</h1>
            <div className="flex items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{store.rating}</span>
                <span className="opacity-80">
                  ({store.reviewCount} {t("home.reviews")})
                </span>
              </div>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> Downtown Area
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-bold mb-4">{t("store.about")}</h2>
            <p className="text-muted-foreground leading-relaxed">{store.description}</p>
            <div className="mt-4 flex gap-2">
              <Badge
                variant="outline"
                className="border-pastel-blue text-blue-700 dark:text-blue-300 bg-pastel-blue/10"
              >
                {store.category}
              </Badge>
              <Badge variant="outline">Local Favorite</Badge>
            </div>
          </section>

          {/* Photos */}
          {store.photos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">{t("store.photos")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {store.photos.map((photo, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt="Store interior"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{t("store.reviews")}</h2>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Star className="h-4 w-4" /> {t("store.rate")}
              </Button>
            </div>

            {/* Comment Input */}
            <div className="bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border/50 mb-6 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                <img src={currentUser?.avatar || "/placeholder.svg"} alt="Me" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t("store.shareExperience")}
                  className="w-full resize-none border-none focus:ring-0 p-0 text-sm min-h-[60px] placeholder:text-muted-foreground/70 bg-transparent text-foreground"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handlePostComment}
                    className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80"
                  >
                    {t("store.postComment")}
                  </Button>
                </div>
              </div>
            </div>
          <>
          <ChatbaseWidget />
          </>
            {/* Comments List */}
            <div className="space-y-6">
              {store.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                    <img
                      src={comment.userAvatar || "/placeholder.svg"}
                      alt={comment.userName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-card text-card-foreground p-4 rounded-2xl rounded-tl-none shadow-sm border border-border/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm text-foreground/90">{comment.text}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 px-2 text-xs text-muted-foreground font-medium">
                      <button className="hover:text-primary">Like</button>
                      <button className="hover:text-primary">Reply</button>
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-4 space-y-4 mt-4 border-l-2 border-muted">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                              <img
                                src={reply.userAvatar || "/placeholder.svg"}
                                alt={reply.userName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="bg-muted/50 p-3 rounded-2xl rounded-tl-none flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-xs">{reply.userName}</span>
                                <span className="text-[10px] text-muted-foreground">{reply.date}</span>
                              </div>
                              <p className="text-xs">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
  
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-soft border border-border/50 sticky top-24">
            <h3 className="font-bold mb-4">{t("store.locationHours")}</h3>
            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center text-muted-foreground text-sm">
            <Map />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span>9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="flex-1 bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80">
                <MapPin className="mr-2 h-4 w-4" /> {t("store.directions")}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}
