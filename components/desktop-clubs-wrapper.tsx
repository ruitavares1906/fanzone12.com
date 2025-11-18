"use client"

import dynamic from "next/dynamic"

const DesktopClubsExpander = dynamic(() => import("@/components/desktop-clubs-expander").then(mod => mod.DesktopClubsExpander), {
  loading: () => <div className="h-48 w-full bg-gray-100 animate-pulse rounded-xl" />,
  ssr: false
})

export function DesktopClubsWrapper() {
  return <DesktopClubsExpander />
}

