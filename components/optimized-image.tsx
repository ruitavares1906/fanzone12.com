import Image from "next/image"
import { useState, memo } from "react"

interface OptimizedImageProps extends React.ComponentProps<typeof Image> {
  fill?: boolean
  className?: string
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes,
  quality = 85, // Qualidade fixa para evitar diferenças de hidratação
  loading = "lazy",
  fetchPriority = "auto",
  placeholder = "empty",
  blurDataURL,
  fill = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const safePlaceholder = placeholder === "blur" && !blurDataURL ? "empty" : placeholder

  return (
    <div className={`relative overflow-hidden ${fill ? "w-full h-full" : ""} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={loading}
        fetchPriority={fetchPriority}
        placeholder={safePlaceholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 will-change-opacity ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        suppressHydrationWarning
        {...props}
      />
    </div>
  )
})
