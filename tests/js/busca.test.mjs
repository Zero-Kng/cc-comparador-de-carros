import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buscarModelos, versaoPadrao, ordinal } from '../../js/busca.js';

const indice = JSON.parse(readFileSync(new URL('../../data/indice.json', import.meta.url), 'utf8'));

test('busca ignora acento e caixa', () => {
  assert.equal(buscarModelos(indice, 'serie 3')[0].id, 'bmw-serie-3');
  assert.ok(buscarModelos(indice, 'T-CROSS').some((m) => m.modelo === 'T-Cross'));
  assert.deepEqual(buscarModelos(indice, '   '), []);
  assert.ok(buscarModelos(indice, 'a').length <= 6);
});

test('busca pela marca junto com o modelo', () => {
  assert.equal(buscarModelos(indice, 'fiat fast')[0].id, 'fiat-fastback');
  assert.ok(buscarModelos(indice, 'fiat').every((m) => m.marca === 'Fiat'));
});

test('quem começa com o termo vem antes de quem só contém', () => {
  const r = buscarModelos(indice, 'pul', 20);
  assert.equal(r[0].modelo, 'Pulse');
});

test('versão padrão: mais barata do ano mais recente', () => {
  assert.equal(versaoPadrao(indice.find((m) => m.id === 'fiat-fastback')), 'fiat-fastback-turbo-200-cvt-2027');
});

test('versão padrão sem preço: primeira do ano mais recente', () => {
  const m = indice.find((x) => x.versoes.every((v) => v.preco === null));
  const ano = Math.max(...m.versoes.map((v) => v.ano_modelo));
  assert.equal(versaoPadrao(m), m.versoes.find((v) => v.ano_modelo === ano).id);
});

test('ordinal', () => {
  assert.equal(ordinal(2), '2º');
  assert.equal(ordinal(3), '3º');
});
