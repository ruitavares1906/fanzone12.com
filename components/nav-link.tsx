import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  name: string
  className?: string
}

const linkColors: Record<string, string> = {
  Sneakers: "text-orange-600 hover:text-orange-700 font-bold",
  Retro: "text-amber-600 hover:text-amber-700 font-bold",
  Seleções: "text-red-600 hover:text-red-700 font-bold",
  "Equipamento Criança": "text-green-600 hover:text-green-700 font-bold",
  "Body Bebé": "text-pink-600 hover:text-pink-700 font-bold",
  "Liga Portuguesa": "text-emerald-600 hover:text-emerald-700 font-bold",
  "Premier League": "text-purple-600 hover:text-purple-700 font-bold",
  "La Liga": "text-yellow-600 hover:text-yellow-700 font-bold",
  "Serie A": "text-indigo-600 hover:text-indigo-700 font-bold",
  Bundesliga: "text-cyan-600 hover:text-cyan-700 font-bold",
  "Ligue 1": "text-rose-600 hover:text-rose-700 font-bold",
  "Outras Ligas": "text-slate-600 hover:text-slate-700 font-bold",
}

export function NavLink({ href, name, className }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  const linkClass = isActive
    ? "text-blue-600 bg-gray-100 shadow-lg"
    : linkColors[name] || "text-gray-700 hover:text-blue-600"

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50",
        linkClass,
        className
      )}
    >
      {name}
    </Link>
  )
}
