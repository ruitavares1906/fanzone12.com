// Additional email functions for fanzone12.com
import FormData from 'form-data'

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || ""
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || ""
const MAILGUN_FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "sales@fanzone12.com"

// Payment Failed Email
export async function sendPaymentFailedEmail(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
  amount: number
  paymentMethod?: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 28px;">⚠️ Payment Failed</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              We were unable to process the payment for your order #${data.orderNumber}.
            </p>
          </div>

          <div style="background-color: #fef2f2; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #dc2626;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> #${data.orderNumber}</p>
            <p style="margin: 5px 0;"><strong>Amount:</strong> ${data.amount.toFixed(2)}€</p>
            ${data.paymentMethod ? `<p style="margin: 5px 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>` : ''}
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">What to do next?</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Check your payment method details</li>
              <li>Ensure you have sufficient funds</li>
              <li>Try placing the order again</li>
              <li>Contact your bank if the issue persists</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.fanzone12.com/contacto" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Contact Support
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              If you have any questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `⚠️ Payment Failed - Order #${data.orderNumber} - fanzone12.com`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de pagamento falhado:", error)
    throw error
  }
}

// Order Delivered Email
export async function sendOrderDeliveredEmail(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
  deliveryDate?: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0; font-size: 28px;">✅ Order Delivered!</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              Great news! Your order #${data.orderNumber} has been successfully delivered!
            </p>
          </div>

          <div style="background-color: #d1fae5; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Delivery Confirmed</h3>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> #${data.orderNumber}</p>
            ${data.deliveryDate ? `<p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${data.deliveryDate}</p>` : ''}
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">We hope you love your purchase!</h3>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              If you're happy with your order, we'd love to hear from you! Your feedback helps us improve.
            </p>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.fanzone12.com" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Shop Again
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Thank you for choosing fanzone12.com!
            </p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
              For questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `✅ Order #${data.orderNumber} Delivered - fanzone12.com`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de entrega:", error)
    throw error
  }
}

// Order Cancelled Email
export async function sendOrderCancelledEmail(data: {
  orderNumber: string
  customerName: string
  customerEmail: string
  reason?: string
  refundAmount?: number
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 28px;">❌ Order Cancelled</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              We're sorry to inform you that your order #${data.orderNumber} has been cancelled.
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> #${data.orderNumber}</p>
            ${data.reason ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${data.reason}</p>` : ''}
            ${data.refundAmount ? `<p style="margin: 5px 0;"><strong>Refund Amount:</strong> ${data.refundAmount.toFixed(2)}€</p>` : ''}
          </div>

          ${data.refundAmount ? `
          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Refund Information</h3>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              If a payment was made, a refund of ${data.refundAmount.toFixed(2)}€ will be processed to your original payment method. 
              This may take 5-10 business days to appear in your account.
            </p>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 25px 0;">
            <a href="https://www.fanzone12.com/contacto" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Contact Support
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              If you have any questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `❌ Order #${data.orderNumber} Cancelled - fanzone12.com`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de cancelamento:", error)
    throw error
  }
}

// Password Reset Email
export async function sendPasswordResetEmail(data: {
  customerName: string
  customerEmail: string
  resetToken: string
  resetUrl: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              This link will expire in 1 hour for security reasons.
            </p>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="${data.resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background-color: #fef2f2; padding: 15px; margin-bottom: 25px; border-radius: 6px;">
            <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              For questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `🔐 Password Reset Request - fanzone12.com`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de reset de senha:", error)
    throw error
  }
}

// Account Created Email
export async function sendAccountCreatedEmail(data: {
  customerName: string
  customerEmail: string
  loginUrl?: string
}) {
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0; font-size: 28px;">🎉 Welcome to fanzone12.com!</h1>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Hello ${data.customerName}!</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              Thank you for creating an account with us! We're excited to have you as part of the fanzone12.com family.
            </p>
          </div>

          <div style="background-color: #d1fae5; padding: 20px; margin-bottom: 25px; border-radius: 6px; border-left: 4px solid #10b981;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">Your account is ready!</h3>
            <p style="color: #6b7280; margin: 0; line-height: 1.6;">
              You can now start shopping and enjoy exclusive benefits:
            </p>
            <ul style="color: #6b7280; margin: 10px 0 0 0; padding-left: 20px; line-height: 1.6;">
              <li>Track your orders</li>
              <li>Save your favorite products</li>
              <li>Faster checkout</li>
              <li>Exclusive offers and discounts</li>
            </ul>
          </div>

          ${data.loginUrl ? `
          <div style="text-align: center; margin: 25px 0;">
            <a href="${data.loginUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Start Shopping
            </a>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Thank you for choosing fanzone12.com!
            </p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
              For questions, contact us at <a href="mailto:sales@fanzone12.com">sales@fanzone12.com</a>
            </p>
          </div>
        </div>
      </div>
    `

    const formData = new FormData()
    formData.append('from', `Fanzone12.com <${MAILGUN_FROM_EMAIL}>`)
    formData.append('to', data.customerEmail)
    formData.append('subject', `🎉 Welcome to fanzone12.com!`)
    formData.append('html', emailHtml)

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar email de criação de conta:", error)
    throw error
  }
}

