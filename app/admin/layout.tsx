"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import AdminSidebar from "@/components/admin-sidebar"
import AdminHeader from "@/components/admin-header"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Não verificar em páginas públicas do admin
        if (pathname === "/admin/login" || pathname === "/admin/setup") {
          setLoading(false)
          return
        }

        // Verificar se o usuário está autenticado
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          throw new Error("Não autenticado")
        }

        // Verificar se a tabela admin_users existe
        const { error: tableError } = await supabase.from("admin_users").select("count").limit(1).single()

        // Se a tabela não existir, redirecionar para setup
        if (tableError && tableError.code === "PGRST116") {
          console.log("Tabela admin_users não existe, redirecionando para setup")
          router.push("/admin/setup")
          return
        }

        // Verificar se o usuário é um administrador
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (adminError || !adminUser) {
          throw new Error("Não é administrador")
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Erro ao verificar administrador:", error)
        // Não redirecionar se já estiver na página de login ou setup
        if (!pathname.includes("/admin/login") && !pathname.includes("/admin/setup")) {
          router.push("/admin/login")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [pathname, router, supabase])

  // Não mostrar nada durante a verificação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-lg font-medium">Verificando acesso...</span>
      </div>
    )
  }

  // Se estiver na página de login ou setup, mostrar apenas o conteúdo sem o layout
  if (pathname.includes("/admin/login") || pathname.includes("/admin/setup")) {
    return <>{children}</>
  }

  // Se não for admin e não estiver na página de login ou setup, não mostrar nada
  if (!isAdmin && !pathname.includes("/admin/login") && !pathname.includes("/admin/setup")) {
    return null
  }

  // Layout para usuários autenticados como admin
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
