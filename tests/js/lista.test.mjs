import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarLista, CHAVE } from '../../js/lista.js';

// Armazenamento falso com a mesma interface do localStorage.
function falso() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

test('adiciona sem duplicar e persiste', () => {
  const a = falso();
  const l = criarLista(a);
  assert.equal(l.adicionar('x-2027'), true);
  assert.equal(l.adicionar('x-2027'), false);
  assert.deepEqual(criarLista(a).ids(), ['x-2027']);
});

test('remover e trocar mantêm a ordem', () => {
  const l = criarLista(falso());
  ['a', 'b', 'c'].forEach((id) => l.adicionar(id));
  assert.equal(l.trocar('b', 'z'), true);
  assert.deepEqual(l.ids(), ['a', 'z', 'c']);
  assert.equal(l.trocar('a', 'c'), false); // destino já está na lista
  l.remover('a');
  assert.deepEqual(l.ids(), ['z', 'c']);
});

test('armazenamento que lança erro cai para memória', () => {
  const quebrado = { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); } };
  const l = criarLista(quebrado);
  assert.equal(l.adicionar('a'), true);
  assert.deepEqual(l.ids(), ['a']);
});

test('navegador que bloqueia o próprio acesso ao localStorage não quebra a lista', () => {
  // Com cookies bloqueados, só ler window.localStorage já lança SecurityError
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError'); } });
  try {
    const l = criarLista();
    assert.equal(l.adicionar('a'), true);
    assert.deepEqual(l.ids(), ['a']);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});

test('conteúdo corrompido vira lista vazia', () => {
  const a = falso();
  a.setItem(CHAVE, '{não é json');
  assert.deepEqual(criarLista(a).ids(), []);
});
