import json

# Carregar o ficheiro JSON
with open('air_force_1_high_final.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total produtos: {len(data)}")
print("\nÚltimos 5 produtos:")
for i, produto in enumerate(data[-5:]):
    print(f"{len(data)-4+i+1}. {produto['nome']}")

print("\nProcurando produtos Bape...")
for produto in data:
    if 'Bape' in produto['nome'] or '黑迷彩' in produto['imagem']:
        print(f"Encontrado: {produto['nome']}")
