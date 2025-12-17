import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ServiceCardSkeleton() {
  return (
    <Card className="h-full shadow-soft border border-transparent">
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
  )
}

export function ServiceCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  )
}
