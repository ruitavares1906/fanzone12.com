"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronRight,
  ChevronLeft,
  LogOut,
  BarChart3,
  PlusCircle,
  Zap,
  Mail,
  DollarSign,
  X,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Encomendas",
      href: "/admin/encomendas",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Clientes",
      href: "/admin/clientes",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Parceiros",
      href: "/admin/partners",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Ganhos Parceiros",
      href: "/admin/partners-earnings",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Relatórios",
      href: "/admin/relatorios",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      href: "/admin/configuracoes",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Diagnóstico Email",
      href: "/admin/diagnostico-email",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      name: "Criar Encomenda Teste",
      href: "/admin/criar-encomenda-teste",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      name: "Testar Webhook",
      href: "/admin/testar-webhook",
      icon: <Zap className="h-5 w-5" />,
    },

  ]

  return (
    <>
      {/* Overlay para mobile (apenas quando a sidebar está aberta) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-50 md:z-auto`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed ? (
            <Link href="/admin" className="flex items-center">
              <Image src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png" alt="fanzone12.pt" width={150} height={40} className="h-8 w-auto" />
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center justify-center w-full">
              <Image src="/images/506271e6-0123-4529-8c72-bbc5679a47bd.png" alt="fanzone12.pt" width={150} height={40} className="h-8 w-auto" />
            </Link>
          )}
          <div className="flex items-center gap-2">
            {/* Botão de fechar para mobile */}
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-gray-100 md:hidden"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            {/* Botão de colapsar para desktop */}
            <button 
              onClick={() => setCollapsed(!collapsed)} 
              className="p-1 rounded-full hover:bg-gray-100 hidden md:block"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose} // Fechar sidebar no mobile ao clicar em um link
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.href) ? "bg-green-50 text-green-700" : "text-gray-700 hover:bg-gray-100"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className={`${collapsed ? "" : "mr-3"}`}>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

        <div className="p-4 border-t">
          <Button variant="outline" className={`w-full ${collapsed ? "justify-center px-2" : ""}`} onClick={handleLogout}>
            <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </div>
    </>
  )
}
