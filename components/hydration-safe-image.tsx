"use client"

import Image from "next/image"
import { memo } from "react"

interface HydrationSafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  loading?: "lazy" | "eager"
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  fetchPriority?: "auto" | "high" | "low"
  suppressHydrationWarning?: boolean
}

export const HydrationSafeImage = memo(function HydrationSafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  loading = "lazy",
  sizes,
  quality = 85, // Qualidade fixa para evitar diferenças
  placeholder = "empty",
  blurDataURL,
  fetchPriority = "auto",
  suppressHydrationWarning = true,
  ...props
}: HydrationSafeImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      loading={loading}
      sizes={sizes}
      quality={quality}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      fetchPriority={fetchPriority}
      suppressHydrationWarning={suppressHydrationWarning}
      {...props}
    />
  )
})
