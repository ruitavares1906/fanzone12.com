"use client"

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { ProductsFilter } from "@/components/products-filter"

export function MobileFilters() {
  return (
    <div className="lg:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            data-mobile-filters-trigger
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetTitle className="sr-only">Filtros do Catálogo</SheetTitle>
          <ProductsFilter />
        </SheetContent>
      </Sheet>
      <div className="mt-2 text-xs text-blue-700 text-center font-semibold md:animate-pulse motion-reduce:animate-none">
        Explora clubes, ligas, cores e mais nos filtros!
      </div>
    </div>
  )
} 