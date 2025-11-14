import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Criar um cliente de teste
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        first_name: "Cliente",
        last_name: "Teste",
        email: "cliente.teste@exemplo.com",
        phone: "+351 912 345 678",
        address: {
          street: "Rua de Teste, 123",
          city: "Lisboa",
          postal_code: "1000-001",
          country: "Portugal",
        },
      })
      .select()
      .single()

    if (customerError) {
      throw customerError
    }

    // Criar uma encomenda de teste
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        email: "cliente.teste@exemplo.com",
        status: "pending",
        total: 149.97,
        items: [
          {
            product_id: 1,
            name: "Camisola Sporting 2024/25",
            price: 89.99,
            quantity: 1,
            options: {
              size: "M",
              name: "POTE",
              number: "8",
            },
          },
          {
            product_id: 5,
            name: "Camisola Portugal 2024",
            price: 59.98,
            quantity: 1,
            options: {
              size: "L",
            },
          },
        ],
        shipping_address: {
          name: "Cliente Teste",
          street: "Rua de Teste, 123",
          city: "Lisboa",
          postal_code: "1000-001",
          country: "Portugal",
        },
        shipping_method: "CTT",
        shipping_cost: 4.99,
        payment_method: "Multibanco",
        payment_details: {
          entity: "12345",
          reference: "123 456 789",
          amount: "149.97",
        },
        notes: "Encomenda de teste criada automaticamente",
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    return NextResponse.json({
      success: true,
      message: "Encomenda de teste criada com sucesso",
      order,
    })
  } catch (error: any) {
    console.error("Erro ao criar encomenda de teste:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar encomenda de teste",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
