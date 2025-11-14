import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const redirectTo = (formData.get("redirectTo") as string) || "/conta"

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Erro no login:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Verificar se a sessão foi criada
    const sessionCheck = await supabase.auth.getSession()

    // Criar uma resposta com cookie de sessão
    const response = NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
      sessionCheck: sessionCheck.data,
      redirectTo,
    })

    // Definir cookie de sessão manualmente (redundância)
    if (data.session) {
      response.cookies.set(
        "supabase-auth-token",
        JSON.stringify([data.session.access_token, data.session.refresh_token]),
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 1 semana
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        },
      )
    }

    return response
  } catch (error: any) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: error.message || "Ocorreu um erro durante o login" }, { status: 500 })
  }
}
