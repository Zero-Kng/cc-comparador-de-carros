const NAO_DIVULGADO = 'Não divulgado';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function formatarPreco(n) {
  if (n === null || n === undefined) return 'Preço não divulgado';
  return moeda.format(n).replace(/\u00a0/g, ' ');
}

export function formatarNumero(n, casas = 1) {
  if (n === null || n === undefined) return NAO_DIVULGADO;
  return n.toLocaleString('pt-BR', { maximumFractionDigits: casas });
}

export function normalizar(t) {
  return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export { NAO_DIVULGADO };
