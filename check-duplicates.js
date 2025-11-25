const fs = require('fs');

const content = fs.readFileSync('lib/products.ts', 'utf8');

// Encontrar todos os IDs - múltiplos padrões
const patterns = [
  /id:\s*['"]([^'"]+)['"]/g,
  /"id":\s*['"]([^'"]+)['"]/g,
  /'id':\s*['"]([^'"]+)['"]/g,
];

const allIds = [];
patterns.forEach(pattern => {
  const matches = [...content.matchAll(pattern)];
  matches.forEach(match => {
    allIds.push(match[1]);
  });
});

console.log(`Total de IDs encontrados: ${allIds.length}`);

// Verificar duplicados
const idCounts = {};
allIds.forEach(id => {
  idCounts[id] = (idCounts[id] || 0) + 1;
});

const duplicates = Object.entries(idCounts)
  .filter(([id, count]) => count > 1)
  .map(([id, count]) => ({ id, count }));

if (duplicates.length > 0) {
  console.log('\n⚠️  IDs duplicados encontrados:');
  duplicates.forEach(({ id, count }) => {
    const idLower = id.toLowerCase();
    const isSneaker = idLower.includes('sneaker') ||
      idLower.includes('samba') ||
      idLower.includes('campus') ||
      idLower.includes('gazelle') ||
      idLower.includes('superstar') ||
      idLower.includes('forum') ||
      idLower.includes('air-force') ||
      idLower.includes('dunk') ||
      idLower.includes('jordan') ||
      idLower.includes('nb-') ||
      idLower.includes('newbalance');
    
    const marker = isSneaker ? '👟 SNEAKER' : '  ';
    console.log(`  ${marker}: "${id}" aparece ${count} vezes`);
  });
} else {
  console.log('\n✅ Nenhum ID duplicado encontrado.');
}
