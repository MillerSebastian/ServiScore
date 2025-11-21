"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search } from "lucide-react"
import Link from "next/link"
import { AddStoreModal } from "@/components/add-store-modal"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export default function StoresPage() {
  const stores = useSelector((state: RootState) => state.stores.items)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

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
              className="w-full pl-9 pr-4 py-2 rounded-full border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
            />
          </div>
          <AddStoreModal />
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
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stores.map((store) => (
            <motion.div key={store.id} variants={item}>
              <Link href={`/stores/${store.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-none shadow-soft group bg-card">
                  <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                    <img
                      src={store.image || "/placeholder.svg"}
                      alt={store.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-xl shadow-black/10 drop-shadow-md">{store.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-yellow-400">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 font-bold text-white">{store.rating}</span>
                        </div>
                        <span className="text-white/80 text-sm">({store.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-pastel-green/30 text-green-800 hover:bg-pastel-green/50">
                        {store.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{store.description}</p>
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
