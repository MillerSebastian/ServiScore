"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search } from "lucide-react"
import Link from "next/link"
// import { AddStoreModal } from "@/components/add-store-modal" // TODO: Create this component
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { storesService, Store } from "@/lib/services/stores.service"
import { toast } from "sonner"

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

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupRealtimeListener = () => {
      unsubscribe = storesService.subscribeToStores((storesData) => {
        setStores(storesData)
        setIsLoading(false)
      })
    }

    setupRealtimeListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Filter stores based on search
  const filteredStores = stores.filter(store =>
    store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.store_description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Local Businesses</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
          </div>
          {/* <AddStoreModal /> */}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full overflow-hidden border-none shadow-soft">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-5">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No stores found matching your search" : "No stores available yet"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStores.map((store) => (
            <motion.div key={store.id} variants={item}>
              <Link href={`/stores/${store.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-soft group bg-card">
                  <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                    <img
                      src={store.banner_image_url || store.profile_image_url || store.image_url || "/placeholder.svg"}
                      alt={store.store_name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-xl shadow-black/10 drop-shadow-md">{store.store_name}</h3>
                      {store.rating && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-yellow-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 font-bold text-white">{store.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-white/80 text-sm">({store.store_total_favourites || 0})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-pastel-green/30 text-green-800 hover:bg-pastel-green/50">
                        {categoryMap[Number(store.storeCategoryId)] || "Other"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{store.store_description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
