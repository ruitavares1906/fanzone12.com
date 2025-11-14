import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

interface StaticProductSectionProps {
  title: string
  products: Product[]
  showAllLink?: string
  className?: string
}

export function StaticProductSection({ 
  title, 
  products, 
  showAllLink,
  className = ""
}: StaticProductSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {showAllLink && (
            <a 
              href={showAllLink}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              href={`/produto/${product.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function StaticProductCarousel({ 
  title, 
  products, 
  showAllLink,
  className = ""
}: StaticProductSectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {showAllLink && (
            <a 
              href={showAllLink}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard 
                  product={product} 
                  href={`/produto/${product.id}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
