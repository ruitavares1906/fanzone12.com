"use client"

import { ClientAnimationWrapper } from "@/components/client-animation-wrapper"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

export function DesktopClubsExpander() {
  const allClubs = [
    { name: "Barcelona", logo: "pngwing.com (3).webp", href: "/catalogo?clube=barcelona" },
    { name: "Real Madrid", logo: "pngwing.com (9).webp", href: "/catalogo?clube=real-madrid" },
    { name: "Manchester United", logo: "pngwing.com (8).webp", href: "/catalogo?clube=manchester-united" },
    { name: "Arsenal", logo: "9874.png", href: "/catalogo?clube=arsenal" },
    { name: "PSG", logo: "pngwing.com (5).webp", href: "/catalogo?clube=psg" },
    { name: "Manchester City", logo: "pngwing.com (6).webp", href: "/catalogo?clube=manchester-city" },
    { name: "Liverpool", logo: "87554.png", href: "/catalogo?clube=liverpool" }, 
    { name: "Bayern Munich", logo: "Bayern-Munich-logo.png", href: "/catalogo?clube=bayern-munich" },
    { name: "Inter Milan", logo: "Inter-Milan-logo.png", href: "/catalogo?clube=inter" },
    { name: "Chelsea", logo: "Chelsea-logo.webp", href: "/catalogo?clube=chelsea" },
    { name: "AC Milan", logo: "Milan-logo.png", href: "/catalogo?clube=milan" },
    { name: "Tottenham", logo: "Tottenham-logo.png", href: "/catalogo?clube=tottenham" },
    { name: "Sporting CP", logo: "pngwing.com (1).webp", href: "/catalogo?clube=sporting" },
    { name: "Benfica", logo: "pngwing.com.webp", href: "/catalogo?clube=benfica" },
    { name: "Porto", logo: "pngwing.com (2).webp", href: "/catalogo?clube=porto" },
    { name: "Braga", logo: "braga-logo.png", href: "/catalogo?clube=sc-braga" },
    { name: "Vitória SC", logo: "Vitoria-Sport-Clube-logo.png", href: "/catalogo?clube=vitoria-sc" },
  ]

  return (
    <div className="hidden md:block">
      <Carousel className="w-full">
        <CarouselContent>
          {allClubs.map((club, index) => (
            <CarouselItem key={club.name} className="basis-1/5">
              <ClientAnimationWrapper
                delay={index * 0.05}
                className="animate-scale-in"
              >
                <Link
                  href={club.href}
                  className="modern-card group p-6 text-center rounded-2xl shadow-modern hover:shadow-modern-hover transition-all duration-300 block"
                >
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <Image
                      src={`/images/${club.logo}`}
                      alt={club.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                      loading="lazy"
                      sizes="64px"
                      quality={85}
                    />
                  </div>
                  <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {club.name}
                  </p>
                </Link>
              </ClientAnimationWrapper>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="h-10 w-10" />
        <CarouselNext className="h-10 w-10" />
      </Carousel>
    </div>
  )
}
