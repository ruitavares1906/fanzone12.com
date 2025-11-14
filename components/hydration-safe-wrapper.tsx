"use client"

import { useEffect, useState } from "react"

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function HydrationSafeWrapper({ 
  children, 
  fallback = null, 
  className = "" 
}: HydrationSafeWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback ? <div className={className}>{fallback}</div> : null
  }

  return <div className={className}>{children}</div>
}
