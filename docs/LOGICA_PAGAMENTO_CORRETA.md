# 💰 Lógica de Pagamento à Cobrança - CORRETA

## ✅ **Regra Principal:**
**Os 8€ são SEMPRE adicionados ao total para pagamento à cobrança**

## 📊 **Exemplo do seu caso:**

### **Dados de entrada:**
- Subtotal: 75.96€
- Promoção: -17.99€
- Subtotal com desconto: 57.97€
- Envio: Grátis (3+ produtos)
- **Taxa à cobrança: 8.00€** ← SEMPRE adicionada
- **Total: 65.97€** ← 57.97€ + 8€

### **Para produtos personalizados:**
```
Total: 65.97€
├── Pagamento antecipado: 8.00€ (pago agora)
└── Restante à cobrança: 57.97€ (pago à cobrança)
```

### **Para produtos normais:**
```
Total: 65.97€
├── Pagamento antecipado: 0€
└── Restante à cobrança: 65.97€ (tudo pago à cobrança)
```

## 🎯 **Diferença:**

- **Produtos personalizados**: 8€ pagos antecipadamente + restante à cobrança
- **Produtos normais**: Tudo pago à cobrança (incluindo os 8€)

## ✅ **A lógica está correta!**

O hook `use-cart-payment.ts` está a funcionar corretamente:
- ✅ Taxa de 8€ sempre adicionada ao total
- ✅ Para personalizados: 8€ antecipado + restante à cobrança  
- ✅ Para normais: tudo à cobrança
