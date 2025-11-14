"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Bell, User, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [adminName, setAdminName] = useState("Administrador")
  const [adminEmail, setAdminEmail] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getAdminInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setAdminEmail(session.user.email || "")

        // Buscar informações adicionais do admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("name")
          .eq("email", session.user.email)
          .single()

        if (adminData?.name) {
          setAdminName(adminData.name)
        }
      }
    }

    getAdminInfo()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
      {/* Menu hambúrguer para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1"></div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <User className="h-4 w-4 text-green-700" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{adminName}</p>
                <p className="text-xs text-gray-500">{adminEmail}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/admin/perfil")}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/admin/configuracoes")}>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
