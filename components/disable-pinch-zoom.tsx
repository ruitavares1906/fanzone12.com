"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function DisablePinchZoom() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return // só ativa na página inicial

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }

    const handleGesture = (e: any) => e.preventDefault()
    const handleWheel = (e: WheelEvent) => { if ((e as any).ctrlKey) e.preventDefault() }
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['+', '-', '='].includes(e.key)) e.preventDefault()
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("gesturestart", handleGesture, { passive: false })
    document.addEventListener("gesturechange", handleGesture, { passive: false })
    document.addEventListener("gestureend", handleGesture, { passive: false })
    document.addEventListener("wheel", handleWheel, { passive: false })
    document.addEventListener("keydown", handleKeyDown, { passive: false })

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("gesturestart", handleGesture)
      document.removeEventListener("gesturechange", handleGesture)
      document.removeEventListener("gestureend", handleGesture)
      document.removeEventListener("wheel", handleWheel)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [pathname])

  return null
}
