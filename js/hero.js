import { carregarIndice } from './dados.js';
import { buscarModelos, versaoPadrao, ordinal } from './busca.js';
import { formatarPreco } from './formatar.js';
import { lista, avisarMudanca } from './comum.js';
import { el } from './ui.js';

const form = document.getElementById('busca');
const campo = document.getElementById('termo');
const rotulo = document.getElementById('busca-rotulo');
const caixaSugestoes = document.getElementById('sugestoes');
const mensagem = document.getElementById('busca-mensagem');
const selecionados = document.getElementById('selecionados');
const irComparar = document.getElementById('ir-comparar');

let indice = [];
let sugestoes = [];
let ativa = -1;
let pendente = null;

const nomeDe = (m) => `${m.marca} ${m.modelo}`;

function fecharSugestoes() {
  caixaSugestoes.hidden = true;
  campo.setAttribute('aria-expanded', 'false');
  campo.removeAttribute('aria-activedescendant');
  ativa = -1;
}

function mostrarSugestoes() {
  sugestoes = buscarModelos(indice, campo.value);
  ativa = -1;
  campo.removeAttribute('aria-activedescendant');
  mensagem.hidden = true;
  if (!sugestoes.length) { fecharSugestoes(); return; }
  caixaSugestoes.replaceChildren(...sugestoes.map((m, i) => el('li', {
    id: `sugestao-${i}`, role: 'option', 'aria-selected': 'false', class: 'sugestao',
    onmousedown: (ev) => { ev.preventDefault(); escolher(m); },
  },
  m.imagem ? el('img', { src: m.imagem, alt: '', width: 72, height: 30 }) : el('span', { class: 'sugestao__sem-foto' }),
  el('span', { class: 'sugestao__nome' }, el('strong', {}, m.modelo), el('span', {}, m.marca)),
  el('span', { class: 'sugestao__categoria rotulo' }, m.categoria))));
  caixaSugestoes.hidden = false;
  campo.setAttribute('aria-expanded', 'true');
}

function destacar(i) {
  const itens = [...caixaSugestoes.children];
  ativa = (i + itens.length) % itens.length;
  itens.forEach((li, j) => li.setAttribute('aria-selected', String(j === ativa)));
  campo.setAttribute('aria-activedescendant', itens[ativa].id);
}

function escolher(modelo) {
  pendente = modelo;
  campo.value = '';
  fecharSugestoes();
  renderSelecionados();
}

function comparar(modelo) {
  const id = versaoPadrao(modelo);
  const livre = lista.contem(id) ? modelo.versoes.find((v) => !lista.contem(v.id))?.id : id;
  if (!livre) { avisar('Todas as versões desse modelo já estão na sua comparação.'); return; }
  lista.adicionar(livre);
  pendente = null;
  avisarMudanca();
  campo.focus();
}

function avisar(texto) {
  mensagem.replaceChildren(texto);
  mensagem.hidden = false;
}

function chipComparado(id) {
  const modelo = indice.find((m) => m.versoes.some((v) => v.id === id));
  if (!modelo) return null;
  const select = el('select', { 'aria-label': `Versão do ${modelo.modelo}` },
    modelo.versoes.map((v) => el('option', { value: v.id, selected: v.id === id },
      `${v.versao} · ${v.ano_modelo} · ${formatarPreco(v.preco)}${v.preco_secundario ? ' *' : ''}`)));
  select.addEventListener('change', () => {
    if (lista.trocar(id, select.value)) avisarMudanca();
    else { select.value = id; avisar('Essa versão já está na sua comparação.'); }
  });
  return el('li', { class: 'chip chip--marcado' },
    modelo.imagem ? el('img', { src: modelo.imagem, alt: '', width: 96, height: 40 }) : null,
    el('div', { class: 'chip__corpo' }, el('strong', {}, nomeDe(modelo)), select),
    el('button', {
      class: 'chip__remover', type: 'button', 'aria-label': `Remover ${nomeDe(modelo)}`,
      onclick: () => { lista.remover(id); avisarMudanca(); },
    }, '×'));
}

function chipPendente(modelo) {
  return el('li', { class: 'chip chip--pendente' },
    modelo.imagem ? el('img', { src: modelo.imagem, alt: '', width: 96, height: 40 }) : null,
    el('div', { class: 'chip__corpo' }, el('strong', {}, nomeDe(modelo)), el('span', { class: 'rotulo' }, modelo.categoria)),
    el('div', { class: 'chip__acoes' },
      el('a', { class: 'botao botao--pequeno', href: `carro.html?id=${modelo.id}` }, 'Ver ficha'),
      el('button', { class: 'botao botao--pequeno botao--escuro', type: 'button', onclick: () => comparar(modelo) }, 'Comparar')),
    el('button', {
      class: 'chip__remover', type: 'button', 'aria-label': `Descartar ${nomeDe(modelo)}`,
      onclick: () => { pendente = null; renderSelecionados(); },
    }, '×'));
}

function renderSelecionados() {
  const ids = lista.ids();
  selecionados.replaceChildren(...ids.map(chipComparado).filter(Boolean), ...(pendente ? [chipPendente(pendente)] : []));
  rotulo.textContent = ids.length === 0 ? 'Qual modelo você quer comparar?' : `Agora, o ${ordinal(ids.length + 1)} modelo`;
  irComparar.hidden = ids.length < 2;
}

campo.addEventListener('input', mostrarSugestoes);
campo.addEventListener('focus', () => { if (campo.value) mostrarSugestoes(); });
campo.addEventListener('blur', fecharSugestoes);
campo.addEventListener('keydown', (ev) => {
  if (caixaSugestoes.hidden) return;
  if (ev.key === 'ArrowDown') { ev.preventDefault(); destacar(ativa + 1); }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); destacar(ativa - 1); }
  else if (ev.key === 'Escape') fecharSugestoes();
  else if (ev.key === 'Enter' && ativa >= 0) { ev.preventDefault(); escolher(sugestoes[ativa]); }
});

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const [primeira] = buscarModelos(indice, campo.value);
  if (primeira) { escolher(primeira); return; }
  fecharSugestoes();
  avisar(campo.value.trim() ? 'Nenhum modelo encontrado. ' : 'Digite o nome de um modelo. ');
  mensagem.append(el('a', { href: 'explorar.php' }, 'Explorar modelos →'));
});

form.querySelectorAll('[data-atalho]').forEach((botao) => botao.addEventListener('click', () => {
  campo.value = botao.dataset.atalho;
  campo.focus();
  mostrarSugestoes();
}));

window.addEventListener('lista-mudou', renderSelecionados);
window.addEventListener('storage', renderSelecionados);

carregarIndice().then((dados) => {
  indice = dados;
  renderSelecionados();
}).catch(() => avisar('Não foi possível carregar a lista de modelos.'));
