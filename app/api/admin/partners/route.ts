import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Listar todos os parceiros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    let query = supabaseAdmin
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
      .order('created_at', { ascending: false })

    // Filtro por status
    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    // Filtro por busca
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,discount_code.ilike.%${search}%`)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: partners, error } = await query

    if (error) {
      console.error('Erro ao buscar parceiros:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar parceiros' },
        { status: 500 }
      )
    }

    // Contar total de registros
    let countQuery = supabaseAdmin
      .from('partners')
      .select('*', { count: 'exact', head: true })

    if (status === 'active') {
      countQuery = countQuery.eq('is_active', true)
    } else if (status === 'inactive') {
      countQuery = countQuery.eq('is_active', false)
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,email.ilike.%${search}%,discount_code.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Erro ao contar parceiros:', countError)
    }

    return NextResponse.json({
      partners: partners || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Erro no GET /api/admin/partners:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo parceiro
export async function POST(request: Request) {
  try {
    const { email, password, name, discount_code } = await request.json()

    if (!email || !password || !name || !discount_code) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o código de desconto já existe
    const { data: existingPartner, error: checkError } = await supabaseAdmin
      .from('partners')
      .select('id, discount_code')
      .eq('discount_code', discount_code)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Erro ao verificar código de desconto' },
        { status: 500 }
      )
    }

    if (existingPartner) {
      return NextResponse.json(
        { error: 'Código de desconto já existe' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const { data: existingEmail, error: emailCheckError } = await supabaseAdmin
      .from('partners')
      .select('id, email')
      .eq('email', email)
      .single()

    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
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

    // Criar usuário no Supabase Auth
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
        { error: authError?.message || 'Erro ao criar conta' },
        { status: 400 }
      )
    }

    // Criar registro do parceiro
    const { data: partner, error: partnerError } = await supabaseAdmin
      .from('partners')
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
      // Se falhar ao criar parceiro, tentar remover o usuário criado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Erro ao criar perfil de parceiro' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        discount_code: partner.discount_code,
        email: partner.email,
        is_active: partner.is_active,
      }
    })
  } catch (error: any) {
    console.error('Erro no POST /api/admin/partners:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
