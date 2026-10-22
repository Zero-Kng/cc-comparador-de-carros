import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export function gerarIndice(base) {
  return base.marcas.flatMap((marca) => marca.modelos.map((modelo) => ({
    id: modelo.id,
    marca: marca.marca,
    modelo: modelo.modelo,
    categoria: modelo.categoria,
    imagem: modelo.imagem?.arquivo ?? null,
    versoes: modelo.versoes.map((v) => ({
      id: v.id,
      versao: v.versao,
      ano_modelo: v.ano_modelo,
      preco: v.preco_sugerido_brl,
      preco_secundario: v.campos_fonte_secundaria.includes('preco_sugerido_brl'),
    })),
  })));
}

export function gravarIndice(base, destino = join(import.meta.dirname, '..', 'data', 'indice.json')) {
  writeFileSync(destino, JSON.stringify(gerarIndice(base)) + '\n', 'utf8');
  return destino;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'data', 'carros.json'), 'utf8'));
  console.log(`índice gravado em ${gravarIndice(base)}`);
}
