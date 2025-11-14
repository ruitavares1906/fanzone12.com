import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar se a API key está configurada
    const apiKey = process.env.SENDGRID_API_KEY
    
    const hasApiKey = !!(apiKey && apiKey !== "" && apiKey !== "SUA_API_KEY_SENDGRID")
    
    let message = ""
    if (!hasApiKey) {
      if (!apiKey) {
        message = "Variável SENDGRID_API_KEY não está definida"
      } else if (apiKey === "SUA_API_KEY_SENDGRID") {
        message = "SENDGRID_API_KEY ainda está com o valor padrão/placeholder"
      } else if (apiKey === "") {
        message = "SENDGRID_API_KEY está vazia"
      }
    } else {
      message = `API Key configurada (${apiKey.substring(0, 10)}...)`
    }
    
    // Verificar outras variáveis relevantes
    const nodeEnv = process.env.NODE_ENV
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    
    return NextResponse.json({
      hasApiKey,
      message,
      details: {
        nodeEnv,
        siteUrl,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : "N/A"
      }
    })
  } catch (error: any) {
    console.error("Erro ao verificar configuração:", error)
    return NextResponse.json(
      { 
        hasApiKey: false, 
        message: "Erro ao verificar configuração",
        error: error.message 
      }, 
      { status: 500 }
    )
  }
} 