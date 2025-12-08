"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostServiceModal } from "@/components/post-service-modal"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import ChatbaseWidget from "@/components/ChatbaseWidget";

export default function ServicesPage() {
  const services = useSelector((state: RootState) => state.services.items)
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
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Services</h1>
          <p className="text-muted-foreground">Find help or offer your skills to neighbors.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <PostServiceModal />
        </div>
      </div>
      <>
        <ChatbaseWidget />
      </>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-full shadow-soft border border-transparent">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-6 w-16 mb-1" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={item}>
              <Link href={`/services/${service.id}`}>
                <Card className="h-full hover:border-pastel-blue/50 transition-all duration-200 shadow-soft border border-transparent bg-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted border-2 border-white shadow-sm">
                          <img
                            src={service.creatorAvatar || "/placeholder.svg"}
                            alt={service.creatorName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{service.creatorName}</p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] mt-1 bg-muted text-muted-foreground hover:bg-muted"
                          >
                            {service.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-pastel-blue-dark text-blue-600 dark:text-blue-400">
                          ${service.price}
                        </span>
                        <span className="text-xs text-muted-foreground">Fixed Price</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{service.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {service.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {service.date}
                        </span>
                      </div>
                      <Badge
                        variant={service.status === "Open" ? "default" : "secondary"}
                        className={
                          service.status === "Open"
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
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
