import { Skeleton } from "@/components/ui/skeleton"

export function ProductsSkeleton() {
  return (
    <div className="product-grid">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-full mb-4" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
