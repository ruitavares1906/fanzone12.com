"use client"

import { useEffect, useState } from "react"

interface ClientAnimationWrapperProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ClientAnimationWrapper({ 
  children, 
  delay = 0, 
  className = "" 
}: ClientAnimationWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={className}>{children}</div>
  }

  return (
    <div 
      className={className}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
} 