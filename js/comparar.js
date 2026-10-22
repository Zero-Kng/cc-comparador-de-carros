import { carregarBase, indexarVersoes } from './dados.js';
import { linhasFicha, alinharLinhas, campoSecundario } from './ficha.js';
import { formatarPreco } from './formatar.js';
import { resolverSelecao } from './selecao.js';
import { lista, avisarMudanca } from './comum.js';
import { el, trocarConteudo, valorComSelo, precoComSelo, legendaSecundaria, fotoCarro } from './ui.js';

const raiz = document.getElementById('comparacao');
const resumo = document.getElementById('resumo');
const mensagem = document.getElementById('mensagem');
let indice = null;
let aberto = false;

function avisar(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
  clearTimeout(avisar.timer);
  avisar.timer = setTimeout(() => { mensagem.hidden = true; }, 4000);
}

function estadoVazio() {
  return el('div', { class: 'aviso comparar__vazio' },
    el('p', {}, el('strong', {}, 'Sua comparação está vazia.')),
    el('p', {}, 'Pesquise um modelo na página inicial ou explore por categoria e marque as versões que quer comparar.'),
    el('div', { class: 'comparar__acoes' },
      el('a', { class: 'botao botao--limao', href: 'index.html' }, 'Buscar modelo →'),
      el('a', { class: 'botao', href: 'explorar.php' }, 'Explorar modelos')));
}

function seletorVersao({ versao, modelo }) {
  const select = el('select', { 'aria-label': `Versão do ${modelo.modelo}` },
    modelo.versoes.map((v) => el('option', { value: v.id, selected: v.id === versao.id }, `${v.versao} · ${v.ano_modelo}`)));
  select.addEventListener('change', () => {
    if (lista.trocar(versao.id, select.value)) {
      avisarMudanca();
      render();
    } else {
      select.value = versao.id;
      avisar('Essa versão já está na sua comparação.');
    }
  });
  return el('label', { class: 'cartao-comp__versao' }, el('span', { class: 'rotulo' }, 'Versão'), select);
}

function render() {
  const { validos, descartados } = resolverSelecao(lista.ids(), indice);
  if (descartados.length) {
    descartados.forEach((id) => lista.remover(id));
    avisarMudanca();
  }

  resumo.textContent = validos.length === 1 ? '1 versão' : `${validos.length} versões`;
  if (validos.length === 0) {
    raiz.replaceChildren(estadoVazio());
    return;
  }

  const { rotulos, celulas } = alinharLinhas(validos.map(({ versao }) => linhasFicha(versao)));
  const visiveis = rotulos.map((r, i) => ({ ...r, i })).filter((r) => aberto || r.principal);
  const linhasDaGrade = [];
  for (const r of visiveis) {
    if (linhasDaGrade.at(-1)?.grupo !== r.grupo) linhasDaGrade.push({ tipo: 'grupo', grupo: r.grupo });
    linhasDaGrade.push({ tipo: 'linha', grupo: r.grupo, ...r });
  }

  const cartoes = validos.map((item, j) => {
    const { versao, modelo, marca } = item;
    const nome = `${marca.marca} ${modelo.modelo}`;
    return el('article', { class: 'cartao cartao-comp' },
      el('div', { class: 'cartao-comp__foto' },
        fotoCarro(modelo, nome),
        el('button', {
          class: 'cartao-comp__remover', type: 'button', 'aria-label': `Remover ${nome} ${versao.versao}`,
          onclick: () => { lista.remover(versao.id); avisarMudanca(); render(); },
        }, '×')),
      el('div', { class: 'cartao-comp__titulo' },
        el('h2', {}, el('a', { href: `carro.html?id=${modelo.id}&versao=${versao.id}` }, nome), el('span', {}, versao.versao)),
        el('p', { class: 'rotulo' }, 'Ano-modelo ',
          valorComSelo({ valor: String(versao.ano_modelo), secundaria: campoSecundario(versao, 'ano_modelo') }),
          ` · ${modelo.categoria}`)),
      el('p', { class: 'cartao-comp__preco' }, precoComSelo(versao, formatarPreco)),
      seletorVersao(item),
      linhasDaGrade.map((l) => (l.tipo === 'grupo'
        ? el('h3', { class: 'cartao-comp__grupo' }, l.grupo)
        : el('div', { class: 'cartao-comp__linha' },
          el('span', { class: 'cartao-comp__rotulo' }, l.rotulo),
          el('span', { class: 'cartao-comp__valor' }, valorComSelo(celulas[l.i][j]))))),
      el('button', {
        class: 'botao cartao-comp__mais', type: 'button', 'aria-expanded': String(aberto),
        onclick: () => { aberto = !aberto; render(); },
      }, aberto ? 'Ver menos ▴' : 'Ver mais ▾'),
    );
  });

  const faixa = el('div', { class: 'faixa', style: `--linhas: ${4 + linhasDaGrade.length + 1}` }, cartoes);
  const temSecundaria = validos.some(({ versao }) => versao.campos_fonte_secundaria.length > 0);
  trocarConteudo(raiz,
    faixa,
    validos.length === 1
      ? el('div', { class: 'aviso comparar__convite' },
        el('p', {}, 'Adicione outra versão para comparar.'),
        el('a', { class: 'botao botao--limao', href: 'index.html' }, 'Buscar outro modelo →'))
      : null,
    temSecundaria ? legendaSecundaria() : null,
  );
}

async function iniciar() {
  indice = indexarVersoes(await carregarBase());
  render();
  window.addEventListener('storage', render);
}

iniciar().catch((erro) => {
  raiz.replaceChildren(el('div', { class: 'aviso' }, el('p', {}, 'Não foi possível carregar os dados. ', erro.message)));
});
