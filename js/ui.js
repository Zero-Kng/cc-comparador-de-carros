export function el(tag, atributos = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [nome, valor] of Object.entries(atributos)) {
    if (valor === null || valor === undefined || valor === false) continue;
    if (nome.startsWith('on')) elemento.addEventListener(nome.slice(2), valor);
    else elemento.setAttribute(nome, valor === true ? '' : valor);
  }
  elemento.append(...filhos.flat().filter((f) => f !== null && f !== undefined && f !== false));
  return elemento;
}

export function trocarConteudo(alvo, ...filhos) {
  alvo.replaceChildren(...filhos.flat().filter((f) => f !== null && f !== undefined && f !== false));
}

export function valorComSelo(linha) {
  if (!linha) return el('span', { class: 'vazio' }, '—');
  const selo = linha.secundaria
    ? el('span', { class: 'selo-secundaria', title: 'Fonte secundária', 'aria-label': 'fonte secundária' }, '*')
    : null;
  return el('span', {}, linha.valor, selo);
}

export function precoComSelo(versao, formatarPreco) {
  const secundaria = (versao.campos_fonte_secundaria ?? []).includes('preco_sugerido_brl');
  return valorComSelo({ valor: formatarPreco(versao.preco_sugerido_brl), secundaria });
}

export function legendaSecundaria() {
  return el('p', { class: 'legenda-secundaria' },
    el('span', { class: 'selo-secundaria', 'aria-hidden': 'true' }, '*'),
    ' Fonte secundária: a fabricante não divulga esse dado; ele vem da imprensa especializada.');
}

export function fotoCarro(modelo, nome) {
  return el('div', { class: 'foto-carro' },
    modelo.imagem ? el('img', { src: modelo.imagem.arquivo, alt: nome, width: 1200, height: 500 }) : null);
}
