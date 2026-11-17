import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sentido, numero, medirLinhas } from '../../js/medidas.js';

const r = (rotulo) => ({ grupo: 'g', rotulo, principal: true });
const c = (valor) => ({ valor });

test('sentido: maior ou menor é melhor', () => {
  assert.equal(sentido('Potência (etanol)'), 'maior');
  assert.equal(sentido('Consumo gasolina (cidade / estrada)'), 'maior');
  assert.equal(sentido('Porta-malas'), 'maior');
  assert.equal(sentido('0–100 km/h'), 'menor');
  assert.equal(sentido('Motor'), null);
  assert.equal(sentido('Câmbio'), null);
});

test('numero: lê valores em pt-BR e faz a média de cidade / estrada', () => {
  assert.equal(numero('185 cv'), 185);
  assert.equal(numero('7,6 s'), 7.6);
  assert.equal(numero('1.989 mm'), 1989);
  assert.equal(numero('10,8 / 12,9 km/l'), 11.85);
  assert.equal(numero('Não divulgado'), null);
  assert.equal(numero('—'), null);
});

test('medirLinhas: barra proporcional ao melhor e cor do melhor ao pior', () => {
  const rotulos = [r('Potência (etanol)'), r('0–100 km/h'), r('Motor')];
  const celulas = [
    [c('185 cv'), c('116 cv'), c('150 cv')],
    [c('7,6 s'), c('9,9 s'), c('8,6 s')],
    [c('1.3 Turbo'), c('1.0 Turbo'), c('1.4 TSI')],
  ];
  const m = medirLinhas(rotulos, celulas);
  assert.deepEqual(m[0][0], { pct: 100, faixa: 'a' });
  assert.equal(m[0][1].faixa, 'e');
  assert.equal(m[0][2].faixa, 'c');
  assert.equal(Math.round(m[0][1].pct), 63);
  assert.equal(m[1][0].faixa, 'a');
  assert.equal(m[1][1].faixa, 'e');
  assert.equal(Math.round(m[1][1].pct), 77);
  assert.deepEqual(m[2], [null, null, null]);
});

test('medirLinhas: sem barra com uma versão só, com empate ou valor ausente', () => {
  assert.deepEqual(medirLinhas([r('Porta-malas')], [[c('600 L')]]), [[null]]);
  assert.deepEqual(medirLinhas([r('Porta-malas')], [[c('600 L'), c('600 L')]]), [[null, null]]);
  const m = medirLinhas([r('Porta-malas')], [[c('600 L'), null, c('Não divulgado'), c('373 L')]]);
  assert.equal(m[0][0].faixa, 'a');
  assert.equal(m[0][1], null);
  assert.equal(m[0][2], null);
  assert.equal(m[0][3].faixa, 'e');
});
