"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface SearchBoxProps {
  size?: "normal" | "large"
  placeholder?: string
  className?: string
}

export function SearchBox({ 
  size = "normal", 
  placeholder = "Search products...",
  className = ""
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Set that component is mounted on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close suggestions when clicking outside (client only)
  useEffect(() => {
    // Check if on client
    if (typeof window === 'undefined') return

    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search suggestions in real time (client only)
  useEffect(() => {
    // Check if on client
    if (typeof window === 'undefined') return

    const searchProducts = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      setIsOpen(true) // Open dropdown while loading
      try {
        const url = `/api/catalogo?pesquisa=${encodeURIComponent(searchTerm.trim())}`
        const response = await fetch(url)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error(`API Error ${response.status}:`, errorData)
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const produtos = await response.json()
        
        // Verify if response is a valid array
        if (!Array.isArray(produtos)) {
          console.error("API response is not an array:", produtos)
          setSuggestions([])
          setIsOpen(true) // Keep open to show error message
          return
        }
        
        // Filter valid products (with name and id)
        const produtosValidos = produtos.filter(p => p && p.id && p.nome)
        
        setSuggestions(produtosValidos.slice(0, 6)) // Show only 6 suggestions
        setIsOpen(true) // Ensure it's open
      } catch (error) {
        console.error("Error searching products:", error)
        setSuggestions([])
        setIsOpen(true) // Keep open to show error message
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/catalogo?pesquisa=${encodeURIComponent(searchTerm.trim())}`)
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  const handleSuggestionClick = (productId: string) => {
    router.push(`/produto/${productId}`)
    setIsOpen(false)
    setSearchTerm("")
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSuggestions([])
    setIsOpen(false)
  }

  const isLarge = size === "large"

  return (
    <div 
      ref={searchRef} 
      className={`relative w-full z-[100] ${className.includes('max-w-2xl') ? 'max-w-2xl mx-auto' : ''} ${className}`}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className={`relative ${isLarge ? "mb-2" : ""}`}>
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 ${isLarge ? "h-6 w-6" : "h-5 w-5"}`} />
          <Input
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0 || searchTerm.trim().length >= 2) {
                setIsOpen(true)
              }
            }}
            className={`pl-12 pr-12 outline-none ring-0 focus:ring-0 focus:outline-none transition-all duration-200 text-black bg-white rounded-none ${isLarge ? "h-14 text-lg" : "h-12"}`}
            autoComplete="off"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isLarge ? "h-8 w-8" : "h-6 w-6"} p-0`}
            >
              <X className={isLarge ? "h-4 w-4" : "h-3 w-3"} />
            </Button>
          )}
        </div>
        
        {isLarge && (
          <p className="text-center text-sm text-gray-600 mt-2">
            Type to see instant suggestions or press Enter to search
          </p>
        )}
      </form>

      {/* Suggestions */}
      {isMounted && isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl z-[9999] max-h-80 overflow-y-auto border border-gray-200 rounded-md">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-gray-600">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="p-3 border-b bg-gray-50">
                <p className="text-sm font-medium text-black">
                  {suggestions.length} product{suggestions.length !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="py-2">
                {suggestions.map((produto) => (
                  <div
                    key={produto.id}
                    onClick={() => handleSuggestionClick(produto.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={produto.imagem || "/placeholder.svg"}
                        alt={produto.nome || "Product"}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate text-black">{produto.nome || "No name"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900">{produto.preco.toFixed(2)}€</span>
                        {produto.precoAntigo && (
                          <span className="text-xs text-gray-400 line-through">
                            {produto.precoAntigo.toFixed(2)}€
                          </span>
                        )}
                        <Badge variant="secondary" className="bg-green-700 text-white text-xs shadow-lg">
                          In Stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t bg-gray-50">
                <Button 
                  onClick={handleSearch}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  View all results for "{searchTerm}"
                </Button>
              </div>
            </>
          ) : searchTerm.trim().length >= 2 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-3">No products found for "{searchTerm}"</p>
              <div className="space-y-1 text-sm text-gray-500">
                <p>• Check spelling</p>
                <p>• Use more general terms</p>
                <p>• Try searching by club or league</p>
              </div>
              <Button 
                onClick={() => router.push('/catalogo')}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                View all products
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
