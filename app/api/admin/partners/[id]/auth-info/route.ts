import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Obter informações de autenticação do parceiro
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const partnerId = resolvedParams.id

    if (!partnerId) {
      return NextResponse.json(
        { error: 'ID do parceiro é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar informações do parceiro
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('user_id, email, name')
      .eq('id', partnerId)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }

    if (!partner.user_id) {
      return NextResponse.json(
        { error: 'Parceiro não tem conta de autenticação' },
        { status: 404 }
      )
    }

    // Buscar informações do usuário no Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(partner.user_id)

    if (userError) {
      console.error('Erro ao buscar usuário:', userError)
      return NextResponse.json(
        { error: 'Erro ao buscar informações de autenticação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      authInfo: {
        userId: userData.user.id,
        email: userData.user.email,
        emailConfirmed: userData.user.email_confirmed_at ? true : false,
        lastSignIn: userData.user.last_sign_in_at,
        createdAt: userData.user.created_at,
        updatedAt: userData.user.updated_at,
        // Nota: A senha não pode ser recuperada por segurança
        hasPassword: true, // Assumimos que tem senha se o usuário existe
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar informações de autenticação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Alterar senha do parceiro
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const partnerId = resolvedParams.id
    const { newPassword } = await request.json()

    if (!partnerId) {
      return NextResponse.json(
        { error: 'ID do parceiro é obrigatório' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Buscar informações do parceiro
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
      .select('user_id, email, name')
      .eq('id', partnerId)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado' },
        { status: 404 }
      )
    }

    if (!partner.user_id) {
      return NextResponse.json(
        { error: 'Parceiro não tem conta de autenticação' },
        { status: 404 }
      )
    }

    // Atualizar senha no Supabase Auth
    const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
      partner.user_id,
      { password: newPassword }
    )

    if (passwordError) {
      console.error('Erro ao atualizar senha:', passwordError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
