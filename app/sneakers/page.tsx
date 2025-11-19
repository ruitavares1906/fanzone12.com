import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Sneakers | fanzone12.pt",
  description: "Descobre a nossa coleção exclusiva de sneakers. Adidas, Nike e muito mais com designs únicos e exclusivos.",
}

function SneakersContent() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6">
              Sneakers
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-orange-500 to-gray-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8 leading-relaxed">
            Descobre a nossa coleção exclusiva de sneakers das melhores marcas do mundo. 
            <span className="font-semibold text-gray-800"> Design único, qualidade premium.</span>
          </p>
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Adidas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Nike</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm text-gray-600">New Balance</span>
            </div>
          </div>
        </div>

        {/* Categorias por Marca */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Categoria Adidas */}
          <Link href="/sneakers/adidas" className="group">
            <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
              <div className="relative w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600">
                <Image
                  src="/images/1362796-full_product.jpg"
                  alt="Sneakers Adidas"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                
                {/* Overlay com gradiente na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>

                {/* Badge no topo */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white text-green-600 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                    ADIDAS
                  </Badge>
                </div>

                {/* Texto na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">
                    Adidas
                  </h3>
                  <p className="text-green-100 text-sm sm:text-base mb-2 drop-shadow-md">
                    Sneakers clássicos alemães
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs sm:text-sm text-green-100">Impossible is Nothing</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Categoria Nike */}
          <Link href="/sneakers/nike" className="group">
            <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
              <div className="relative w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
                <Image
                  src="/images/1000541110.webp"
                  alt="Sneakers Nike"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                
                {/* Overlay com gradiente na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>

                {/* Badge no topo */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white text-orange-600 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                    NIKE
                  </Badge>
                </div>

                {/* Texto na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">
                    Nike
                  </h3>
                  <p className="text-orange-100 text-sm sm:text-base mb-2 drop-shadow-md">
                    Just Do It - Inovação americana
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs sm:text-sm text-orange-100">Just Do It</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Categoria New Balance */}
          <Link href="/sneakers/new-balance" className="group">
            <div className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl aspect-[0.85] sm:aspect-[0.9]">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                <Image
                  src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                  alt="Sneakers New Balance"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                
                {/* Overlay com gradiente na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>

                {/* Badge no topo */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white text-gray-800 text-sm px-3 py-1.5 sm:px-4 sm:py-2 font-bold rounded-full shadow-lg">
                    NEW BALANCE
                  </Badge>
                </div>

                {/* Texto na parte inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg">
                    New Balance
                  </h3>
                  <p className="text-gray-200 text-sm sm:text-base mb-2 drop-shadow-md">
                    Conforto e qualidade americana
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-200">Fearlessly Independent</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>


      </div>
    </div>
  )
}

export default function SneakersPage() {
  return <SneakersContent />
} 