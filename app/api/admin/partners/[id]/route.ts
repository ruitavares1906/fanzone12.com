import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Obter dados de um parceiro específico
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { data: partner, error } = await supabaseAdmin
      .from('partners')
      .select(`
        id,
        name,
        email,
        discount_code,
        is_active,
        last_login,
        created_at,
        updated_at,
        user_id
      `)
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Parceiro não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao buscar parceiro' },
        { status: 500 }
      )
    }

    return NextResponse.json({ partner })
  } catch (error: any) {
    console.error('Erro no GET /api/admin/partners/[id]:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar parceiro
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const { name, email, discount_code, is_active, password } = await request.json()

    // Buscar o parceiro atual
    const { data: currentPartner, error: fetchError } = await supabaseAdmin
      .from('partners')
      .select('user_id, email, discount_code')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Parceiro não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao buscar parceiro' },
        { status: 500 }
      )
    }

    // Verificar se o novo código de desconto já existe (se mudou)
    if (discount_code && discount_code !== currentPartner.discount_code) {
      const { data: existingCode, error: codeError } = await supabaseAdmin
        .from('partners')
        .select('id')
        .eq('discount_code', discount_code)
        .neq('id', resolvedParams.id)
        .single()

      if (codeError && codeError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: 'Erro ao verificar código de desconto' },
          { status: 500 }
        )
      }

      if (existingCode) {
        return NextResponse.json(
          { error: 'Código de desconto já existe' },
          { status: 400 }
        )
      }
    }

    // Verificar se o novo email já existe (se mudou)
    if (email && email !== currentPartner.email) {
      const { data: existingEmail, error: emailError } = await supabaseAdmin
        .from('partners')
        .select('id')
        .eq('email', email)
        .neq('id', resolvedParams.id)
        .single()

      if (emailError && emailError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: 'Erro ao verificar email' },
          { status: 500 }
        )
      }

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email já existe' },
          { status: 400 }
        )
      }
    }

    // Atualizar dados do parceiro
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (discount_code !== undefined) updateData.discount_code = discount_code
    if (is_active !== undefined) updateData.is_active = is_active

    const { data: partner, error: updateError } = await supabaseAdmin
      .from('partners')
      .update(updateData)
      .eq('id', resolvedParams.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar parceiro' },
        { status: 500 }
      )
    }

    // Atualizar senha se fornecida
    if (password && currentPartner.user_id) {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        currentPartner.user_id,
        { password }
      )

      if (passwordError) {
        console.error('Erro ao atualizar senha:', passwordError)
        // Não falhar a operação por causa da senha
      }
    }

    // Atualizar email no Auth se mudou
    if (email && email !== currentPartner.email && currentPartner.user_id) {
      const { error: emailUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        currentPartner.user_id,
        { email }
      )

      if (emailUpdateError) {
        console.error('Erro ao atualizar email no Auth:', emailUpdateError)
        // Não falhar a operação por causa do email
      }
    }

    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        discount_code: partner.discount_code,
        email: partner.email,
        is_active: partner.is_active,
        last_login: partner.last_login,
        created_at: partner.created_at,
        updated_at: partner.updated_at,
      }
    })
  } catch (error: any) {
    console.error('Erro no PUT /api/admin/partners/[id]:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar parceiro
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    // Buscar o parceiro para obter o user_id
    const { data: partner, error: fetchError } = await supabaseAdmin
      .from('partners')
      .select('user_id, name')
      .eq('id', resolvedParams.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Parceiro não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao buscar parceiro' },
        { status: 500 }
      )
    }

    // Deletar o parceiro da tabela
    const { error: deleteError } = await supabaseAdmin
      .from('partners')
      .delete()
      .eq('id', resolvedParams.id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Erro ao deletar parceiro' },
        { status: 500 }
      )
    }

    // Deletar o usuário do Auth (se existir)
    if (partner.user_id) {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
        partner.user_id
      )

      if (authDeleteError) {
        console.error('Erro ao deletar usuário do Auth:', authDeleteError)
        // Não falhar a operação por causa do Auth
      }
    }

    return NextResponse.json({
      success: true,
      message: `Parceiro ${partner.name} deletado com sucesso`
    })
  } catch (error: any) {
    console.error('Erro no DELETE /api/admin/partners/[id]:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
