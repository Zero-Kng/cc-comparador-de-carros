import { criarLista } from './lista.js';

export const lista = criarLista();

function atualizarContador() {
  const n = lista.ids().length;
  document.querySelectorAll('[data-contador]').forEach((el) => { el.textContent = n; });
}

export function avisarMudanca() {
  window.dispatchEvent(new Event('lista-mudou'));
}

window.addEventListener('lista-mudou', atualizarContador);
window.addEventListener('storage', atualizarContador);
atualizarContador();
