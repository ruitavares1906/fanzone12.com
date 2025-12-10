import re

# Ler o arquivo
with open('lib/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Lista de produtos que foram alterados e não são sneakers
changed_products = []

i = 0
while i < len(lines):
    line = lines[i]
    
    # Procurar produtos que têm precoAntigo: 29.99 mas que não são sneakers
    if 'precoAntigo: 29.99' in line or '"precoAntigo": 29.99' in line:
        start_search = max(0, i - 80)
        end_search = min(len(lines), i + 10)
        
        product_text = '\n'.join(lines[start_search:end_search])
        
        # Verificar se NÃO é sneaker
        is_sneaker = (
            'subcategoria: "sneakers"' in product_text or
            '"subcategoria": "sneakers"' in product_text
        )
        
        if not is_sneaker:
            # Encontrar informações
            nome = "Desconhecido"
            for j in range(start_search, end_search):
                nome_match = re.search(r'["\']?nome["\']?\s*:\s*"([^"]+)"', lines[j], re.IGNORECASE)
                if nome_match:
                    nome = nome_match.group(1)
                    break
            
            # Encontrar preço atual
            price_match = re.search(r'["\']?preco["\']?\s*:\s*(\d+\.?\d*)', product_text, re.IGNORECASE)
            current_price = float(price_match.group(1)) if price_match else None
            
            # Verificar categoria
            categoria = None
            cat_match = re.search(r'["\']?categoria["\']?\s*:\s*"([^"]+)"', product_text, re.IGNORECASE)
            if cat_match:
                categoria = cat_match.group(1)
            
            if current_price:
                changed_products.append({
                    'nome': nome,
                    'preco': current_price,
                    'categoria': categoria,
                    'linha': i + 1
                })
    
    i += 1

print(f"Produtos não-sneakers com precoAntigo 29.99: {len(changed_products)}\n")
for prod in changed_products[:20]:
    print(f"  - {prod['nome']}")
    print(f"    Preço atual: €{prod['preco']:.2f}, Categoria: {prod['categoria']}")
    print(f"    Linha: {prod['linha']}")
    print()




