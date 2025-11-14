"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { SneakersFilter } from "./sneakers-filter"

export function MobileSneakersFilters() {
  return (
    <div className="lg:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="overflow-y-auto">
          <SheetTitle className="sr-only">Filtros de Sneakers</SheetTitle>
          <SneakersFilter />
        </SheetContent>
      </Sheet>
      <div className="mt-2 text-xs text-blue-700 text-center font-semibold md:animate-pulse motion-reduce:animate-none">
        Explora cores, marcas e preços nos filtros!
      </div>
    </div>
  )
} 