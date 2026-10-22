import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gerarIndice } from '../../scripts/gerar-indice.mjs';

const base = JSON.parse(readFileSync(new URL('../../data/carros.json', import.meta.url), 'utf8'));

test('índice cobre toda a base com campos mínimos', () => {
  const indice = gerarIndice(base);
  assert.equal(indice.length, 282);
  assert.equal(indice.flatMap((m) => m.versoes).length, 802);
  const fb = indice.find((m) => m.id === 'fiat-fastback');
  assert.equal(fb.marca, 'Fiat');
  assert.equal(fb.modelo, 'Fastback');
  assert.equal(fb.categoria, 'SUV Compacto');
  assert.equal(fb.imagem, 'img/carros/fiat-fastback.webp');
  assert.deepEqual(fb.versoes.find((v) => v.id === 'fiat-fastback-abarth-turbo-270-2027'),
    { id: 'fiat-fastback-abarth-turbo-270-2027', versao: 'Abarth Turbo 270', ano_modelo: 2027, preco: 184990, preco_secundario: false });
  const mustang = indice.find((m) => m.id === 'ford-mustang');
  assert.equal(mustang.versoes[0].preco_secundario, true);
});
