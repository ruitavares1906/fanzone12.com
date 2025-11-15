"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from "@/components/ui/carousel"
import { 
  Instagram, 
  Users
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Parceiro {
  id: string
  nome: string
  foto: string
  redesSociais: {
    instagram?: string
    tiktok?: string
    tiktokUrl?: string // URL específica para vídeo ou perfil
  }
}

const parceirosExemplo: Parceiro[] = [
  {
    id: "1",
    nome: "Diana Guedes",
    foto: "/images/dianafoto.jpg",
    redesSociais: {
      instagram: "dii.guedess",
      tiktok: "dii.guedess"
    }
  },
  {
    id: "2",
    nome: "Leonor Ferreira",
    foto: "",
    redesSociais: {
      tiktok: "leonorr.ferreira___",
      tiktokUrl: "https://www.tiktok.com/@leonorr.ferreira___/video/7571958294722497825?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "3",
    nome: "Natacha",
    foto: "",
    redesSociais: {
      instagram: "_natachaa.___",
      tiktok: "_natachaa._",
      tiktokUrl: "https://www.tiktok.com/@_natachaa._/video/7565979514669403425?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "4",
    nome: "Constança Sá",
    foto: "",
    redesSociais: {
      instagram: "concasnsa",
      tiktok: "concasnsaa",
      tiktokUrl: "https://www.tiktok.com/@concasnsaa/video/7565558614736342305?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "5",
    nome: "Daniela Mendes",
    foto: "",
    redesSociais: {
      instagram: "_dany._ofc_",
      tiktok: "daniela.ofc_",
      tiktokUrl: "https://www.tiktok.com/@daniela.ofc_/video/7564129007185268000?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "6",
    nome: "Matilde Patrão",
    foto: "",
    redesSociais: {
      tiktok: "matilde.patraoo"
    }
  }
]

export default function ParceirosSection() {
  // Componente SVG para TikTok
  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white [content-visibility:auto] [contain-intrinsic-size:1000px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-6 py-3 rounded-full mb-6 text-lg">
            <Users className="w-5 h-5 mr-2" />
            Our Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Meet Our Partners
          </h2>
        </div>

        {/* Carrossel de Parceiros */}
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {parceirosExemplo.map((parceiro, index) => (
                <CarouselItem key={parceiro.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-full">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Foto do Parceiro */}
                      <div className="relative aspect-square w-full bg-gradient-to-br from-blue-100 to-purple-100">
                        {parceiro.foto ? (
                          <Image 
                            src={parceiro.foto}
                            alt={parceiro.nome}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-contain p-4"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                              {parceiro.nome.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {parceiro.nome}
                          </h3>
                        </div>

                        {/* Redes Sociais */}
                        <div className="flex justify-center gap-2 flex-wrap">
                          {parceiro.redesSociais.instagram && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-9 px-3 gap-2 border-pink-500 text-pink-600 hover:bg-pink-50"
                              asChild
                            >
                              <a href={`https://instagram.com/${parceiro.redesSociais.instagram}`} target="_blank" rel="noopener noreferrer">
                                <div className="flex items-center gap-2">
                                  <Instagram className="w-4 h-4" />
                                  <span className="text-sm">@{parceiro.redesSociais.instagram}</span>
                                </div>
                              </a>
                            </Button>
                          )}
                          {parceiro.redesSociais.tiktok && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full h-9 px-3 gap-2 hover:bg-gray-50"
                              asChild
                            >
                              <a href={parceiro.redesSociais.tiktokUrl || `https://tiktok.com/@${parceiro.redesSociais.tiktok}`} target="_blank" rel="noopener noreferrer">
                                <div className="flex items-center gap-2">
                                  <Image src="/images/tik-tok.webp" alt="TikTok" width={16} height={16} className="w-4 h-4" />
                                  <span className="text-sm">@{parceiro.redesSociais.tiktok}</span>
                                </div>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots dotsClassName="-bottom-6" />
          </Carousel>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Want to become our partner?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join our community of experts and influencers
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full"
              asChild
            >
              <Link href="/info-parceiros">
                Apply as Partner
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
