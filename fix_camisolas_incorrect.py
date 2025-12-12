import re

# Ler o arquivo
with open('lib/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed_count = 0
products_fixed = []

# Procurar camisolas que foram alteradas incorretamente
# Camisolas normais têm preço 17.99, não devem ter sido alteradas
i = 0
while i < len(lines):
    line = lines[i]
    
    # Procurar preços que parecem ter sido alterados incorretamente
    # Camisolas que têm precoAntigo: 29.99 mas preço atual acima de 24.99
    if 'precoAntigo: 29.99' in line or '"precoAntigo": 29.99' in line:
        # Verificar se é uma camisola (não sneaker)
        start_search = max(0, i - 80)
        end_search = min(len(lines), i + 10)
        
        product_text = '\n'.join(lines[start_search:end_search])
        
        # Verificar se NÃO é sneaker
        is_sneaker = (
            'subcategoria: "sneakers"' in product_text or
            '"subcategoria": "sneakers"' in product_text
        )
        
        if not is_sneaker:
            # Encontrar o preço atual
            price_match = None
            price_line_idx = None
            
            for j in range(start_search, end_search):
                if '"preco":' in lines[j] or 'preco:' in lines[j]:
                    match = re.search(r'["\']?preco["\']?\s*:\s*(\d+\.?\d*)', lines[j], re.IGNORECASE)
                    if match:
                        price_match = match
                        price_line_idx = j
                        break
            
            if price_match and price_line_idx:
                current_price = float(price_match.group(1))
                
                # Se o preço está acima de 24.99, provavelmente foi alterado incorretamente
                # Camisolas normais têm preço 17.99
                if current_price > 24.99:
                    # Encontrar nome
                    nome = "Desconhecido"
                    for j in range(start_search, end_search):
                        nome_match = re.search(r'["\']?nome["\']?\s*:\s*"([^"]+)"', lines[j], re.IGNORECASE)
                        if nome_match:
                            nome = nome_match.group(1)
                            break
                    
                    # Restaurar para 17.99 (preço padrão de camisolas)
                    old_price = current_price
                    lines[price_line_idx] = re.sub(
                        r'(["\']?preco["\']?\s*:\s*)(\d+\.?\d*)',
                        r'\g<1>17.99',
                        lines[price_line_idx],
                        flags=re.IGNORECASE
                    )
                    
                    fixed_count += 1
                    products_fixed.append({
                        'nome': nome,
                        'old_price': old_price,
                        'new_price': 17.99,
                        'linha': price_line_idx + 1
                    })
                    print(f"✓ Corrigido: {nome}")
                    print(f"  €{old_price:.2f} -> €17.99 (linha {price_line_idx + 1})")
    
    i += 1

# Escrever o arquivo corrigido
if fixed_count > 0:
    with open('lib/products.ts', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"\n{'='*70}")
    print(f"Total de camisolas corrigidas: {fixed_count}")
    print(f"{'='*70}")
else:
    print("\nNenhuma camisola precisa ser corrigida.")





