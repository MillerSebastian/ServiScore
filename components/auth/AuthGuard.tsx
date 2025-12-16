"use client"

import { useEffect, useState } from "react"
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
        // Check for backend token in localStorage
        const backendToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null
        
        console.log('[AuthGuard] Backend token:', backendToken ? 'exists' : 'null', '| User ID:', userId)
        
        // User is authenticated if backend token exists
        if (backendToken && userId) {
            setAuthenticated(true)
            setLoading(false)
        } else {
            setAuthenticated(false)
            setLoading(false)

            // Check if current route is public
            const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))

            if (!isPublicRoute) {
                router.push("/login")
            }
        }
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

    // If not authenticated and on a protected route, we return null (or loading) while redirecting
    // But since we handle redirect in useEffect, we might render children briefly if we don't block here.
    // However, the useEffect runs after render. 
    // If loading is false and not authenticated, and it's NOT a public route, we should probably render nothing or a loader until redirect happens.

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route))
    if (!authenticated && !isPublicRoute) {
        return null // or a loader
    }

    return <>{children}</>
}
