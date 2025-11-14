import { NextResponse } from "next/server"

// Códigos de desconto disponíveis (em produção, isso deveria vir de uma base de dados)
const discountCodes = {
  "DESCONTO10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "DESCONTO15": {
    type: "percentage", 
    value: 15,
    description: "15% de desconto",
    minAmount: 50,
    maxUses: null,
    active: true
  },
  "DESCONTO5EUR": {
    type: "fixed",
    value: 5,
    description: "5€ de desconto",
    minAmount: 25,
    maxUses: null,
    active: true
  },
  "BEMVINDO": {
    type: "percentage",
    value: 20,
    description: "20% de desconto de boas-vindas",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "CAMISOLA12": {
    type: "percentage",
    value: 10,
    description: "10% de desconto fanzone12",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "JORGECIPRIANO1971": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Jorge Cipriano",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "CONSTANCA10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Constança",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "NANA10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Nana",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "MATILDE10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Matilde",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "GI10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Gi",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "DIIGUEDESS10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Diiguedes",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "DANYM10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Danym",
    minAmount: 0,
    maxUses: null,
    active: true
  },
  "LAROCAS10": {
    type: "percentage",
    value: 10,
    description: "10% de desconto Larocas",
    minAmount: 0,
    maxUses: null,
    active: true
  }
}

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Código de desconto é obrigatório" }, { status: 400 })
    }

    const discount = discountCodes[code.toUpperCase() as keyof typeof discountCodes]

    if (!discount) {
      return NextResponse.json({ error: "Código de desconto inválido" }, { status: 400 })
    }

    if (!discount.active) {
      return NextResponse.json({ error: "Código de desconto expirado" }, { status: 400 })
    }

    if (subtotal < discount.minAmount) {
      return NextResponse.json({ 
        error: `Valor mínimo de €${discount.minAmount} necessário para usar este código` 
      }, { status: 400 })
    }

    let discountAmount = 0
    if (discount.type === "percentage") {
      discountAmount = (subtotal * discount.value) / 100
    } else {
      discountAmount = discount.value
    }

    // Garantir que o desconto não seja maior que o subtotal
    discountAmount = Math.min(discountAmount, subtotal)

    return NextResponse.json({
      valid: true,
      code: code.toUpperCase(),
      type: discount.type,
      value: discount.value,
      description: discount.description,
      discountAmount: discountAmount,
      discountPercentage: discount.type === "percentage" ? discount.value : 0
    })

  } catch (error) {
    console.error("Erro ao validar código de desconto:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
} 