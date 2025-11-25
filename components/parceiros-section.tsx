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
    id: "0",
    nome: "Carolina Carvalho",
    foto: "/images/75677333-8f60-4a97-85e1-38711f1866ba.JPG",
    redesSociais: {
      tiktok: "_carolinaavc",
      tiktokUrl: "https://www.tiktok.com/@_carolinaavc/video/7573299024967568673?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "1",
    nome: "Constança Sá",
    foto: "/images/24b8abc6-f277-408d-8418-3a12fc91ed94.JPG",
    redesSociais: {
      instagram: "concasnsa",
      tiktok: "concasnsaa",
      tiktokUrl: "https://www.tiktok.com/@concasnsaa/video/7565558614736342305?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "2.5",
    nome: "Tatiana Moreira",
    foto: "/images/626c89f0-66a2-492f-9835-376f6d46c2c3.jpg",
    redesSociais: {
      tiktok: "user734167786982",
      tiktokUrl: "https://www.tiktok.com/@user734167786982/video/7575248951062859041"
    }
  },
  {
    id: "3",
    nome: "Diana Guedes",
    foto: "/images/dianafoto.jpg",
    redesSociais: {
      instagram: "dii.guedess",
      tiktok: "dii.guedess"
    }
  },
  {
    id: "4",
    nome: "Leonor Ferreira",
    foto: "",
    redesSociais: {
      tiktok: "leonorr.ferreira___",
      tiktokUrl: "https://www.tiktok.com/@leonorr.ferreira___/video/7571958294722497825?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    },
  },
  {
    id: "5",
    nome: "Luana Fonseca",
    foto: "",
    redesSociais: {
      tiktok: "user217739706",
      tiktokUrl: "https://www.tiktok.com/@user217739706/video/7573744163775139104?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    },
  },
  {
    id: "6",
    nome: "Natacha",
    foto: "",
    redesSociais: {
      instagram: "_natachaa.___",
      tiktok: "_natachaa._",
      tiktokUrl: "https://www.tiktok.com/@_natachaa._/video/7565979514669403425?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },

  {
    id: "7",
    nome: "Daniela Mendes",
    foto: "",
    redesSociais: {
      instagram: "_dany._ofc_",
      tiktok: "daniela.ofc_",
      tiktokUrl: "https://www.tiktok.com/@daniela.ofc_/video/7564129007185268000?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  },
  {
    id: "8",
    nome: "Matilde Patrão",
    foto: "",
    redesSociais: {
      tiktok: "matilde.patraoo"
    }
  },
  {
    id: "9",
    nome: "Lara Silva Santos",
    foto: "",
    redesSociais: {
      tiktok: "larassantos11",
      tiktokUrl: "https://www.tiktok.com/@larassantos11/video/7574408965803576609?is_from_webapp=1&sender_device=pc&web_id=7512216959863293472"
    }
  }
]

export function ParceirosSectionCompact() {
  return (
    <section className="py-6 sm:py-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Compacto */}
        <div className="text-center mb-4 sm:mb-6">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-md px-3 py-1 sm:px-4 sm:py-2 rounded-full mb-2 sm:mb-3 text-xs sm:text-sm">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            Our Partners
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
            Meet Our Partners
          </h2>
        </div>

        {/* Carrossel de Parceiros Compacto */}
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {parceirosExemplo.map((parceiro) => (
                <CarouselItem key={parceiro.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-md rounded-xl overflow-hidden h-full aspect-[0.6] sm:aspect-[0.65]">
                    <CardContent className="p-0 h-full flex flex-col relative">
                      {/* Foto do Parceiro */}
                      <div className="relative w-full flex-1 bg-gradient-to-br from-blue-100 to-purple-100">
                        {parceiro.foto ? (
                          <Image 
                            src={parceiro.foto}
                            alt={parceiro.nome}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                              {parceiro.nome.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay com gradiente na parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                        
                        {/* Nome e Redes Sociais */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                          <h3 className="text-sm sm:text-base font-bold text-white drop-shadow-lg mb-1 sm:mb-2 line-clamp-1">
                            {parceiro.nome}
                          </h3>
                          
                          {/* Redes Sociais - Apenas ícones no mobile */}
                          <div className="flex justify-start gap-1.5 sm:gap-2 flex-wrap">
                            {parceiro.redesSociais.instagram && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-6 sm:h-7 px-1.5 sm:px-2 gap-1 bg-white/90 backdrop-blur-sm border-pink-500 text-pink-600 hover:bg-white"
                                asChild
                              >
                                <a href={`https://instagram.com/${parceiro.redesSociais.instagram}`} target="_blank" rel="noopener noreferrer">
                                  <div className="flex items-center gap-1">
                                    <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="hidden sm:inline text-xs">@{parceiro.redesSociais.instagram}</span>
                                  </div>
                                </a>
                              </Button>
                            )}
                            {parceiro.redesSociais.tiktok && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-6 sm:h-7 px-1.5 sm:px-2 gap-1 bg-white/90 backdrop-blur-sm hover:bg-white"
                                asChild
                              >
                                <a href={parceiro.redesSociais.tiktokUrl || `https://tiktok.com/@${parceiro.redesSociais.tiktok}`} target="_blank" rel="noopener noreferrer">
                                  <div className="flex items-center gap-1">
                                    <Image src="/images/tik-tok.webp" alt="TikTok" width={12} height={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="hidden sm:inline text-xs">@{parceiro.redesSociais.tiktok}</span>
                                  </div>
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-8 sm:py-16 bg-gradient-to-br from-gray-50 to-white [content-visibility:auto] [contain-intrinsic-size:1000px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-4 sm:mb-6 text-sm sm:text-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Our Partners
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Meet Our Partners
          </h2>
        </div>

        {/* Carrossel de Parceiros */}
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: "start", containScroll: "trimSnaps" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {parceirosExemplo.map((parceiro, index) => (
                <CarouselItem key={parceiro.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border-0 shadow-lg rounded-2xl overflow-hidden h-full aspect-[0.85] sm:aspect-[0.9]">
                    <CardContent className="p-0 h-full flex flex-col relative">
                      {/* Foto do Parceiro - Ocupa quase todo o espaço */}
                      <div className="relative w-full flex-1 bg-gradient-to-br from-blue-100 to-purple-100">
                        {parceiro.foto ? (
                          <Image 
                            src={parceiro.foto}
                            alt={parceiro.nome}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                              {parceiro.nome.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay com gradiente na parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                        
                        {/* Nome como overlay na parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg mb-2">
                            {parceiro.nome}
                          </h3>
                          
                          {/* Redes Sociais */}
                          <div className="flex justify-start gap-2 flex-wrap">
                            {parceiro.redesSociais.instagram && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-8 sm:h-9 px-2 sm:px-3 gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm border-pink-500 text-pink-600 hover:bg-white"
                                asChild
                              >
                                <a href={`https://instagram.com/${parceiro.redesSociais.instagram}`} target="_blank" rel="noopener noreferrer">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm">@{parceiro.redesSociais.instagram}</span>
                                  </div>
                                </a>
                              </Button>
                            )}
                            {parceiro.redesSociais.tiktok && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full h-8 sm:h-9 px-2 sm:px-3 gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                                asChild
                              >
                                <a href={parceiro.redesSociais.tiktokUrl || `https://tiktok.com/@${parceiro.redesSociais.tiktok}`} target="_blank" rel="noopener noreferrer">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Image src="/images/tik-tok.webp" alt="TikTok" width={16} height={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm">@{parceiro.redesSociais.tiktok}</span>
                                  </div>
                                </a>
                              </Button>
                            )}
                          </div>
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
        <div className="text-center mt-8 sm:mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Want to become our partner?
            </h3>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
              Join our community of experts and influencers
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full"
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
