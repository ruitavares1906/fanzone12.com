import json

# Carregar o ficheiro JSON
with open('air_force_1_high_limpo.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total produtos: {len(data)}")

# Verificar IDs unicos
ids = [produto['id'] for produto in data]
ids_unicos = set(ids)
print(f"IDs unicos: {len(ids_unicos)}")
print(f"IDs duplicados: {len(ids) - len(ids_unicos)}")

# Mostrar ultimos 5 produtos
print("\nUltimos 5 produtos:")
for i, produto in enumerate(data[-5:]):
    print(f"{len(data)-4+i+1}. ID: {produto['id']}")
    print(f"   Nome: {produto['nome']}")
    print()

# Verificar se ha produtos Bape
print("Procurando produtos Bape:")
for produto in data:
    if 'Bape' in produto['nome'] or 'bape' in produto['id']:
        print(f"Encontrado: {produto['id']} - {produto['nome']}")

# Verificar se ha caracteres especiais nos IDs
print("\nVerificando caracteres especiais nos IDs:")
caracteres_especiais = 0
for produto in data:
    id_produto = produto['id']
    if any(c in id_produto for c in ['ç', 'ã', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'ô', 'à', 'è', 'ì', 'ò', 'ù']):
        print(f"ID com caracteres especiais: {id_produto}")
        caracteres_especiais += 1

print(f"Total IDs com caracteres especiais: {caracteres_especiais}")
