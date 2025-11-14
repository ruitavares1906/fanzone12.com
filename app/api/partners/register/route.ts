import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

// POST - Registro de novo parceiro
export async function POST(request: Request) {
  try {
    const { email, password, name, discount_code } = await request.json()

    if (!email || !password || !name || !discount_code) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se o código de desconto já existe
    const { data: existingPartner, error: checkError } = await supabaseAdmin
      .from("partners")
      .select("id, discount_code")
      .eq("discount_code", discount_code)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json(
        { error: "Erro ao verificar código de desconto" },
        { status: 500 }
      )
    }

    if (existingPartner) {
      return NextResponse.json(
        { error: "Código de desconto já existe" },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth usando admin para confirmar automaticamente
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name,
        discount_code,
        is_partner: true
      }
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Erro ao criar conta" },
        { status: 400 }
      )
    }

    // Criar registro do parceiro
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .insert({
        user_id: authData.user.id,
        name,
        discount_code,
        email,
        is_active: true,
      })
      .select()
      .single()

    if (partnerError) {
      console.error("Erro ao criar parceiro:", partnerError)
      console.error("Dados enviados:", {
        user_id: authData.user.id,
        name,
        discount_code,
        email,
        is_active: true,
      })
      
      // Se falhar ao criar parceiro, tentar remover o usuário criado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { 
          error: "Erro ao criar perfil de parceiro",
          details: partnerError.message,
          code: partnerError.code
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Parceiro registrado com sucesso",
      partner: {
        id: partner.id,
        name: partner.name,
        discount_code: partner.discount_code,
        email: partner.email,
      }
    })
  } catch (error: any) {
    console.error("Erro no registro do parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

