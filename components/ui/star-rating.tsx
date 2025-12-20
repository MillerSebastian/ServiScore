"use client"

import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    onRate?: (rating: number) => void
    readonly?: boolean
    size?: "sm" | "md" | "lg"
    showCount?: boolean
    count?: number
}

export function StarRating({
    rating,
    onRate,
    readonly = false,
    size = "md",
    showCount = false,
    count = 0
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0)

    const sizes = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    }

    const displayRating = hoverRating || rating

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onRate?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={cn(
                        "transition-all",
                        !readonly && "hover:scale-110 cursor-pointer",
                        readonly && "cursor-default"
                    )}
                >
                    <Star
                        className={cn(
                            sizes[size],
                            star <= displayRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                        )}
                    />
                </button>
            ))}
            {showCount && count > 0 && (
                <span className="text-sm text-muted-foreground ml-1">
                    ({count})
                </span>
            )}
        </div>
    )
}
