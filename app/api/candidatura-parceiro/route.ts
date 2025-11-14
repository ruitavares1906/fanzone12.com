import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuração do Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_FROM = process.env.MAILGUN_FROM || 'noreply@fanzone12.pt'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'geral@fanzone12.pt'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando processamento de candidatura...')
    const body = await request.json()
    console.log('📋 Dados recebidos:', { nome: body.nome, email: body.email })
    
    const {
      nome,
      email,
      telefone,
      instagram,
      tiktok,
      seguidores,
      visualizacoes,
      experiencia,
      motivacao
    } = body

    // Validar dados obrigatórios
    if (!nome || !email || !telefone || !seguidores || !visualizacoes || !motivacao) {
      return NextResponse.json(
        { success: false, message: 'Dados obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Validar número de seguidores
    if (parseInt(seguidores) < 5000) {
      return NextResponse.json(
        { success: false, message: 'Mínimo de 5.000 seguidores necessário' },
        { status: 400 }
      )
    }

    // Validar pelo menos uma rede social
    if (!instagram && !tiktok) {
      return NextResponse.json(
        { success: false, message: 'Deve preencher pelo menos uma rede social' },
        { status: 400 }
      )
    }

    // Inserir na base de dados
    console.log('🗄️ Inserindo candidatura no Supabase...')
    
    const { data, error } = await supabase
      .from('candidaturas_parceiros')
      .insert({
        nome,
        email,
        telefone,
        instagram: instagram || null,
        tiktok: tiktok || null,
        seguidores: parseInt(seguidores),
        visualizacoes: parseInt(visualizacoes),
        experiencia: experiencia || null,
        motivacao,
        status: 'pendente'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao inserir candidatura:', error)
      throw new Error(`Erro na base de dados: ${error.message}`)
    }

    const candidaturaId = data.id
    console.log('✅ Candidatura inserida com ID:', candidaturaId)

    // Enviar email de notificação
    console.log('📧 Enviando email de notificação...')
    await sendNotificationEmail({
      candidaturaId,
      nome,
      email,
      telefone,
      instagram,
      tiktok,
      seguidores,
      visualizacoes,
      experiencia,
      motivacao
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Candidatura enviada com sucesso',
      candidaturaId 
    })

  } catch (error) {
    console.error('Erro ao processar candidatura:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

async function sendNotificationEmail(data: any) {
  try {
    const formData = new FormData()
    formData.append('from', MAILGUN_FROM)
    formData.append('to', ADMIN_EMAIL)
    formData.append('subject', `Nova Candidatura de Parceiro - ${data.nome}`)
    
    const emailBody = `
      <h2>Nova Candidatura de Parceiro</h2>
      <p><strong>ID da Candidatura:</strong> ${data.candidaturaId}</p>
      
      <h3>Informações Pessoais:</h3>
      <ul>
        <li><strong>Nome:</strong> ${data.nome}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Telefone:</strong> ${data.telefone}</li>
      </ul>
      
      <h3>Redes Sociais:</h3>
      <ul>
        <li><strong>Instagram:</strong> ${data.instagram || 'Não preenchido'}</li>
        <li><strong>TikTok:</strong> ${data.tiktok || 'Não preenchido'}</li>
        <li><strong>Seguidores:</strong> ${data.seguidores.toLocaleString()}</li>
        <li><strong>Visualizações Médias:</strong> ${data.visualizacoes.toLocaleString()}</li>
      </ul>
      
      <h3>Experiência:</h3>
      <p>${data.experiencia || 'Não preenchido'}</p>
      
      <h3>Motivação:</h3>
      <p>${data.motivacao}</p>
      
      <hr>
      <p><em>Esta candidatura foi enviada através do site Fanzone12.</em></p>
    `
    
    formData.append('html', emailBody)
    
    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Mailgun error: ${response.statusText}`)
    }
    
    console.log('Email de notificação enviado com sucesso')
    
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    // Não falhar a candidatura se o email falhar
  }
}
