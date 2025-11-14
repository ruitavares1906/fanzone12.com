"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, Sparkles, Footprints } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "./cart-provider"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { SearchBox } from "./search-box"

export function Navbar() {
  const { cart } = useCart()
  const pathname = usePathname()

  const totalItems = cart.reduce((total, item) => total + item.quantidade, 0)

  const navLinks = [
    { name: "Sneakers", href: "/sneakers" },
    { name: "Phone Cases", href: "/catalogo/capas" },
    { name: "Clubs", href: "/catalogo" },
    { name: "Retro", href: "/catalogo?categoria=retro" },
    { name: "National Teams", href: "/catalogo?categoria=selecoes" },
    { name: "Kids", href: "/catalogo?categoria=crianca" },
    { name: "Baby", href: "/catalogo?categoria=body" },
    { name: "Premier League", href: "/catalogo?liga=premier-league" },
    { name: "La Liga", href: "/catalogo?liga=la-liga" },
    { name: "Serie A", href: "/catalogo?liga=serie-a" },
    { name: "Bundesliga", href: "/catalogo?liga=bundesliga" },
    { name: "Ligue 1", href: "/catalogo?liga=ligue-1" },
  ]

  return (
     <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-md">
       {/* Promoção Top Bar */}
       <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white text-center py-1 px-4">
         <div className="text-xs sm:text-sm font-medium">
            <span className="md:animate-pulse motion-reduce:animate-none">🎁</span>
           <span className="mx-2">BUY 4 GET 1 FREE</span>
            <span className="md:animate-pulse motion-reduce:animate-none">🎁</span>
           <span className="hidden sm:inline ml-2 text-purple-200">• Automatic discount at checkout</span>
         </div>
       </div>
      
      <div className="mx-auto max-w-full px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Modern Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                 <Button variant="outline" size="icon" className="ml-2 mr-1 modern-button border-gray-400 text-gray-800 hover:bg-gray-100">
                   <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
               <SheetContent side="left" className="bg-white border-gray-200 text-gray-900 overflow-y-auto" forceMount>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center mb-6 justify-center">
                  <Image
                    src="/images/dbe5a8e3-94bb-400a-aedf-f737d748eb6f.webp"
                    alt="fanzone12.com"
                    width={140}
                    height={49}
                  />
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                 className={`text-sm font-medium transition-all duration-300 hover:text-blue-600 px-3 py-2 hover:bg-gray-100 ${
                   pathname === link.href 
                     ? "text-blue-600 bg-gray-100" 
                     : link.name === "Sneakers"
                     ? "text-orange-600 hover:text-orange-700 font-bold"
                     : link.name === "Capas de Telemóvel"
                     ? "text-sky-600 hover:text-sky-700 font-bold"
                     : link.name === "Retro"
                     ? "text-amber-600 hover:text-amber-700 font-bold"
                     : link.name === "Seleções"
                     ? "text-red-600 hover:text-red-700 font-bold"
                     : link.name === "Equipamento Criança"
                     ? "text-green-600 hover:text-green-700 font-bold"
                     : link.name === "Body Bebé"
                     ? "text-pink-600 hover:text-pink-700 font-bold"
                     : link.name === "Liga Portuguesa"
                     ? "text-emerald-600 hover:text-emerald-700 font-bold"
                     : link.name === "Premier League"
                     ? "text-purple-600 hover:text-purple-700 font-bold"
                     : link.name === "La Liga"
                     ? "text-yellow-600 hover:text-yellow-700 font-bold"
                     : link.name === "Serie A"
                     ? "text-indigo-600 hover:text-indigo-700 font-bold"
                     : link.name === "Bundesliga"
                     ? "text-cyan-600 hover:text-cyan-700 font-bold"
                     : "text-gray-700 hover:text-blue-600"
                 }`}
                      >
                        {link.name === "Sneakers" ? (
                          <div className="flex items-center gap-2">
                            <span>{link.name}</span>
                             <Footprints className="w-4 h-4 md:animate-bounce motion-reduce:animate-none" />
                          </div>
                        ) : link.name === "Phone Cases" ? (
                          <div className="flex items-center gap-2">
                            <span>{link.name}</span>
                            <span className="text-lg">📱</span>
                          </div>
                        ) : (
                          link.name
                        )}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Modern Logo */}
          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end flex-1 mt-2 lg:mt-0 lg:mr-16">
            <Link href="/" className="flex items-center group">
               {/* Primeiro logo - responsivo - Otimizado para LCP */}
               <Image 
                 src="/images/dbe5a8e3-94bb-400a-aedf-f737d748eb6f.webp" 
                 alt="fanzone12.com" 
                 width={150} 
                 height={52} 
                 className="hidden lg:block mr-3 transition-transform group-hover:scale-105" 
                 priority
                 fetchPriority="high"
                 loading="eager"
                 decoding="sync"
                 sizes="(max-width: 1024px) 0px, 150px"
                  quality={85}
                 suppressHydrationWarning
               />
               <Image 
                 src="/images/dbe5a8e3-94bb-400a-aedf-f737d748eb6f.webp" 
                 alt="fanzone12.pt" 
                 width={140} 
                 height={49} 
                 className="lg:hidden mr-2 transition-transform group-hover:scale-105" 
                 priority
                 fetchPriority="high"
                 loading="eager"
                 decoding="sync"
                 sizes="(max-width: 1024px) 140px, 0px"
                  quality={85}
                 suppressHydrationWarning
               />
               {/* Segundo logo - sempre visível - Otimizado */}
               <Image 
                 src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.webp" 
                 alt="fanzone12.com" 
                 width={60} 
                 height={21} 
                 className="transition-transform group-hover:scale-105" 
                 priority
                 fetchPriority="high"
                 loading="eager"
                 decoding="sync"
                 sizes="60px"
                  quality={85}
                 suppressHydrationWarning
               />
            </Link>
          </div>

          {/* Modern Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 mx-4 flex-grow justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                 className={`text-sm font-semibold transition-all duration-300 px-4 py-2 hover:bg-gray-100 whitespace-nowrap ${
                   pathname === link.href 
                     ? "text-blue-600 bg-gray-100 shadow-lg" 
                     : link.name === "Sneakers"
                     ? "text-orange-600 hover:text-orange-700 font-bold"
                     : link.name === "Phone Cases"
                     ? "text-sky-600 hover:text-sky-700 font-bold"
                     : link.name === "Retro"
                     ? "text-amber-600 hover:text-amber-700 font-bold"
                     : link.name === "National Teams"
                     ? "text-red-600 hover:text-red-700 font-bold"
                     : link.name === "Kids"
                     ? "text-green-600 hover:text-green-700 font-bold"
                     : link.name === "Baby"
                     ? "text-pink-600 hover:text-pink-700 font-bold"
                     : link.name === "Premier League"
                     ? "text-purple-600 hover:text-purple-700 font-bold"
                     : link.name === "La Liga"
                     ? "text-yellow-600 hover:text-yellow-700 font-bold"
                     : link.name === "Serie A"
                     ? "text-indigo-600 hover:text-indigo-700 font-bold"
                     : link.name === "Bundesliga"
                     ? "text-cyan-600 hover:text-cyan-700 font-bold"
                     : link.name === "Ligue 1"
                     ? "text-rose-600 hover:text-rose-700 font-bold"
                     : "text-gray-700 hover:text-blue-600"
                 }`}
              >
                {link.name === "Sneakers" ? (
                  <div className="flex items-center gap-2">
                    <span>{link.name}</span>
                    <Footprints className="w-4 h-4 md:animate-bounce motion-reduce:animate-none" />
                  </div>
                ) : link.name === "Phone Cases" ? (
                  <div className="flex items-center gap-2">
                    <span>{link.name}</span>
                    <span className="text-lg">📱</span>
                  </div>
                ) : (
                  link.name
                )}
              </Link>
            ))}
          </nav>

          {/* Modern Cart Button */}
          <div className="flex items-center space-x-1 flex-shrink-0 mr-6">
             <Button variant="ghost" size="sm" asChild className="relative modern-button text-gray-800 hover:text-blue-600 hover:bg-gray-100 p-3">
              <Link href="/carrinho">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {totalItems > 0 && (
                   <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center text-[9px] border border-white shadow-lg md:animate-pulse motion-reduce:animate-none">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>

         {/* Modern Mobile Search */}
         <div className="lg:hidden pb-4 pt-2 px-2">
          <SearchBox 
            size="normal"
            placeholder="Search products..."
             className="w-full glass-effect border-gray-300 text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Modern Desktop Search Bar */}
       <div className="hidden lg:block border-t border-gray-200 bg-gray-50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <SearchBox 
              size="normal"
              placeholder="🔍 Search for clubs, leagues, players or seasons..."
               className="max-w-2xl glass-effect text-gray-700 placeholder-gray-500 shadow-lg"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
