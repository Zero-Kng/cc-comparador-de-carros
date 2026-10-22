import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { indexarVersoes } from '../../js/dados.js';
import { resolverSelecao } from '../../js/selecao.js';

const base = JSON.parse(readFileSync(new URL('../../data/carros.json', import.meta.url), 'utf8'));

test('ids inexistentes são descartados mantendo a ordem', () => {
  const r = resolverSelecao(
    ['fiat-fastback-abarth-turbo-270-2027', 'nao-existe-2027', 'fiat-fastback-impetus-turbo-200-mhev-2027'],
    indexarVersoes(base),
  );
  assert.deepEqual(r.validos.map((x) => x.versao.id), ['fiat-fastback-abarth-turbo-270-2027', 'fiat-fastback-impetus-turbo-200-mhev-2027']);
  assert.equal(r.validos[0].modelo.id, 'fiat-fastback');
  assert.equal(r.validos[0].marca.marca, 'Fiat');
  assert.deepEqual(r.descartados, ['nao-existe-2027']);
});

test('lista vazia não quebra', () => {
  assert.deepEqual(resolverSelecao([], indexarVersoes(base)), { validos: [], descartados: [] });
});
