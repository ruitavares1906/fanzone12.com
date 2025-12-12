import re

# Verificar a camisola Sporting CP Away Jersey 25/26 especificamente
with open('lib/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Encontrar a camisola
for i, line in enumerate(lines):
    if 'sporting-alternativa-branca-2526' in line:
        # Mostrar contexto ao redor
        start = max(0, i - 5)
        end = min(len(lines), i + 20)
        
        print(f"Camisola encontrada na linha {i + 1}:\n")
        for j in range(start, end):
            marker = ">>>" if j == i else "   "
            print(f"{marker} {j + 1:5d}: {lines[j].rstrip()}")
        
        # Verificar preço
        product_text = '\n'.join(lines[start:end])
        price_match = re.search(r'["\']?preco["\']?\s*:\s*(\d+\.?\d*)', product_text, re.IGNORECASE)
        old_price_match = re.search(r'["\']?precoAntigo["\']?\s*:\s*(\d+\.?\d*)', product_text, re.IGNORECASE)
        
        if price_match and old_price_match:
            current = float(price_match.group(1))
            old = float(old_price_match.group(1))
            print(f"\nPreço atual: €{current:.2f}")
            print(f"Preço antigo: €{old:.2f}")
            print(f"Diferença: €{current - old:.2f}")
        
        break





