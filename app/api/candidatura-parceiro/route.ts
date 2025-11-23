import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Configuração do Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_FROM = 'sales@fanzone12.com'
const ADMIN_EMAIL = 'sales@fanzone12.com'

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
        { success: false, message: 'Required data missing' },
        { status: 400 }
      )
    }

    // Validar número de seguidores
    if (parseInt(seguidores) < 5000) {
      return NextResponse.json(
        { success: false, message: 'Minimum of 5,000 followers required' },
        { status: 400 }
      )
    }

    // Validar pelo menos uma rede social
    if (!instagram && !tiktok) {
      return NextResponse.json(
        { success: false, message: 'You must fill at least one social network' },
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
      message: 'Application submitted successfully',
      candidaturaId 
    })

  } catch (error) {
    console.error('Erro ao processar candidatura:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
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
    formData.append('subject', `New Partner Application - ${data.nome}`)
    
    const emailBody = `
      <h2>New Partner Application</h2>
      <p><strong>Application ID:</strong> ${data.candidaturaId}</p>
      
      <h3>Personal Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.nome}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.telefone}</li>
      </ul>
      
      <h3>Social Media:</h3>
      <ul>
        <li><strong>Instagram:</strong> ${data.instagram || 'Not provided'}</li>
        <li><strong>TikTok:</strong> ${data.tiktok || 'Not provided'}</li>
        <li><strong>Followers:</strong> ${data.seguidores.toLocaleString()}</li>
        <li><strong>Average Views:</strong> ${data.visualizacoes.toLocaleString()}</li>
      </ul>
      
      <h3>Experience:</h3>
      <p>${data.experiencia || 'Not provided'}</p>
      
      <h3>Motivation:</h3>
      <p>${data.motivacao}</p>
      
      <hr>
      <p><em>This application was submitted through the Fanzone12 website.</em></p>
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
