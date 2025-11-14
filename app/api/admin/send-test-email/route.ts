import { NextResponse } from "next/server"
import Mailgun from 'mailgun.js'
import FormData from 'form-data'
import { sendOrderConfirmationEmail } from "@/lib/mailgun"

// Configurar o cliente Mailgun
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ""
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "geral@fanzone12.pt"

// Função para criar cliente Mailgun
function createMailgunClient() {
  const mailgun = new Mailgun(FormData)
  return mailgun.client({
    username: 'api',
    key: MAILGUN_API_KEY,
  })
}

export async function POST(request: Request) {
  try {
    const { email, testOrderEmail } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email é obrigatório" },
        { status: 400 }
      )
    }
    
    // Verificar se a API key está configurada
    if (!MAILGUN_API_KEY || MAILGUN_API_KEY === "" || MAILGUN_API_KEY === "your_mailgun_api_key_here" || 
        !MAILGUN_DOMAIN || MAILGUN_DOMAIN === "" || MAILGUN_DOMAIN === "your_mailgun_domain_here") {
      return NextResponse.json(
        { 
          success: false, 
          error: "API Key ou Domain do Mailgun não estão configurados corretamente" 
        },
        { status: 500 }
      )
    }
    
    // Se for teste de email de encomenda, usar a função específica
    if (testOrderEmail) {
      try {
        await sendOrderConfirmationEmail({
          orderNumber: "TEST001",
          customerName: "João Silva",
          customerEmail: email,
          orderDate: new Date().toLocaleDateString("pt-PT"),
          items: [
            {
              name: "Camisola Sporting CP 2024/25",
              price: 59.99,
              quantity: 1,
              size: "M",
              customization: "SILVA 10"
            },
            {
              name: "Calções Sporting CP 2024/25", 
              price: 29.99,
              quantity: 1,
              size: "M"
            }
          ],
          subtotal: 89.98,
          shipping: 3.99,
          total: 94.98,
          shippingAddress: {
            name: "João Silva",
            address: "Rua das Flores, 123, 2º Andar, Porta B",
            city: "Lisboa",
            postalCode: "1000-001",
            country: "Portugal"
          }
        })
        
        return NextResponse.json({
          success: true,
          message: `Email de teste de encomenda enviado para ${email}. Verifique também geral@fanzone12.pt.pt para ver o email da loja com a morada.`
        })
      } catch (error: any) {
        console.error("Erro ao enviar email de teste de encomenda:", error)
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }
    }
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.fanzone12.pt.pt"
    
    const emailData = {
      from: MAILGUN_FROM_EMAIL,
      to: email,
      subject: "Email de Teste - fanzone12.pt",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background-color: #fafafa; padding: 40px;">
          <div style="background-color: white; border: 1px solid #e0e0e0; padding: 40px; text-align: center;">
            <div style="width: 60px; height: 60px; background-color: #2ecc71; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 30px; color: white;">
              ✓
            </div>
            
            <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 26px; font-weight: normal;">Teste de Email</h1>
            <p style="color: #7f8c8d; margin: 0 0 30px 0; font-size: 16px;">Sistema fanzone12.pt</p>
            
            <div style="background-color: #ecf0f1; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: left;">
              <p style="font-size: 16px; margin: 0 0 15px 0; color: #2c3e50;">Este é um email de teste do sistema fanzone12.pt.</p>
              <p style="font-size: 16px; margin: 0 0 20px 0; color: #34495e;">Se você está recebendo este email, significa que a configuração do Mailgun está funcionando corretamente.</p>
            
              <div style="background-color: white; border-radius: 6px; padding: 20px; border-left: 4px solid #2ecc71;">
                <p style="margin: 5px 0; font-size: 14px; color: #7f8c8d;"><strong>Data do teste:</strong> ${new Date().toLocaleString("pt-PT")}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #7f8c8d;"><strong>Email de destino:</strong> ${email}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #7f8c8d;"><strong>Status:</strong> <span style="color: #2ecc71; font-weight: bold;">✅ Funcionando</span></p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #ecf0f1; padding-top: 25px; margin-top: 30px; font-size: 14px; color: #7f8c8d;">
              <p style="margin: 5px 0;">Este é um email automático de teste. Se você não esperava receber este email, pode ignorá-lo com segurança.</p>
              <p style="margin: 15px 0 5px 0;">📧 <a href="mailto:geral@fanzone12.pt.pt" style="color: #3498db; text-decoration: none;">geral@fanzone12.pt.pt</a></p>
              <p style="margin: 5px 0;">🌐 <a href="${siteUrl}" style="color: #3498db; text-decoration: none;">fanzone12.pt.pt</a></p>
              <p style="margin: 20px 0 0 0; font-size: 12px; color: #95a5a6;">© ${new Date().getFullYear()} fanzone12.pt. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      `,
      text: `
        Email de Teste - fanzone12.pt
        
        Este é um email de teste do sistema fanzone12.pt.
        Se você está recebendo este email, significa que a configuração do Mailgun está funcionando corretamente.
        
        Data do teste: ${new Date().toLocaleString("pt-PT")}
        Email de destino: ${email}
        Status: ✅ Funcionando
        
        Este é um email automático de teste. Se você não esperava receber este email, pode ignorá-lo com segurança.
        
        Para dúvidas, contacte-nos através de geral@fanzone12.pt.pt.
        
        © ${new Date().getFullYear()} fanzone12.pt. Todos os direitos reservados.
        fanzone12.pt.pt
      `
    }
    
    const mg = createMailgunClient()
    await mg.messages.create(MAILGUN_DOMAIN, emailData)
    
    return NextResponse.json({ 
      success: true, 
      message: `Email de teste enviado com sucesso para ${email}` 
    })
    
  } catch (error: any) {
    console.error("Erro ao enviar email de teste:", error)
    
    if (error.message) {
      console.error("Mailgun Error:", error.message)
      return NextResponse.json(
        { 
          success: false, 
          error: `Erro do Mailgun: ${error.message}` 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}