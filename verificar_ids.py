import json

# Carregar o ficheiro JSON
with open('air_force_1_high_corrigido.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total produtos: {len(data)}")

# Verificar IDs únicos
ids = [produto['id'] for produto in data]
ids_unicos = set(ids)
print(f"IDs únicos: {len(ids_unicos)}")
print(f"IDs duplicados: {len(ids) - len(ids_unicos)}")

# Mostrar últimos 5 produtos
print("\nUltimos 5 produtos:")
for i, produto in enumerate(data[-5:]):
    print(f"{len(data)-4+i+1}. ID: {produto['id']}")
    print(f"   Nome: {produto['nome']}")
    print()

# Verificar se há produtos Bape
print("Procurando produtos Bape:")
for produto in data:
    if 'Bape' in produto['nome'] or 'bape' in produto['id']:
        print(f"Encontrado: {produto['id']} - {produto['nome']}")
