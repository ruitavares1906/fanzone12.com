"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export function MobileFiltersTrigger() {
  const openFilters = () => {
    console.log("Botão clicado! Procurando pelo botão dos filtros...")
    
    // Trigger the mobile filters to open
    const mobileFiltersButton = document.querySelector('[data-mobile-filters-trigger]') as HTMLElement
    console.log("Botão encontrado:", mobileFiltersButton)
    
    if (mobileFiltersButton) {
      console.log("Clicando no botão dos filtros...")
      mobileFiltersButton.click()
    } else {
      console.log("Botão dos filtros não encontrado!")
    }
  }

  return (
    <Button 
      onClick={openFilters}
      className="modern-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-2 text-sm font-medium"
    >
      <Filter className="w-4 h-4 mr-2" />
      Ver todos os clubes e filtros
    </Button>
  )
}
