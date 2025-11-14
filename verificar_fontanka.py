import json

# Ler o ficheiro JSON
with open('air_force_1_fontanka_limpo.json', 'r', encoding='utf-8') as f:
    produtos = json.load(f)

print(f"Total produtos: {len(produtos)}")

# Verificar IDs únicos
ids = [produto['id'] for produto in produtos]
ids_unicos = set(ids)
print(f"IDs únicos: {len(ids_unicos)}")
print(f"IDs duplicados: {len(ids) - len(ids_unicos)}")

# Mostrar últimos 3 produtos
print("\nÚltimos 3 produtos:")
for i, produto in enumerate(produtos[-3:]):
    print(f"{i+1}. {produto['id']} - {produto['nome']}")

# Verificar se contém "Fontanka" nos nomes
print("\nVerificando se contém 'Fontanka' nos nomes:")
fontanka_count = sum(1 for p in produtos if 'fontanka' in p['nome'].lower())
print(f"Produtos com 'Fontanka' no nome: {fontanka_count}")

# Mostrar alguns exemplos de categorias
print("\nExemplos de categorias:")
for i, produto in enumerate(produtos[:3]):
    print(f"{i+1}. Categoria: {produto['categoria']}")
