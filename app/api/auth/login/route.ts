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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      redirectTo,
    })
  } catch (error: any) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: error.message || "Ocorreu um erro durante o login" }, { status: 500 })
  }
}
