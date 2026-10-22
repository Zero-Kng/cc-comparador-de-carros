// Valida todos os arquivos de data/marcas e gera data/carros.json.
// Uso: node scripts/unir.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validarMarca, CATEGORIAS } from './validar.mjs';
import { gravarIndice } from './gerar-indice.mjs';

const DIR = join(import.meta.dirname, '..', 'data', 'marcas');
const SAIDA = join(import.meta.dirname, '..', 'data', 'carros.json');

const marcas = [];
const idsGlobais = new Set();
let totalErros = 0;

for (const arq of readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const caminho = join(DIR, arq);
  let dados;
  try { dados = JSON.parse(readFileSync(caminho, 'utf8')); }
  catch (e) { console.log(`✗ ${arq}: JSON inválido — ${e.message}`); totalErros++; continue; }
  const { erros } = validarMarca(dados, caminho);
  for (const m of dados.modelos ?? []) for (const id of [m.id, ...(m.versoes ?? []).map((v) => v.id)]) {
    if (idsGlobais.has(id)) erros.push(`id duplicado entre marcas: ${id}`);
    idsGlobais.add(id);
  }
  if (erros.length) { console.log(`✗ ${arq}: ${erros.length} erros (rode validar.mjs para detalhes) — fora da união`); totalErros += erros.length; continue; }
  marcas.push(dados);
}

marcas.sort((a, b) => a.marca.localeCompare(b.marca, 'pt-BR'));
const modelos = marcas.flatMap((b) => b.modelos);
const versoes = modelos.flatMap((m) => m.versoes);
const porCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c, modelos.filter((m) => m.categoria === c).length]));

const saida = {
  gerado_em: new Date().toISOString().slice(0, 10),
  totais: { marcas: marcas.length, modelos: modelos.length, versoes: versoes.length, modelos_por_categoria: porCategoria },
  marcas,
};
writeFileSync(SAIDA, JSON.stringify(saida, null, 2) + '\n', 'utf8');
gravarIndice(saida); // mantém o índice leve da busca em dia com a base
console.log(`\n${marcas.length} marcas, ${modelos.length} modelos, ${versoes.length} versões → data/carros.json`);
console.table(porCategoria);
if (totalErros) { console.log(`${totalErros} erros em arquivos excluídos.`); process.exit(1); }
