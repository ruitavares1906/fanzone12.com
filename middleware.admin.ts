import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Ignorar rotas específicas
  const publicRoutes = ["/admin/login", "/admin/setup-rapido"]
  if (publicRoutes.some((route) => req.nextUrl.pathname === route)) {
    return NextResponse.next()
  }

  // Criar um cliente Supabase específico para o middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Redirecionar para o login se não estiver autenticado
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // Verificar se o usuário é um administrador
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (error || !adminUser) {
      // Fazer logout e redirecionar para o login se não for um administrador
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", req.url))
    }

    // Atualizar último login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", adminUser.id)

    return res
  } catch (error) {
    console.error("Erro no middleware de admin:", error)
    return NextResponse.redirect(new URL("/admin/login?error=server", req.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
