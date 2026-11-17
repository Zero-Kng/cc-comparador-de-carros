const MAIOR = /^(Potência|Torque|Consumo|Porta-malas|Velocidade máxima|Autonomia elétrica|Bateria|Airbags|Caçamba|Capacidade de carga)/;
const MENOR = /^0–100 km\/h/;
const FAIXAS = ['a', 'b', 'c', 'd', 'e'];

export function sentido(rotulo) {
  if (MAIOR.test(rotulo)) return 'maior';
  if (MENOR.test(rotulo)) return 'menor';
  return null;
}

export function numero(valor) {
  const achados = String(valor ?? '').match(/\d[\d.]*(?:,\d+)?/g);
  if (!achados) return null;
  const nums = achados.map((t) => Number(t.replace(/\./g, '').replace(',', '.')));
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

export function medirLinhas(rotulos, celulas) {
  return rotulos.map((r, i) => {
    const linha = celulas[i];
    const modo = sentido(r.rotulo);
    const vals = linha.map((cel) => (modo && cel ? numero(cel.valor) : null));
    const validos = vals.filter((v) => v !== null && v > 0);
    if (!modo || validos.length < 2) return linha.map(() => null);
    const melhor = modo === 'maior' ? Math.max(...validos) : Math.min(...validos);
    const pior = modo === 'maior' ? Math.min(...validos) : Math.max(...validos);
    if (melhor === pior) return linha.map(() => null);
    return vals.map((v) => {
      if (v === null || v <= 0) return null;
      const pct = modo === 'maior' ? (v / melhor) * 100 : (melhor / v) * 100;
      const posicao = (v - melhor) / (pior - melhor);
      return { pct, faixa: FAIXAS[Math.round(posicao * 4)] };
    });
  });
}
