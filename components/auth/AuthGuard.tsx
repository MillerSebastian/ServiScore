"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter, usePathname } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

const PUBLIC_ROUTES = [
    "/login",
    "/adminAuth",
    "/landing",
    "/about",
    "/contact"
]

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('[AuthGuard] User state changed:', user ? 'Logged In' : 'Logged Out', user?.uid)

            if (user) {
                setAuthenticated(true)
                setLoading(false)
            } else {
                setAuthenticated(false)
                setLoading(false)

                const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
                if (!isPublicRoute) {
                    router.push("/login")
                }
            }
        })

        return () => unsubscribe()
    }, [pathname, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="space-y-4 w-full max-w-md px-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
    if (!authenticated && !isPublicRoute) {
        return null // or a loader
    }

    return <>{children}</>
}
