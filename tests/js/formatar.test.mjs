import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatarPreco, formatarNumero, normalizar } from '../../js/formatar.js';

test('preço formatado sem centavos e com espaço comum', () => {
  assert.equal(formatarPreco(174490), 'R$ 174.490');
  assert.equal(formatarPreco(2337900), 'R$ 2.337.900');
  assert.equal(formatarPreco(null), 'Preço não divulgado');
});

test('número com vírgula', () => {
  assert.equal(formatarNumero(12.6), '12,6');
  assert.equal(formatarNumero(9.9), '9,9');
  assert.equal(formatarNumero(600, 0), '600');
  assert.equal(formatarNumero(null), 'Não divulgado');
});

test('normalizar remove acentos e caixa', () => {
  assert.equal(normalizar('  Série 3 '), 'serie 3');
  assert.equal(normalizar('T-CROSS'), 't-cross');
});
