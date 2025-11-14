"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function ScrollTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    }
  }, [pathname])

  return null
} 