import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Criar cliente Supabase com cookies do servidor
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro de autenticação:", error.message)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Definir cookie de sessão manualmente para garantir
    const session = data.session

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      user: data.user,
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at,
      },
    })
  } catch (error: any) {
    console.error("Erro no login:", error)
    return NextResponse.json({ success: false, error: error.message || "Erro desconhecido" }, { status: 500 })
  }
}
