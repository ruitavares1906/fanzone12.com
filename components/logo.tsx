import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  clickable?: boolean
}

export function Logo({ clickable = true }: LogoProps) {
  const content = (
    <>
      {/* Logo Desktop */}
      <Image 
        src="/images/dbe5a8e3-94bb-400a-aedf-f737d748eb6f.webp" 
        alt="fanzone12.pt" 
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
      
      {/* Logo Mobile */}
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
      
      {/* Logo Secundário */}
      <Image 
        src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.webp" 
        alt="fanzone12.pt" 
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
    </>
  )

  if (clickable) {
    return (
      <Link href="/" className="flex items-center group">
        {content}
      </Link>
    )
  }

  return (
    <div className="flex items-center">
      {content}
    </div>
  )
}
