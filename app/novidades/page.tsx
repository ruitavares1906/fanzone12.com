import { Button } from "@/components/ui/button"
import { getProdutos } from "@/lib/products"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Novidades 2024/25 | fanzone12.pt",
  description: "Discover the new jerseys da temporada 2024/25 dos principais clubes portugueses e europeus.",
}

export default async function NovidadesPage() {
  const produtos = await getProdutos({ temporada: "2025/26" })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Novidades</h1>
        <p className="mt-4 text-lg text-gray-600">
          Discover the new jerseys para a temporada 2025/26
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Sporting */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-6 text-center">
            <Image
              src="/images/Sporting_Clube_de_Portugal.webp"
              alt="Sporting CP"
              width={80}
              height={80}
              className="mx-auto mb-4"
              style={{ height: "auto" }}
            />
            <h3 className="text-xl font-bold mb-2">Sporting CP</h3>
            <p className="text-gray-600 mb-4">Novas camisolas da temporada 2025/26</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <Link
              href="/produto/21"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/1a47109.webp"
                alt="Camisola Principal"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Principal
              </div>
            </Link>
            <Link
              href="/produto/sporting-25-26-gk"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/s.webp"
                alt="Camisola Guarda-Redes"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Guarda-Redes
              </div>
            </Link>
          </div>
          <div className="p-4 text-center">
            <Button asChild>
              <Link href="/catalogo?clube=sporting&temporada=2025/26">Ver Coleção Sporting</Link>
            </Button>
          </div>
        </div>

        {/* FC Porto */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-6 text-center">
            <Image
              src="/images/9_imgbank_1728921003.webp"
              alt="FC Porto"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">FC Porto</h3>
            <p className="text-gray-600 mb-4">Novas camisolas da temporada 2025/26</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <Link
              href="/produto/porto-25-26-home"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/bb0d8c35.webp"
                alt="Camisola Principal"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Principal
              </div>
            </Link>
            <Link
              href="/produto/porto-25-26-away"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/1735510d.webp"
                alt="Camisola Alternativa"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Alternativa
              </div>
            </Link>
          </div>
          <div className="p-4 text-center">
            <Button asChild>
              <Link href="/catalogo?clube=porto&temporada=2025/26">Ver Coleção FC Porto</Link>
            </Button>
          </div>
        </div>

        {/* Benfica */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-6 text-center">
            <Image
              src="/images/ScoreImageHandler.webp"
              alt="SL Benfica"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">SL Benfica</h3>
            <p className="text-gray-600 mb-4">Novas camisolas da temporada 2025/26</p>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4">
            <Link
              href="/produto/benfica-25-26-home"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/053d5af2.webp"
                alt="Camisola Principal"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Principal
              </div>
            </Link>
            <Link
              href="/produto/benfica-25-26-away"
              className="relative aspect-square overflow-hidden rounded-md hover:opacity-90 transition-opacity"
            >
              <Image
                src="/images/c794816a.webp"
                alt="Camisola Alternativa"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs p-1 text-center">
                Alternativa
              </div>
            </Link>
          </div>
          <div className="p-4 text-center">
            <Button asChild>
              <Link href="/catalogo?clube=benfica&temporada=2025/26">Ver Coleção Benfica</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
