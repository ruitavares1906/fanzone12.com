import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
  href?: string
  index?: number
  variant?: 'default' | 'dark'
}

export function ProductCard({ product, href, index = 0, variant = 'default' }: ProductCardProps) {
  const rawImage = product.imagem || (product.imagensAdicionais && product.imagensAdicionais[0]) || "/placeholder.svg"
  const imageSrc = rawImage.startsWith("/") ? rawImage : `/images/${rawImage}`
  
  const isDark = variant === 'dark'
  const isEdicaoEspecial = product.edicao_especial
  
  return (
    <div className={`${isDark ? 'bg-black text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} ${isEdicaoEspecial ? 'border-2 border-yellow-400 shadow-yellow-200 shadow-lg' : ''} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border`}>
      <Link href={href ?? `/produto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.nome}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          {product.precoAntigo && (
            <div className={`absolute top-2 left-2 ${isDark ? 'bg-red-700 text-white' : 'bg-red-600 text-white'} text-xs font-bold px-2 py-1 rounded shadow-lg`}>
              {Math.round((1 - product.preco / product.precoAntigo) * 100)}% OFF
            </div>
          )}
          {isEdicaoEspecial ? (
            <Badge variant="secondary" className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs shadow-lg font-bold">
              🏆 Mais Vendido
            </Badge>
          ) : product.preVenda ? (
            <Badge variant="secondary" className={`absolute bottom-2 right-2 ${isDark ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'} text-xs shadow-lg`}>
              Pré-venda
            </Badge>
          ) : (
            <Badge variant="secondary" className={`absolute bottom-2 right-2 ${isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white'} text-xs shadow-lg`}>
              Em Stock
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className={`font-bold text-base mb-2 ${isDark ? 'text-white group-hover:text-gray-300' : 'text-gray-900 group-hover:text-gray-700'} line-clamp-2 transition-colors`}>
            {product.nome}
          </h3>
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-2">
              {product.precoAntigo && (
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} line-through`}>
                  {product.precoAntigo}€
                </span>
              )}
              <span className={`text-xl font-bold ${isEdicaoEspecial ? 'text-yellow-600' : index === 0 ? 'text-red-500' : isDark ? 'text-white' : 'text-gray-900'}`}>
                {product.preco}€
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

