import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { linhasFicha, alinharLinhas, faixaDePreco, campoSecundario } from '../../js/ficha.js';

const base = JSON.parse(readFileSync(new URL('../../data/carros.json', import.meta.url), 'utf8'));
const versoes = new Map(base.marcas.flatMap((m) => m.modelos).flatMap((m) => m.versoes).map((v) => [v.id, v]));
const versao = (id) => versoes.get(id);
const L = (rotulo) => ({ grupo: 'Motor e desempenho', rotulo, valor: 'x', caminhos: [], principal: true, secundaria: false });

test('Abarth 2027: linhas principais', () => {
  const l = linhasFicha(versao('fiat-fastback-abarth-turbo-270-2027'));
  const p = Object.fromEntries(l.filter((x) => x.principal).map((x) => [x.rotulo, x.valor]));
  assert.equal(p['Potência (etanol)'], '185 cv');
  assert.equal(p['Potência (gasolina)'], '180 cv');
  assert.equal(p['Câmbio'], 'Automática, 6 marchas');
  assert.equal(p['0–100 km/h'], '7,6 s');
  assert.equal(p['Consumo gasolina (cidade / estrada)'], '10,8 / 12,9 km/l');
  assert.equal(p['Porta-malas'], '600 L');
  assert.equal(p['Airbags'], '4');
  assert.equal(p['CarPlay / Android Auto'], 'Sem fio');
  assert.deepEqual([...new Set(l.map((x) => x.grupo))], ['Motor e desempenho', 'Consumo', 'Espaço e dimensões', 'Equipamentos']);
});

test('linhas secundárias existem e booleanos viram Sim/Não', () => {
  const l = linhasFicha(versao('fiat-fastback-abarth-turbo-270-2027'));
  const todas = Object.fromEntries(l.map((x) => [x.rotulo, x]));
  assert.equal(todas['Teto solar'].valor, 'Sim');
  assert.equal(todas['Teto solar'].principal, false);
  assert.equal(todas['Piloto automático adaptativo'].valor, 'Não');
  assert.equal(todas['Velocidade máxima'].valor, '220 km/h');
});

test('elétrico usa km/le', () => {
  const l = linhasFicha(versao('audi-a6-sportback-e-tron-s-line-e-tron-performance-2026'));
  assert.equal(l.find((x) => x.rotulo === 'Consumo elétrico (cidade / estrada)').valor, '36,5 / 32,2 km/le');
  assert.equal(l.find((x) => x.rotulo === 'Potência (elétrico)').valor, '367 cv');
});

test('campo de fonte secundária é marcado', () => {
  const v = versao('ford-mustang-dark-horse-2026'); // desempenho.aceleracao_0_100_s de fonte secundária
  assert.equal(linhasFicha(v).find((x) => x.rotulo === '0–100 km/h').secundaria, true);
  assert.equal(linhasFicha(v).find((x) => x.rotulo === 'Porta-malas').secundaria, v.campos_fonte_secundaria.includes('porta_malas_l'));
});

test('"consumo" inteiro marca todas as linhas de consumo', () => {
  const v = versao('changan-cs55-infinity-turbo-flex-2027'); // campos_fonte_secundaria contém "consumo"
  const consumo = linhasFicha(v).filter((x) => x.grupo === 'Consumo');
  assert.ok(consumo.length > 0);
  assert.ok(consumo.every((x) => x.secundaria));
});

test('null e consumo vazio viram Não divulgado', () => {
  const v = { ...versao('fiat-fastback-abarth-turbo-270-2027'), consumo: {}, porta_malas_l: null };
  const l = linhasFicha(v);
  assert.equal(l.find((x) => x.rotulo === 'Porta-malas').valor, 'Não divulgado');
  const consumo = l.filter((x) => x.grupo === 'Consumo');
  assert.equal(consumo.length, 1);
  assert.equal(consumo[0].valor, 'Não divulgado');
});

test('alinharLinhas une rótulos de carros diferentes', () => {
  const { rotulos, celulas } = alinharLinhas([[L('Potência (etanol)')], [L('Potência (gasolina)')]]);
  assert.deepEqual(rotulos.map((r) => r.rotulo), ['Potência (etanol)', 'Potência (gasolina)']);
  assert.equal(celulas[0][1], null);
  assert.equal(celulas[1][0], null);
  assert.equal(celulas[0][0].rotulo, 'Potência (etanol)');
});

test('faixa de preço sinaliza quando alguma versão tem preço secundário', () => {
  const modelo = (id) => base.marcas.flatMap((m) => m.modelos).find((m) => m.id === id);
  assert.deepEqual(faixaDePreco(modelo('fiat-fastback').versoes), { texto: 'R$ 119.990 a R$ 184.990', secundaria: false });
  assert.deepEqual(faixaDePreco(modelo('ford-mustang').versoes), { texto: 'R$ 649.000', secundaria: true });
  assert.deepEqual(faixaDePreco([{ preco_sugerido_brl: null, campos_fonte_secundaria: [] }]), { texto: 'Preço não divulgado', secundaria: false });
});

test('campoSecundario: ano-modelo e país vindos de fonte secundária', () => {
  assert.equal(campoSecundario(versao('denza-b5-gl-2027'), 'ano_modelo'), true);
  assert.equal(campoSecundario(versao('fiat-fastback-abarth-turbo-270-2027'), 'ano_modelo'), false);
});
