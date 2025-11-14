import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { NavLink } from "./nav-link"
import { Logo } from "./logo"

const navigationLinks = [
  { href: "/sneakers", name: "Sneakers" },
  { href: "/catalogo", name: "Retro" },
  { href: "/catalogo", name: "Seleções" },
  { href: "/catalogo", name: "Equipamento Criança" },
  { href: "/catalogo", name: "Body Bebé" },
  { href: "/catalogo", name: "Liga Portuguesa" },
  { href: "/catalogo", name: "Premier League" },
  { href: "/catalogo", name: "La Liga" },
  { href: "/catalogo", name: "Serie A" },
  { href: "/catalogo", name: "Bundesliga" },
  { href: "/catalogo", name: "Ligue 1" },
  { href: "/catalogo", name: "Outras Ligas" },
]

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Logo clickable={false} />
            <SheetClose asChild>
              <Button variant="ghost" size="sm" aria-label="Fechar menu">
                <X className="h-6 w-6" />
              </Button>
            </SheetClose>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationLinks.map((link) => (
              <SheetClose key={link.href} asChild>
                <NavLink 
                  href={link.href} 
                  name={link.name}
                  className="block w-full text-left"
                />
              </SheetClose>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
