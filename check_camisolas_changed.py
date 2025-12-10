import re

# Ler o arquivo
with open('lib/products.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Procurar produtos que não são sneakers mas podem ter sido alterados
# Vamos verificar camisolas que têm preço acima de 30 e precoAntigo 29.99 (sinal de que algo está errado)
camisolas_problematicas = []

i = 0
while i < len(lines):
    line = lines[i]
    
    # Procurar precoAntigo: 29.99
    if 'precoAntigo: 29.99' in line or '"precoAntigo": 29.99' in line:
        # Verificar se é uma camisola (não sneaker)
        start_search = max(0, i - 50)
        end_search = min(len(lines), i + 10)
        
        product_text = '\n'.join(lines[start_search:end_search])
        
        # Verificar se não é sneaker
        is_sneaker = (
            'subcategoria: "sneakers"' in product_text or
            '"subcategoria": "sneakers"' in product_text
        )
        
        if not is_sneaker:
            # Encontrar o preço atual
            price_match = re.search(r'["\']?preco["\']?\s*:\s*(\d+\.?\d*)', product_text)
            if price_match:
                current_price = float(price_match.group(1))
                old_price_line = i
                
                # Encontrar nome
                nome_match = re.search(r'["\']?nome["\']?\s*:\s*"([^"]+)"', product_text)
                nome = nome_match.group(1) if nome_match else "Desconhecido"
                
                # Se o preço atual é maior que o precoAntigo, algo está errado
                if current_price > 29.99:
                    camisolas_problematicas.append({
                        'nome': nome,
                        'preco_atual': current_price,
                        'preco_antigo': 29.99,
                        'linha': old_price_line + 1
                    })
    
    i += 1

if camisolas_problematicas:
    print(f"Camisolas que podem ter sido alteradas incorretamente: {len(camisolas_problematicas)}\n")
    for cam in camisolas_problematicas[:20]:  # Mostrar primeiras 20
        print(f"  - {cam['nome']}")
        print(f"    Preço atual: €{cam['preco_atual']:.2f}, Preço antigo: €{cam['preco_antigo']:.2f} (linha {cam['linha']})")
        print()
else:
    print("Nenhuma camisola problemática encontrada.")



