import { useEffect, useCallback } from 'react'

export function usePerformance() {
  const preloadResource = useCallback((href: string, as: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    }
  }, [])

  const prefetchResource = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = href
      document.head.appendChild(link)
    }
  }, [])

  const optimizeImages = useCallback(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      // Lazy load images that are not in viewport
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    } else {
      // Fallback: carregar todas as imagens de uma vez
      document.querySelectorAll('img[data-src]').forEach((img) => {
        (img as HTMLImageElement).src = (img as HTMLImageElement).dataset.src || ''
        img.classList.remove('lazy')
      })
    }
  }, [])

  const deferNonCriticalResources = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Defer non-critical CSS
      const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]')
      nonCriticalCSS.forEach((link) => {
        const linkElement = link as HTMLLinkElement
        linkElement.media = 'print'
        linkElement.onload = () => { linkElement.media = 'all' }
      })

      // Defer non-critical JavaScript
      const nonCriticalJS = document.querySelectorAll('script[data-defer]')
      nonCriticalJS.forEach((script) => {
        script.setAttribute('defer', 'true')
      })
    }
  }, [])

  useEffect(() => {
    // Initialize performance optimizations after page load
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        optimizeImages()
        deferNonCriticalResources()
      })
    } else {
      const timer = setTimeout(() => {
        optimizeImages()
        deferNonCriticalResources()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [optimizeImages, deferNonCriticalResources])

  return {
    preloadResource,
    prefetchResource,
    optimizeImages,
    deferNonCriticalResources,
  }
}
