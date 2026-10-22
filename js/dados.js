let basePromessa = null;
let indicePromessa = null;

async function baixarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Não foi possível carregar ${url} (${resposta.status})`);
  return resposta.json();
}

export function carregarBase() {
  basePromessa ??= baixarJson('data/carros.json');
  return basePromessa;
}

export function carregarIndice() {
  indicePromessa ??= baixarJson('data/indice.json');
  return indicePromessa;
}

export function indexarVersoes(base) {
  const mapa = new Map();
  for (const marca of base.marcas) {
    for (const modelo of marca.modelos) {
      for (const versao of modelo.versoes) mapa.set(versao.id, { versao, modelo, marca });
    }
  }
  return mapa;
}

export function acharModelo(base, idModelo) {
  for (const marca of base.marcas) {
    const modelo = marca.modelos.find((m) => m.id === idModelo);
    if (modelo) return { modelo, marca };
  }
  return null;
}
