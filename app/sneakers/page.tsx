import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
              <div className="relative h-96 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-green-800/30" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                <Image
                  src="/images/1362796-full_product.jpg"
                  alt="Sneakers Adidas"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-green-600 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                    ADIDAS
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">Adidas</h3>
                  <p className="text-green-100 text-base">Sneakers clássicos alemães</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm text-green-100">Impossible is Nothing</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-6">
                  <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explorar →</span>
                </div>
              </div>
            </Card>
          </Link>

          {/* Categoria Nike */}
          <Link href="/sneakers/nike" className="group">
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
              <div className="relative h-96 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                <Image
                  src="/images/1000541110.webp"
                  alt="Sneakers Nike"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-orange-600 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                    NIKE
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">Nike</h3>
                  <p className="text-orange-100 text-base">Just Do It - Inovação americana</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm text-orange-100">Just Do It</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-6">
                  <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explorar →</span>
                </div>
              </div>
            </Card>
          </Link>

          {/* Categoria New Balance */}
          <Link href="/sneakers/new-balance" className="group">
            <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
              <div className="relative h-96 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-900/30" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
                <Image
                  src="/images/cb4d358aa715b83d7eaed7d06ff42d3b.webp"
                  alt="Sneakers New Balance"
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={85}
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white text-gray-800 text-sm px-4 py-2 font-bold rounded-full shadow-lg">
                    NEW BALANCE
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">New Balance</h3>
                  <p className="text-gray-200 text-base">Conforto e qualidade americana</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-sm text-gray-200">Fearlessly Independent</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-6">
                  <span className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full">Explorar →</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>


      </div>
    </div>
  )
}

export default function SneakersPage() {
  return <SneakersContent />
} 