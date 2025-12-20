"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Share2, Heart, ArrowLeft, Play, ThumbsUp, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Skeleton } from "@/components/ui/skeleton"
import { storesService, Store } from "@/lib/services/stores.service"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { authService } from "@/lib/services/auth.service"
import { StarRating } from "@/components/ui/star-rating"
import { StoreMap } from "@/components/store-map"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Category mapping
const categoryMap: Record<number, string> = {
  1: "Electronics",
  2: "Clothing",
  3: "Home & Garden",
  4: "Sports",
  5: "Books",
  6: "Food & Beverage",
  7: "Health & Beauty",
  8: "Automotive",
  9: "Toys & Games",
  10: "Coffee Shop",
}

export default function StoreDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [commentText, setCommentText] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hasUserRated, setHasUserRated] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await authService.getUserProfile(user.uid)
        setCurrentUser({
          uid: user.uid,
          displayName: user.displayName || profile?.fullName,
          photoURL: user.photoURL || profile?.photoURL
        })
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchStore = async () => {
      try {
        if (params.id) {
          const storeData = await storesService.getById(params.id as string)
          setStore(storeData)

          // Check if user has already rated
          if (currentUser && storeData.userRatings) {
            const existingRating = storeData.userRatings.find(r => r.userId === currentUser.uid)
            if (existingRating) {
              setHasUserRated(true)
              setUserRating(existingRating.rating)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch store:", error)
        toast.error("Failed to load store")
      } finally {
        setIsLoading(false)
      }
    }

    if (currentUser || !isLoading) {
      fetchStore()
    }
  }, [params.id, currentUser])

  const handlePostComment = async () => {
    if (!commentText.trim() || !currentUser || !store) {
      toast.error("Please log in to comment")
      return
    }

    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      userName: currentUser.displayName || "User",
      userAvatar: currentUser.photoURL || undefined,
      text: commentText,
      date: new Date().toLocaleDateString(),
      replies: [],
      likes: [],
      likeCount: 0
    }

    const updatedComments = [...(store.comments || []), newComment]

    try {
      await storesService.update(store.id, {
        comments: updatedComments as any
      })
      setStore({ ...store, comments: updatedComments })
      setCommentText("")
      toast.success("Comment posted!")
    } catch (error) {
      console.error("Failed to post comment:", error)
      toast.error("Failed to post comment")
    }
  }

  const handlePostReply = async (commentId: string) => {
    if (!replyText.trim() || !currentUser || !store) {
      toast.error("Please log in to reply")
      return
    }

    const newReply = {
      id: Date.now().toString(),
      userId: currentUser.uid,
      userName: currentUser.displayName || "User",
      userAvatar: currentUser.photoURL || undefined,
      text: replyText,
      date: new Date().toLocaleDateString()
    }

    const updatedComments = store.comments?.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        }
      }
      return comment
    })

    try {
      await storesService.update(store.id, {
        comments: updatedComments as any
      })
      setStore({ ...store, comments: updatedComments })
      setReplyText("")
      setReplyingTo(null)
      toast.success("Reply posted!")
    } catch (error) {
      console.error("Failed to post reply:", error)
      toast.error("Failed to post reply")
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser || !store) {
      toast.error("Please log in to like")
      return
    }

    const updatedComments = store.comments?.map(comment => {
      if (comment.id === commentId) {
        const likes = comment.likes || []
        const hasLiked = likes.includes(currentUser.uid)

        const newLikes = hasLiked
          ? likes.filter(id => id !== currentUser.uid)
          : [...likes, currentUser.uid]

        return {
          ...comment,
          likes: newLikes,
          likeCount: newLikes.length
        }
      }
      return comment
    })

    try {
      await storesService.update(store.id, {
        comments: updatedComments as any
      })
      setStore({ ...store, comments: updatedComments })
    } catch (error) {
      console.error("Failed to like comment:", error)
      toast.error("Failed to like comment")
    }
  }

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedReplies(newExpanded)
  }

  const handleSubmitRating = async () => {
    if (!currentUser || !store || userRating === 0) {
      toast.error("Please select a rating")
      return
    }

    try {
      const userRatings = store.userRatings || []
      const existingIndex = userRatings.findIndex(r => r.userId === currentUser.uid)

      let updatedRatings
      if (existingIndex >= 0) {
        updatedRatings = [...userRatings]
        updatedRatings[existingIndex] = {
          userId: currentUser.uid,
          rating: userRating,
          date: new Date().toISOString()
        }
      } else {
        updatedRatings = [
          ...userRatings,
          {
            userId: currentUser.uid,
            rating: userRating,
            date: new Date().toISOString()
          }
        ]
      }

      const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / updatedRatings.length
      const reviewCount = updatedRatings.length

      await storesService.update(store.id, {
        userRatings: updatedRatings as any,
        rating: Number(averageRating.toFixed(1)),
        reviewCount
      })

      setStore({
        ...store,
        userRatings: updatedRatings,
        rating: Number(averageRating.toFixed(1)),
        reviewCount
      })

      setHasUserRated(true)
      setShowRatingDialog(false)
      toast.success(existingIndex >= 0 ? "Rating updated!" : "Rating submitted!")
    } catch (error) {
      console.error("Failed to submit rating:", error)
      toast.error("Failed to submit rating")
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
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

  if (!store) {
    return (
      <div className="p-8 text-center">
        <Link
          href="/stores"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stores
        </Link>
        <div className="mt-4">Store not found</div>
      </div>
    )
  }

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 w-full bg-muted">
        <img
          src={store.banner_image_url || store.profile_image_url || store.image_url || "/placeholder.svg"}
          alt={store.store_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{store.store_name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              {store.rating && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{store.rating.toFixed(1)}</span>
                  <span className="opacity-80">
                    ({store.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
              {store.store_location && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                  <MapPin className="h-4 w-4" />
                  <span>{store.store_location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">{store.store_description}</p>
            <div className="mt-4 flex gap-2">
              <Badge
                variant="outline"
                className="border-pastel-blue text-blue-700 dark:text-blue-300 bg-pastel-blue/10"
              >
                {categoryMap[Number(store.storeCategoryId)] || "Other"}
              </Badge>
              <Badge variant="outline">Local Favorite</Badge>
            </div>
          </section>

          {/* Gallery */}
          {store.gallery_images && store.gallery_images.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {store.gallery_images.map((image, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={image}
                      alt={`Gallery image ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos */}
          {store.videos && store.videos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.videos.map((video, idx) => (
                  <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-muted relative group">
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                      <Play className="h-12 w-12 text-white opacity-70" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews & Comments */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Reviews & Comments</h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => {
                  if (!currentUser) {
                    toast.error("Please log in to rate")
                    return
                  }
                  setShowRatingDialog(true)
                }}
              >
                <Star className="h-4 w-4" />
                {hasUserRated ? "Update Rating" : "Rate this store"}
              </Button>
            </div>

            {/* Comment Input */}
            {currentUser && (
              <div className="bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border/50 mb-6 flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                  <img
                    src={currentUser?.photoURL || "/placeholder.svg"}
                    alt="Me"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full resize-none border-none focus:ring-0 p-0 text-sm min-h-[60px] placeholder:text-muted-foreground/70 bg-transparent text-foreground"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handlePostComment}
                      className="bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80"
                      disabled={!commentText.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List with Scroll */}
            <div className="max-h-[600px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {store.comments && store.comments.length > 0 ? (
                store.comments.map((comment) => {
                  const hasLiked = comment.likes?.includes(currentUser?.uid)
                  const replyCount = comment.replies?.length || 0
                  const showReplies = expandedReplies.has(comment.id)
                  const visibleReplies = showReplies
                    ? comment.replies
                    : comment.replies?.slice(0, 2)
                  const hiddenRepliesCount = replyCount - 2

                  return (
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
                        <div className="flex gap-4 px-2 text-xs text-muted-foreground font-medium items-center">
                          <button
                            className={cn(
                              "hover:text-primary flex items-center gap-1 transition-colors",
                              hasLiked && "text-primary font-bold"
                            )}
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <ThumbsUp className={cn("h-3 w-3", hasLiked && "fill-current")} />
                            {comment.likeCount || 0 > 0 ? `Like (${comment.likeCount})` : "Like"}
                          </button>
                          <button
                            className="hover:text-primary flex items-center gap-1"
                            onClick={() => setReplyingTo(comment.id)}
                          >
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </button>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment.id && currentUser && (
                          <div className="flex gap-3 mt-3 pl-4">
                            <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 overflow-hidden">
                              <img
                                src={currentUser.photoURL || "/placeholder.svg"}
                                alt="Me"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full resize-none border border-border rounded-lg p-2 text-sm min-h-[60px] bg-background text-foreground"
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyText("")
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handlePostReply(comment.id)}
                                  disabled={!replyText.trim()}
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {visibleReplies && visibleReplies.length > 0 && (
                          <div className="pl-4 space-y-4 mt-4 border-l-2 border-muted">
                            {visibleReplies.map((reply) => (
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

                            {/* Show More/Less Replies Button */}
                            {replyCount > 2 && (
                              <button
                                onClick={() => toggleReplies(comment.id)}
                                className="text-xs font-medium text-primary hover:underline pl-11"
                              >
                                {showReplies
                                  ? "Hide replies"
                                  : `View ${hiddenRepliesCount} more ${hiddenRepliesCount === 1 ? 'reply' : 'replies'}`
                                }
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to share your experience!
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-soft border border-border/50 sticky top-24">
            <h3 className="font-bold mb-4">Location & Hours</h3>

            {/* Leaflet Map */}
            {store.store_location && (
              <StoreMap
                storeName={store.store_name}
                location={store.store_location}
              />
            )}

            {/* Store Info */}
            <div className="space-y-3 text-sm">
              {store.store_location && (
                <div>
                  <p className="text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{store.store_location}</p>
                </div>
              )}

              {store.store_hours && (
                <div>
                  <p className="text-muted-foreground mb-1">Hours</p>
                  <p className="font-medium whitespace-pre-line">{store.store_hours}</p>
                </div>
              )}

              {store.store_phone && (
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{store.store_phone}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-2">
              <Button className="flex-1 bg-pastel-blue text-blue-900 hover:bg-pastel-blue/80 dark:bg-blue-600 dark:text-white">
                <MapPin className="mr-2 h-4 w-4" /> Directions
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500 border-red-500 dark:text-red-400 dark:border-red-400" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {store.store_name}</DialogTitle>
            <DialogDescription>
              {hasUserRated ? "Update your rating" : "How would you rate this store?"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            <StarRating
              rating={userRating}
              onRate={setUserRating}
              size="lg"
            />
            <p className="text-sm text-muted-foreground">
              {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : "Select a rating"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRating} disabled={userRating === 0}>
              {hasUserRated ? "Update Rating" : "Submit Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  )
}
