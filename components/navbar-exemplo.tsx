"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - AUMENTADO PARA 60x60 */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png"
            alt="fanzone12.pt"
            width={60}
            height={60}
            className="h-[60px] w-[60px]"
          />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/catalogo" className="text-gray-700 hover:text-red-600 font-medium">
            Catálogo
          </Link>
          <Link href="/personalizadas" className="text-gray-700 hover:text-red-600 font-medium">
            Personalizadas
          </Link>
          <Link href="/novidades" className="text-gray-700 hover:text-red-600 font-medium">
            Novidades
          </Link>
          <Link href="/contacto" className="text-gray-700 hover:text-red-600 font-medium">
            Contacto
          </Link>
        </nav>

        {/* Ícones Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/carrinho" className="text-gray-700 hover:text-red-600 relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <Link href="/conta" className="text-gray-700 hover:text-red-600">
            <User className="h-6 w-6" />
          </Link>
        </div>

        {/* Menu Mobile */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Menu Mobile Expandido */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between border-b">
            {/* Logo no Menu Mobile - AUMENTADO PARA 70x70 */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png"
                alt="fanzone12.pt"
                width={70}
                height={70}
                className="h-[70px] w-[70px]"
              />
            </Link>
            <button onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
              <X className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/catalogo"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/personalizadas"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Personalizadas
              </Link>
              <Link
                href="/novidades"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Novidades
              </Link>
              <Link
                href="/contacto"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              <Link
                href="/conta"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                Minha Conta
              </Link>
              <Link
                href="/carrinho"
                className="text-xl font-medium p-2 hover:bg-gray-100 rounded flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho (0)
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
