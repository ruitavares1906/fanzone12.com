import json

# Carregar o ficheiro JSON
with open('air_force_1_high_final.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total produtos: {len(data)}")

# Verificar se os novos produtos estão incluídos
novos_produtos = [
    "Bape x Air Force 1 '07 Mid 黑迷彩",
    "Air Force 1 '07 Mid 黑白灰电玩涂鸦",
    "Air Force 1 '07 Mid 五道杠联名定制",
    "Air Force 1 '07 Mid 白黑橙",
    "Travis Scott x Air Jordan 1 Low 低帮倒钩TS联名板鞋 553560-061",
    "Air Force 1'07 Mid 巧克力棕麂皮",
    "Atlas x NK SB Dunk Low \"35MM\" 黑莱卡",
    "Air Force 1 '07 Mid 灰白满天星",
    "Kaws x Air Force 1 '07 Mid 联名涂鸦",
    "Air Force 1 '07 Mid 五道杠联名白黑",
    "Air Force 1 '07 Mid 咖啡豆麂皮",
    "Air Force 1'07 Mid 浅绿灰中帮",
    "Air Force 1'07 Mid 米黄黑中帮",
    "Air Force 1'07 Mid 米黑银炫彩夜魔侠",
    "Air Force 1'07 Mid 深蓝白中帮",
    "Air Force 1 High 白宝蓝",
    "Air Force 1'07 Mid 串标白黑小钩"
]

print("\nVerificando novos produtos:")
encontrados = 0
for produto in data:
    for novo in novos_produtos:
        if novo in produto['imagem']:
            print("Encontrado:", produto['nome'])
            encontrados += 1
            break

print(f"\nNovos produtos encontrados: {encontrados}/{len(novos_produtos)}")

# Mostrar os últimos 3 produtos
print("\nUltimos 3 produtos:")
for i, produto in enumerate(data[-3:]):
    print(f"{len(data)-2+i+1}. {produto['nome']}")
