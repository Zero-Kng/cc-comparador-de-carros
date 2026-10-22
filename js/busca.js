import { normalizar } from './formatar.js';

export function buscarModelos(indice, termo, limite = 6) {
  const t = normalizar(termo);
  if (!t) return [];
  const pontuados = [];
  for (const m of indice) {
    const modelo = normalizar(m.modelo);
    const completo = normalizar(`${m.marca} ${m.modelo}`);
    let pontos = null;
    if (modelo.startsWith(t) || completo.startsWith(t)) pontos = 0;
    else if (completo.includes(t)) pontos = 1;
    if (pontos !== null) pontuados.push({ m, pontos, completo });
  }
  pontuados.sort((a, b) => a.pontos - b.pontos || a.completo.localeCompare(b.completo, 'pt-BR'));
  return pontuados.slice(0, limite).map((p) => p.m);
}

export function versaoPadrao(modelo) {
  const ano = Math.max(...modelo.versoes.map((v) => v.ano_modelo));
  const doAno = modelo.versoes.filter((v) => v.ano_modelo === ano);
  const comPreco = doAno.filter((v) => v.preco !== null);
  if (!comPreco.length) return doAno[0].id;
  return comPreco.reduce((a, b) => (b.preco < a.preco ? b : a)).id;
}

export const ordinal = (n) => `${n}º`;
