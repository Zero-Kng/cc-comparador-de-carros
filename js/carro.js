import { carregarBase, acharModelo } from './dados.js';
import { linhasFicha, faixaDePreco, campoSecundario } from './ficha.js';
import { formatarPreco } from './formatar.js';
import { lista, avisarMudanca } from './comum.js';
import { el, trocarConteudo, valorComSelo, precoComSelo, legendaSecundaria, fotoCarro } from './ui.js';

const raiz = document.getElementById('carro');
const parametros = new URLSearchParams(location.search);

function resumo(v) {
  const potencias = Object.values(v.motor.potencia_cv ?? {}).filter((n) => n !== null);
  return [v.motor.descricao, potencias.length ? `${Math.max(...potencias)} cv` : null, v.transmissao.tipo]
    .filter(Boolean).join(' · ');
}

function botaoComparar(versao) {
  const botao = el('button', { class: 'botao botao--pequeno', type: 'button' });
  const atualizar = () => {
    const marcado = lista.contem(versao.id);
    botao.textContent = marcado ? 'Na comparação ✓' : 'Comparar';
    botao.classList.toggle('botao--limao', marcado);
    botao.setAttribute('aria-pressed', String(marcado));
  };
  botao.addEventListener('click', () => {
    if (lista.contem(versao.id)) lista.remover(versao.id); else lista.adicionar(versao.id);
    avisarMudanca();
  });
  window.addEventListener('lista-mudou', atualizar);
  atualizar();
  return botao;
}

function renderFicha(alvo, versao, nomeModelo) {
  const grupos = new Map();
  for (const linha of linhasFicha(versao)) {
    if (!grupos.has(linha.grupo)) grupos.set(linha.grupo, []);
    grupos.get(linha.grupo).push(linha);
  }
  const temSecundaria = versao.campos_fonte_secundaria.length > 0;
  trocarConteudo(alvo,
    el('div', { class: 'ficha__cabeca' },
      el('div', {},
        el('p', { class: 'rotulo' }, 'Ficha técnica · ano-modelo ',
          valorComSelo({ valor: String(versao.ano_modelo), secundaria: campoSecundario(versao, 'ano_modelo') })),
        el('h2', {}, `${nomeModelo} ${versao.versao}`),
      ),
      el('div', { class: 'ficha__preco' },
        el('strong', {}, precoComSelo(versao, formatarPreco)),
        versao.preco_obs ? el('span', {}, versao.preco_obs) : null,
        botaoComparar(versao),
      ),
    ),
    el('div', { class: 'ficha__grupos' },
      [...grupos].map(([grupo, linhas]) => el('section', { class: 'ficha__grupo' },
        el('h3', {}, grupo),
        el('dl', {}, linhas.map((l) => el('div', { class: 'ficha__linha' }, el('dt', {}, l.rotulo), el('dd', {}, valorComSelo(l))))),
      )),
    ),
    versao.observacoes ? el('p', { class: 'ficha__obs' }, el('strong', {}, 'Observações: '), versao.observacoes) : null,
    temSecundaria ? legendaSecundaria() : null,
  );
}

async function iniciar() {
  const base = await carregarBase();
  const achado = acharModelo(base, parametros.get('id'));
  if (!achado) {
    raiz.replaceChildren(el('div', { class: 'aviso carro__erro' },
      el('p', {}, el('strong', {}, 'Modelo não encontrado.')),
      el('a', { class: 'botao', href: 'explorar.php' }, 'Explorar modelos')));
    return;
  }

  const { modelo, marca } = achado;
  const nome = `${marca.marca} ${modelo.modelo}`;
  const faixa = faixaDePreco(modelo.versoes);
  document.title = `${nome} · CC`;

  const anos = [...new Set(modelo.versoes.map((v) => v.ano_modelo))].sort((a, b) => b - a);
  const versaoInicial = modelo.versoes.find((v) => v.id === parametros.get('versao'))
    ?? modelo.versoes.find((v) => v.ano_modelo === anos[0]);
  const ficha = el('section', { class: 'ficha cartao', id: 'ficha', 'aria-live': 'polite' });

  const linhaVersao = (v) => {
    const item = el('li', { class: 'versao' + (v === versaoInicial ? ' versao--ativa' : '') },
      el('button', {
        class: 'versao__nome', type: 'button',
        onclick: () => {
          raiz.querySelectorAll('.versao--ativa').forEach((x) => x.classList.remove('versao--ativa'));
          item.classList.add('versao--ativa');
          renderFicha(ficha, v, nome);
          history.replaceState(null, '', `?id=${modelo.id}&versao=${v.id}`);
          ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      }, el('strong', {}, v.versao), el('span', {}, resumo(v))),
      el('span', { class: 'versao__preco' }, precoComSelo(v, formatarPreco)),
      botaoComparar(v),
    );
    return item;
  };

  raiz.replaceChildren(
    el('a', { class: 'carro__voltar', href: 'explorar.php' }, '← Explorar modelos'),
    el('section', { class: 'carro__topo' },
      fotoCarro(modelo, nome),
      el('div', { class: 'carro__info' },
        el('p', { class: 'rotulo' }, [modelo.categoria, modelo.subcategoria].filter(Boolean).join(' · ')),
        el('h1', {}, el('span', { class: 'carro__marca' }, marca.marca), ' ', modelo.modelo),
        el('p', { class: 'carro__faixa' }, valorComSelo({ valor: faixa.texto, secundaria: faixa.secundaria })),
        el('dl', { class: 'carro__dados' },
          el('div', {}, el('dt', {}, 'Propulsão'), el('dd', {}, modelo.propulsoes.join(', '))),
          el('div', {}, el('dt', {}, 'Fabricação'), el('dd', {}, valorComSelo({
            valor: modelo.pais_fabricacao ?? 'Não divulgado',
            secundaria: modelo.versoes.some((v) => campoSecundario(v, 'pais_fabricacao')),
          }))),
          el('div', {}, el('dt', {}, 'Versões'), el('dd', {}, String(modelo.versoes.length))),
        ),
        el('p', { class: 'carro__dica' }, 'Escolha uma versão para ver a ficha completa. Use “Comparar” para levá-la à sua comparação.'),
      ),
    ),
    el('section', { class: 'carro__versoes' },
      el('h2', {}, 'Versões'),
      anos.map((ano) => el('div', { class: 'versoes__ano' },
        el('h3', { class: 'rotulo' }, 'Ano-modelo ', valorComSelo({
          valor: String(ano),
          secundaria: modelo.versoes.some((v) => v.ano_modelo === ano && campoSecundario(v, 'ano_modelo')),
        })),
        el('ul', { class: 'versoes' }, modelo.versoes.filter((v) => v.ano_modelo === ano).map(linhaVersao)),
      )),
    ),
    ficha,
    el('section', { class: 'carro__fontes' },
      el('h2', {}, 'Fontes'),
      el('ul', {}, modelo.fontes.map((f) => el('li', {},
        el('a', { href: f.url, target: '_blank', rel: 'noopener' }, new URL(f.url).hostname),
        ` · ${f.tipo.replaceAll('_', ' ')} · acessado em ${f.acessado_em.split('-').reverse().join('/')}`))),
    ),
  );
  renderFicha(ficha, versaoInicial, nome);
}

iniciar().catch((erro) => {
  raiz.replaceChildren(el('div', { class: 'aviso' }, el('p', {}, 'Não foi possível carregar os dados. ', erro.message)));
});
