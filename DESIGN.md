---
name: CC
description: Comparador de carros novos vendidos no Brasil, desenhado como a etiqueta de eficiência que todo carro novo traz no vidro.
colors:
  papel: "#ffffff"
  tinta: "#0d0d0d"
  tinta-2: "#444444"
  fio-fino: "#cfcfcf"
  neutro: "#f1f1f1"
  tinta-sobre-faixa: "#d4d4d4"
  faixa-a: "#00843d"
  faixa-b: "#4fa832"
  faixa-c: "#f3c200"
  faixa-d: "#ee7d11"
  faixa-e: "#d52b1e"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 1rem + 6vw, 5.1rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.4rem + 3.4vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 68"
  figure:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 900
    lineHeight: 1
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 65"
  title:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 80"
  body:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  body-sm:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Arial Narrow, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 80"
rounded:
  none: "0px"
spacing:
  fio: "2px"
  moldura: "4px"
  xs: "6px"
  sm: "12px"
  md: "18px"
  lg: "22px"
  xl: "40px"
  xxl: "56px"
  margem: "clamp(16px, 4vw, 48px)"
  largura: "1320px"
components:
  button-seta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "10px 34px 10px 18px"
    height: "44px"
    typography: "{typography.label}"
  button-seta-hover:
    backgroundColor: "{colors.tinta-2}"
    textColor: "{colors.papel}"
  button-contorno:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
    height: "44px"
  button-contorno-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
  campo:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "46px"
  busca:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "60px"
  faixa-cabecalho:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.papel}"
    padding: "10px 22px"
    typography: "{typography.label}"
  cartao:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
  barra-medida:
    backgroundColor: "{colors.faixa-c}"
    height: "14px"
---

# Design System: CC

## Overview

**Creative North Star: "Etiqueta de eficiência"**

O site inteiro é a etiqueta ENCE/PBEV colada no vidro de todo carro novo vendido no Brasil: papel branco puro, tinta preta, molduras grossas, faixas de cabeçalho pretas com versais estreitas em branco, e a régua de cinco cores (verde escuro, verde claro, amarelo, laranja, vermelho) aparecendo só como barras em forma de seta. Cada página é uma ou mais etiquetas; cada bloco de informação é um campo da etiqueta, separado por fios.

A densidade é de documento técnico: muitos números, alinhados em algarismos tabulares, lidos linha a linha. A tipografia é uma família só, Archivo, que muda de largura em vez de mudar de face: estreita e pesada para títulos e números, largura normal para o texto corrido. Não há cor de marca além da tinta; a cor existe para medir.

A etiqueta recusa duas coisas que o projeto já foi ou poderia ter sido: o portal de carros genérico (página branca com acento azul e cards de foto arredondados) e o editorial creme com serifa que veio antes deste redesenho.

**Key Characteristics:**
- Papel branco, tinta quase preta, nenhum canto arredondado.
- Molduras de 4px por fora, fios de 2px por dentro, fios finos cinza entre linhas de dados.
- Faixas pretas cheias com versais brancas como cabeçalhos de etiqueta, de grupo e de tabela.
- Archivo variável: largura 62–68% para display e números, 80% para rótulos e botões, 100% para texto.
- A régua A–E só aparece como barra em seta e só quando codifica dado real.
- Botões de ação principal com a ponta em seta, recortada no próprio bloco preto.

## Colors

Uma paleta de etiqueta impressa: duas tintas para tudo e uma régua de cinco cores reservada para medir.

### Primary
- **Tinta de etiqueta** (`tinta`): todo o texto, todas as molduras e fios grossos, as faixas de cabeçalho, o botão principal, o foco e a seleção. É ao mesmo tempo a cor do texto e a cor da estrutura.

### Neutral
- **Papel de etiqueta** (`papel`): o fundo de todas as superfícies e o texto sobre faixas pretas.
- **Tinta de apoio** (`tinta-2`): texto secundário (subtítulos, rótulos de linha, notas, legendas) e o hover do botão em seta.
- **Fio fino** (`fio-fino`): divisores de 1px entre linhas de dados (ficha técnica, tabelas, linhas de comparação, sugestões).
- **Cinza de hover** (`neutro`): fundo de hover em resultados e linhas de tabela; trilho da barra de rolagem.
- **Tinta sobre faixa** (`tinta-sobre-faixa`): texto secundário sobre fundo preto (rótulos dentro da ficha, versão ativa, sugestão selecionada).

### Régua A–E (dados)
- **Faixa A, verde escuro** (`faixa-a`): o melhor valor da linha entre as versões na tela.
- **Faixa B, verde claro** (`faixa-b`).
- **Faixa C, amarelo** (`faixa-c`): também é a cor padrão de uma barra antes de receber faixa.
- **Faixa D, laranja** (`faixa-d`).
- **Faixa E, vermelho** (`faixa-e`): o pior valor da linha.

A faixa é calculada pela posição do valor entre o melhor e o pior da linha (`round(posição × 4)`), e o comprimento da barra é a razão com o melhor valor. Só linhas com sentido conhecido (maior é melhor: potência, torque, consumo, porta-malas…; menor é melhor: 0–100 km/h) e com pelo menos dois valores diferentes recebem barra.

### Named Rules
**The Régua Mede Rule.** As cinco cores da régua só aparecem codificando dado real e relativo ao que está na tela: barras de medida na comparação e a escada de vagas da página inicial (que mostra quantos modelos foram marcados). Nunca como nota absoluta de um carro, nunca como decoração, nunca como cor de botão, link ou fundo.

**The Duas Tintas Rule.** Fora da régua, tudo é papel e tinta (com seus cinzas). Dados que não são comparação entre versões, como a distribuição de fontes em "Como comparamos", usam tons de tinta (preto, cinza médio, cinza claro), nunca a régua.

## Typography

**Display Font:** Archivo variável (eixos `wdth` 62–125 e `wght` 400–900, Google Fonts), com Arial Narrow e system-ui de reserva.
**Body Font:** a mesma Archivo, em largura normal.

**Character:** uma família só, que se comporta como a tipografia de uma etiqueta oficial: versais condensadas e pesadíssimas para o que se lê de longe, grotesca neutra para o que se lê de perto. Algarismos tabulares no corpo inteiro (`font-variant-numeric: tabular-nums` no `body`).

### Hierarchy
- **Display** (900, largura 62%, clamp(3.2rem → 5.1rem), entrelinha 0.86, versais): só o título da etiqueta da página inicial.
- **Headline** (800, largura 68%, clamp(2.4rem → 4.6rem), entrelinha 0.95, versais, `text-wrap: balance`): títulos de página e de seção (Explorar, Comparar, Como comparamos, nome do carro, versões, ficha).
- **Figure** (900, largura 62–75%, 2–4.8rem, entrelinha 0.9–1): preços e números de destaque (preço da ficha, preço na comparação, números de "Como comparamos", preço da versão).
- **Title** (800, largura 80%, 1.375rem, versais): nomes de modelo em sugestões e versões, rótulo da busca.
- **Body** (400, 1.0625rem, entrelinha 1.55): texto corrido; parágrafos limitados a 64–65ch. O texto de apoio dos cabeçalhos sobe para 1.375rem, entrelinha 1.4, em tinta de apoio.
- **Label** (700–800, largura 80%, 0.8125rem, versais, espaçamento 0.04em): rótulos de campo, faixas de grupo, cabeçalhos de tabela, metadados do modelo. Botões e itens de menu usam o mesmo desenho em 0.9375rem e espaçamento 0.03em.

### Named Rules
**The Largura Antes do Peso Rule.** A hierarquia se faz estreitando a Archivo (62% → 68% → 80% → 100%) e não trocando de família. Uma segunda família não entra.

**The Versal É Cabeçalho Rule.** Versais condensadas são para títulos, rótulos, botões e faixas. Texto corrido, valores de dados e notas ficam em caixa normal e largura normal.

## Layout

Coluna única centralizada de até 1320px com margem lateral fluida (clamp(16px, 4vw, 48px)). Cada página abre com um cabeçalho de etiqueta: moldura de 4px, faixa preta com o escopo da base ("Brasil / anos-modelo 2026 e 2027"), título grande e texto de apoio dentro da moldura. Abaixo, blocos que encostam uns nos outros separados por fios de 2px, não por espaço vazio.

Grades usadas: resultados em `auto-fill` com mínimo de 260px e vão de 20px; filtros em `auto-fit` com mínimo de 180px; blocos do método com mínimo de 320px; ficha técnica em duas colunas com fio de 2px entre elas (`columns: 2 340px`). A comparação é uma faixa horizontal com rolagem e scroll-snap, colunas de min(340px, 85vw), e as linhas de todos os cartões alinhadas por `subgrid`, para que a mesma especificação fique na mesma altura em todas as versões.

Ritmo vertical: 6 / 12 / 18 / 22 px dentro das etiquetas, 40–56px entre seções, 72px antes do rodapé.

### Adaptações mobile
- **≤ 860px:** topo da página do carro vira uma coluna (foto sobre informações, fio passa da direita para baixo); botão da versão desce para linha própria; ficha perde o fio entre colunas; preço da ficha alinha à esquerda.
- **≤ 760px:** o título da etiqueta inicial empilha sobre a escada de vagas (o fio passa de vertical a horizontal); a caixa de busca empilha o campo sobre o botão em seta, que ocupa a largura toda; os itens marcados viram blocos de largura total com o X num quadrado de 38px no canto; sugestões perdem a coluna de categoria; o palco encolhe para 170px de altura e os carros para 45% da largura; o cabeçalho da comparação empilha.
- **≤ 640px:** o menu se reorganiza dentro da faixa preta: "Minha comparação" fica na primeira linha ao lado do logo, os dois links descem para uma segunda linha dividida ao meio; os números de "Como comparamos" empilham com fio horizontal.

## Elevation & Depth

A etiqueta é plana. Profundidade vem de moldura, fio e inversão (preto sobre branco), não de sombra. Existem só duas sombras, ambas funcionais:

### Shadow Vocabulary
- **Lista flutuante** (`box-shadow: 0 18px 30px -12px rgb(13 13 13 / 35%)`): só na lista de sugestões da busca, a única superfície que se sobrepõe ao conteúdo.
- **Contato no chão** (gradiente radial elíptico, tinta a 34% até transparente em 72%, 18px de altura): a sombra dos carros sobre a linha de chão do palco e nada mais.

### Named Rules
**The Plano Por Padrão Rule.** Superfícies não flutuam. Hover é troca de fundo (cinza ou inversão para preto), nunca elevação. Nenhuma sombra deslocada dura.

## Shapes

Canto reto em tudo (0px). A forma vem de três recursos:
- **Moldura e fio:** 4px de tinta por fora de cada etiqueta, cartão, tabela e caixa de busca; 2px entre campos internos; 1px de fio fino entre linhas de dados. Bordas tracejadas significam "vazio, ainda por preencher" (vagas da escada, item pendente).
- **Seta:** o recorte `clip-path` em ponta de seta (corte de 16px, 11px nos botões pequenos, 17px na escada, 7px nas barras de medida) é a silhueta própria do sistema. Aparece no botão principal, nas barras de medida e nas vagas preenchidas da escada, como as setas coloridas da etiqueta ENCE.
- **Linha de chão:** um fio de 2px de tinta atravessando a área da foto (a 14% da base nos cartões, 23% no palco), sobre o qual os carros se apoiam.

Ícones são desenhados em CSS: a seta e o visto como máscaras SVG em `currentColor`, o X de remover como dois traços de 2.5px cruzados, o triângulo do "mais filtros" por `clip-path`. Nenhum ícone de fonte nem glifo.

## Components

### Buttons
Blocos de tinta com versais estreitas; o principal aponta para frente.
- **Shape:** retângulo de canto reto, borda de 2px, altura mínima de 44px (34px no pequeno).
- **Seta (principal):** fundo tinta, texto papel, ponta em seta recortada à direita, padding direito maior para a ponta, ícone de seta desenhado após o texto. Hover vai para tinta de apoio. Usado em "Buscar modelo", "Comparar (n)", "Filtrar modelos" e no botão de marcar a versão para comparar, que ao ficar marcado troca a seta por um visto.
- **Contorno (secundário):** fundo papel, borda e texto tinta. Hover inverte (fundo tinta, texto papel). Em faixa preta, inverte as cores: borda e texto papel, hover papel com texto tinta.
- **Desabilitado:** opacidade 0.45.
- **Remover:** quadrado de 34–40px encostado no canto do item, com fio de 2px separando, X desenhado; hover inverte para preto.

### Inputs / Fields
- **Style:** borda de 2px tinta, canto reto, fundo papel, altura 46px; rótulo em label versal acima.
- **Busca:** moldura de 4px, campo de 60px em 1.1–1.45rem peso 600, botão em seta encaixado sem borda própria.
- **Focus:** contorno de 3px em tinta com afastamento de 3px; a caixa de busca recebe o contorno inteiro via `:focus-within`.

### Navigation
Faixa preta cheia no topo com o logo CC em papel (26px de altura), links em versais 80% de largura que ganham sublinhado de 3px em papel no hover e na página atual, e "Minha comparação (n)" como botão de contorno invertido. A faixa persiste entre páginas por view transition. Foco dentro da faixa é contorno papel.

### Cards / Containers
- **Corner Style:** reto.
- **Background:** papel; hover de resultado vai para cinza neutro.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** moldura de 4px tinta; foto separada do corpo por fio de 2px.
- **Internal Padding:** 16–22px.

### Faixa de cabeçalho
A faixa preta da etiqueta: fundo tinta, versais estreitas em papel, 10px × 18–22px. Abre o cabeçalho de cada página com o escopo da base, separa grupos de especificação na comparação ("Motor e desempenho", "Consumo"…), encabeça tabelas, a ficha técnica e os anos-modelo das versões. A versão selecionada e a sugestão ativa usam a mesma inversão.

### Barra de medida
Barra de 14px em seta (ponta de 7px), largura proporcional ao melhor valor da linha (mínimo 20px), cor da faixa A–E calculada. Cresce com `width .5s` na curva de saída. Abaixo da comparação, uma nota explica que as barras comparam só as versões da página.

### Escada de vagas
Cinco degraus de 34px (30px no mobile), larguras de 58% a 98%, à direita do título da página inicial. Vazios: borda tracejada cinza com "vaga livre". Preenchidos, na ordem: recebem a cor da faixa correspondente (A para o 1º … E para o 5º), perdem a borda, ganham a ponta em seta e o texto "marcado"; texto em papel sobre A e E, tinta sobre B, C e D. A transição de cor dura .35s.

### Palco (animação da página inicial)
Caixa de veículo da etiqueta inicial: altura clamp(180px, 18vw, 260px), linha de chão a 23%, Volvo EX40 à esquerda e BMW Série 3 à direita, larguras na proporção real dos comprimentos (4.440 / 4.709 mm).
- **Chegada:** ao entrar na viewport (IntersectionObserver), cada carro entra de 80vw do seu lado em 1.05s, `cubic-bezier(.3, .7, .25, 1)`, com desfoque de 4px que some até 70%; o da direita com atraso de .12s. A sombra de contato cresce de 30% para 100% junto.
- **Assentar:** ao parar, .55s ease-out de suspensão: desce 6px girando 1.4° para frente, volta 1px passando do ponto, assenta.
- **Cotas:** linhas de cota de 2px com terminais de 16px se desenham do centro (`scaleX` 0 → 1, .6s, curva de saída) a partir de .95s, e o texto "Modelo · comprimento mm" aparece em .35s a partir de 1.35s.
- **Movimento reduzido:** sem `prefers-reduced-motion: no-preference`, os carros já estão no lugar, sombras e cotas visíveis, nenhuma animação nem transição em todo o site (incluindo a entrada dos itens marcados e a view transition entre páginas).

## Do's and Don'ts

### Do:
- **Do** montar toda superfície nova como uma etiqueta: moldura de 4px, faixa preta de cabeçalho, campos internos separados por fios de 2px.
- **Do** usar a régua A–E só para comparar valores reais entre as versões na tela, sempre em barra com ponta de seta.
- **Do** escrever "Não divulgado" por extenso e manter o asterisco de fonte secundária; a falta de dado é informação.
- **Do** estreitar a Archivo para dar hierarquia (62–68% display, 80% rótulos e botões, 100% texto) e manter algarismos tabulares.
- **Do** marcar foco e seleção com tinta: contorno de 3px com afastamento de 3px; seleção de texto em fundo tinta e texto papel; em faixas pretas, contorno papel.
- **Do** desenhar ícones em CSS (máscara SVG em `currentColor` ou traços), na mesma espessura dos fios.
- **Do** respeitar `prefers-reduced-motion`: estado final imediato, sem trocar o conteúdo.

### Don't:
- **Don't** arredondar cantos.
- **Don't** usar verde, amarelo, laranja ou vermelho como nota absoluta de um carro, cor de marca, botão, link, fundo ou decoração.
- **Don't** introduzir uma cor de acento (o azul de portal de carros) ou o fundo creme com serifa do visual anterior.
- **Don't** criar elevação com sombra; hover é troca de fundo ou inversão.
- **Don't** usar fontes de ícones ou glifos como ícone.
- **Don't** colocar uma segunda família tipográfica.
