import json

# Ler o ficheiro JSON
with open('nb_9060_limpo.json', 'r', encoding='utf-8') as f:
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

# Verificar se contém "9060" nos nomes
print("\nVerificando se contém '9060' nos nomes:")
nb9060_count = sum(1 for p in produtos if '9060' in p['nome'])
print(f"Produtos com '9060' no nome: {nb9060_count}")

# Mostrar alguns exemplos de categorias
print("\nExemplos de categorias:")
for i, produto in enumerate(produtos[:3]):
    print(f"{i+1}. Categoria: {produto['categoria']}")

# Verificar produtos com colaborações
print("\nProdutos com colaborações:")
colaboracoes = ['joe freshgoods', 'mowalola', 'bricks & wood', 'louis vuitton']
for produto in produtos[:10]:
    if any(colab in produto['nome'].lower() for colab in colaboracoes):
        print(f"- {produto['nome']}")
