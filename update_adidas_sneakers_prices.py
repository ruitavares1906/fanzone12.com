"""
Script para atualizar preços de ténis Adidas com preço abaixo de 39€ para 39.99€

Este script:

1. Encontra todos os produtos Adidas com subcategoria "sneakers"

2. Verifica se o preço é menor que 39€

3. Atualiza o preço para 39.99€

4. Mantém os produtos com preço >= 39€ inalterados

Uso:

    python update_adidas_sneakers_prices.py

"""

import re
import sys
from pathlib import Path

def update_adidas_sneakers_prices(file_path: str, target_price: float = 39.99, min_price: float = 39.0):
    """
    Atualiza preços de ténis Adidas abaixo de min_price para target_price
    
    Args:
        file_path: Caminho para o ficheiro products.ts
        target_price: Preço para o qual atualizar (padrão: 39.99)
        min_price: Preço mínimo - produtos abaixo deste serão atualizados (padrão: 39.0)
    """
    
    # Verificar se o ficheiro existe
    if not Path(file_path).exists():
        print(f"Erro: Ficheiro {file_path} não encontrado!")
        return False
    
    # Ler o ficheiro
    print(f"A ler ficheiro: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    updated_count = 0
    updated_products = []
    
    print(f"\nProcurando produtos Adidas sneakers com preço < {min_price}€...\n")
    
    # Para cada linha com preço
    for i, line in enumerate(lines):
        # Se encontrar preco
        if '"preco"' in line or 'preco:' in line:
            # Procurar o valor do preço
            price_match = re.search(r'preco["\']?\s*:\s*([0-9]+\.?[0-9]*)', line)
            if price_match:
                price = float(price_match.group(1))
                if price < min_price:
                    # Verificar se é Adidas e sneakers - procurar no contexto (50 linhas para trás e 10 para frente)
                    context_start = max(0, i - 50)
                    context_end = min(len(lines), i + 10)
                    context = '\n'.join(lines[context_start:context_end])
                    
                    # Verificar se tem marca Adidas e subcategoria sneakers
                    has_adidas = ('"marca"' in context or 'marca:' in context) and \
                                ('"Adidas"' in context or '"adidas"' in context or 'marca: "Adidas"' in context or 'marca: "adidas"' in context)
                    has_sneakers = ('"subcategoria"' in context or 'subcategoria:' in context) and '"sneakers"' in context
                    
                    if has_adidas and has_sneakers:
                        # Procurar o nome do produto no contexto
                        product_name = "Produto desconhecido"
                        for j in range(context_start, i):
                            if '"nome"' in lines[j] or 'nome:' in lines[j]:
                                name_match = re.search(r'["\']nome["\']?\s*:\s*["\']([^"\']+)["\']', lines[j])
                                if name_match:
                                    product_name = name_match.group(1)
                                break
                        
                        # Substituir o preço por target_price mantendo o formato original
                        if '"preco"' in line:
                            new_line = re.sub(r'"preco"\s*:\s*[0-9]+\.?[0-9]*', f'"preco": {target_price}', line)
                        else:
                            new_line = re.sub(r'preco\s*:\s*[0-9]+\.?[0-9]*', f'preco: {target_price}', line)
                        
                        lines[i] = new_line
                        updated_count += 1
                        updated_products.append({
                            'line': i + 1,
                            'old_price': price,
                            'name': product_name
                        })
                        print(f"Linha {i+1}: {product_name} - {price}€ → {target_price}€")
    
    if updated_count == 0:
        print("\nNenhum produto encontrado para atualizar.")
        return False
    
    # Perguntar confirmação antes de escrever
    print(f"\n{'='*60}")
    print(f"Total de produtos a atualizar: {updated_count}")
    print(f"Preço alvo: {target_price}€")
    print(f"{'='*60}")
    
    # Escrever o ficheiro atualizado
    print("\nA guardar alterações...")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    
    print(f"\n✓ Atualização concluída! {updated_count} produtos atualizados para {target_price}€")
    return True

def main():
    """Função principal"""
    
    # Caminho do ficheiro (pode ser ajustado)
    file_path = "lib/products.ts"
    
    # Se foi passado um argumento, usar como caminho
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    
    # Preços (pode ser ajustado)
    target_price = 39.99  # Preço para o qual atualizar
    min_price = 39.0      # Produtos abaixo deste preço serão atualizados
    
    # Se foram passados argumentos para preços
    if len(sys.argv) > 2:
        target_price = float(sys.argv[2])
    if len(sys.argv) > 3:
        min_price = float(sys.argv[3])
    
    print("="*60)
    print("SCRIPT DE ATUALIZAÇÃO DE PREÇOS - TÉNIS ADIDAS")
    print("="*60)
    print(f"Ficheiro: {file_path}")
    print(f"Preço alvo: {target_price}€")
    print(f"Preço mínimo para atualização: {min_price}€")
    print("="*60)
    
    # Executar atualização
    success = update_adidas_sneakers_prices(file_path, target_price, min_price)
    
    if success:
        print("\n✓ Script executado com sucesso!")
    else:
        print("\n✗ Nenhuma alteração foi feita.")
        sys.exit(1)

if __name__ == "__main__":
    main()

