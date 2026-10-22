# Base de dados de carros — convenções

Base de modelos e versões de carros **vendidos oficialmente no Brasil**, anos-modelo **2026 e 2027**.
Fonte primária: **sites oficiais das fabricantes** (página do modelo, configurador, ficha técnica em PDF,
site de imprensa oficial da marca). Fontes secundárias só para preencher lacunas, e sempre sinalizadas.

## Estrutura de arquivos

```
data/
  README.md              ← este arquivo (convenções)
  exemplo.json           ← exemplo completo de um arquivo de marca
  marcas/<slug>.json     ← um arquivo por marca (gerado pela coleta)
  carros.json            ← arquivo unificado (gerado por scripts/unir.mjs)
scripts/
  validar.mjs            ← valida um ou mais arquivos de marca
  unir.mjs               ← valida tudo e gera data/carros.json
```

Validar um arquivo: `node scripts/validar.mjs data/marcas/fiat.json`

## Arquivo de marca

```jsonc
{
  "marca": "Fiat",
  "slug": "fiat",                     // kebab-case, igual ao nome do arquivo
  "site_oficial": "https://www.fiat.com.br",
  "coletado_em": "2026-10-19",        // AAAA-MM-DD
  "modelos": [ /* Modelo */ ]
}
```

## Modelo

| campo | tipo | notas |
|---|---|---|
| `id` | string | `<marca>-<modelo>` em kebab-case. Ex.: `fiat-fastback` |
| `modelo` | string | Nome comercial: `Fastback`, `Onix Plus`, `Série 3` |
| `categoria` | enum | Ver **Categorias** |
| `subcategoria` | string\|null | Livre e opcional: `SUV cupê`, `Picape compacta`, `Picape média`, `Picape grande`, `Sedan compacto`… |
| `propulsoes` | string[] | Resumo das propulsões oferecidas no modelo (mesmo enum de `tipo_propulsao`) |
| `pais_fabricacao` | string\|null | `Brasil`, `Argentina`, `China`, `México`… |
| `imagem` | objeto\|null | Foto lateral do modelo, sem fundo: `{ "arquivo": "img/carros/<id>.webp", "fonte_imagem": url, "pagina_origem": url\|null }`. Uma foto por modelo, compartilhada pelas versões. Registro completo da coleta em `data/imagens.json`. |
| `fontes` | Fonte[] | Pelo menos 1. Ver **Fontes** |
| `versoes` | Versao[] | Pelo menos 1 |

## Versão

**Uma entrada por ano-modelo**: se a versão existe em 2026 e 2027, são duas entradas.
Vale o ano-modelo que o **site oficial oferece**. Versões que aparecem só na API ou no estoque, sem oferta no site, não entram.
Quando a marca não informa o ano, use a Tabela FIPE ou anúncios de 0 km e liste `ano_modelo` em `campos_fonte_secundaria`.
Marcas exóticas que não divulgam o ano usam o ano corrente, com nota em `observacoes`.

| campo | tipo | notas |
|---|---|---|
| `id` | string | `<id do modelo>-<versao>-<ano>`. Ex.: `fiat-fastback-abarth-2026`. Único na base. |
| `versao` | string | Nome como a fabricante usa: `Abarth`, `Impetus Hybrid`, `Highline 200 TSI` |
| `ano_modelo` | 2026\|2027 | |
| `status` | enum | `À venda` \| `Pré-venda` |
| `preco_sugerido_brl` | inteiro\|null | Preço público sugerido no site da fabricante (versão de entrada da versão, sem opcionais/pintura/frete). `null` se a marca não divulga. |
| `preco_obs` | string\|null | Ex.: `Preço SP, com frete`, `Preço promocional até 31/10` |
| `motor` | Motor | |
| `transmissao` | `{ "tipo": enum, "marchas": inteiro\|null }` | tipo: `Manual`, `Automática`, `CVT`, `Automatizada de dupla embreagem`, `Automatizada`, `Redução única`, `e-CVT`, `DHT` |
| `tracao` | enum | `Dianteira`, `Traseira`, `Integral (AWD)`, `4x4 (com reduzida)`, `4x4 (sem reduzida)`, `4x2` |
| `desempenho` | `{ "aceleracao_0_100_s", "velocidade_maxima_kmh" }` | números ou null. Em flex, usar o dado com etanol se a marca separar. |
| `consumo` | Consumo | Valores do **PBEV/Inmetro** quando a marca divulgar |
| `dimensoes_mm` | `{ comprimento, largura, largura_com_retrovisores, altura, entre_eixos, altura_livre_solo }` | inteiros ou null. `largura` é **sem** retrovisores. `largura_com_retrovisores` é com os retrovisores abertos, para as marcas que só publicam essa medida. |
| `peso_kg` | inteiro\|null | Peso em ordem de marcha |
| `porta_malas_l` | inteiro\|null | Volume padrão (5 lugares, sem rebater). Em 7 lugares, com a 3ª fila rebatida. |
| `tanque_l` | número\|null | null em elétricos |
| `lugares` | inteiro\|null | |
| `portas` | inteiro\|null | |
| `pneus` | string\|null | `215/45 R18` |
| `picape` | objeto\|null | Só para Picape: `{ "cabine": "Simples"\|"Dupla"\|"Estendida", "cacamba_l": n\|null, "capacidade_carga_kg": n\|null }` |
| `equipamentos` | Equipamentos | |
| `fonte_url` | string\|null | URL mais específica da versão, se houver |
| `campos_fonte_secundaria` | string[] | Caminhos dos campos que vieram de fonte NÃO oficial. Ex.: `["desempenho.aceleracao_0_100_s"]`. Vazio se tudo for oficial. |
| `observacoes` | string\|null | |

### Motor

```jsonc
{
  "tipo_propulsao": "Combustão",   // Combustão | Híbrido leve (MHEV) | Híbrido (HEV) | Híbrido plug-in (PHEV) | Elétrico (BEV) | Elétrico com extensor (EREV)
  "combustivel": "Flex",           // Flex | Gasolina | Etanol | Diesel | Elétrico
  "descricao": "1.3 T270 Turbo Flex",
  "cilindrada_cm3": 1332,          // null em elétricos
  "cilindros": 4,
  "turbo": true,
  "potencia_cv":  { "etanol": 185, "gasolina": 180 },
  "torque_kgfm":  { "etanol": 27.5, "gasolina": 27.5 },
  "bateria_kwh": null,             // capacidade útil se informada, senão bruta
  "autonomia_eletrica_km": null,   // número
  "autonomia_ciclo": null          // "PBEV/Inmetro" | "WLTP" | "NEDC" | "CLTC" | "Fabricante"
}
```

`potencia_cv` e `torque_kgfm` aceitam as chaves: `etanol`, `gasolina`, `diesel`,
`eletrico` (motor(es) elétrico(s)), `combinada` (potência/torque total do sistema em híbridos).
Use só as chaves que se aplicam. Conversões: `kW × 1,35962 = cv`; `Nm ÷ 9,80665 = kgfm` (1 casa decimal).

### Consumo

Chaves (todas opcionais, km/l, exceto elétrico em km/le):
`cidade_etanol`, `estrada_etanol`, `cidade_gasolina`, `estrada_gasolina`,
`cidade_diesel`, `estrada_diesel`, `cidade_eletrico_km_le`, `estrada_eletrico_km_le`.
Objeto vazio `{}` se a marca não divulga.

### Equipamentos

Todos os campos existem sempre; `null` = não foi possível confirmar.

**Exceção, `controle_estabilidade`:** é obrigatório em todo carro novo vendido no Brasil desde 1º/jan/2024
(Resolução Contran 567/2015, com prazo alterado pela 799/2020). Por isso o campo é sempre `true`, mesmo quando a ficha não cita o item.

```jsonc
{
  "airbags": 6,                              // inteiro|null
  "controle_estabilidade": true,
  "frenagem_autonoma_emergencia": true,
  "piloto_automatico_adaptativo": true,      // ACC
  "assistente_permanencia_faixa": true,
  "alerta_ponto_cego": true,
  "camera_re": true,
  "camera_360": false,
  "sensor_estacionamento_dianteiro": false,
  "farois_led": true,
  "ar_condicionado": "Digital",              // "Manual" | "Digital" | "Digital dual zone" | "Digital 3+ zonas" | null
  "multimidia_polegadas": 10.1,              // número|null (null = sem multimídia ou desconhecido)
  "carplay_android_auto": "Sem fio",         // "Sem fio" | "Com fio" | "Não" | null
  "painel_digital": true,
  "carregador_inducao": true,
  "partida_sem_chave": true,
  "bancos_couro": true,                      // couro ou couro sintético
  "banco_motorista_eletrico": false,
  "teto_solar": false,                       // inclui panorâmico
  "rodas_polegadas": 18,
  "rodas_liga_leve": true,
  "destaques": ["Teto bicolor", "Volante com paddle shifts", "..."]   // até ~15 itens que diferenciam a versão
}
```

## Categorias

`SUV Compacto` · `SUV Médio` · `SUV Grande` · `Hatch` · `Sedan` · `Picape` · `Perua/Station Wagon` · `Minivan` · `Cupê/Conversível`

Regras práticas. O comprimento é um guia; quando ele for limítrofe, prevalece o posicionamento consagrado no mercado BR,
isto é, com quem o modelo concorre. Modelos do mesmo segmento ficam na mesma categoria: por exemplo, os
"SUVs compactos premium" Q3, X1, X2, GLA, UX, EX40 e Countryman ficam todos em SUV Compacto. SUVs de 7 lugares
com 4,70 m ou mais vão para SUV Grande.

- **SUV Compacto**: SUVs/crossovers até ~4,45 m (Pulse, Fastback, T-Cross, Nivus, Tera, Creta, Kicks, Tracker, HR-V, Renegade, Kardian, Basalt, 2008).
- **SUV Médio**: ~4,45 m a ~4,80 m (Compass, Corolla Cross, Taos, Tucson, Sportage, Haval H6, Song Plus, X3, GLC, Q5).
- **SUV Grande**: acima de ~4,80 m ou 7 lugares de porte grande (Commander, SW4, Trailblazer, Tiggo 8, X5, X7, GLE, Q7, Defender 110, Tahoe).
- **Hatch**: hatchbacks de qualquer porte (Mobi, Argo, Polo, HB20, Onix, 208, Dolphin, Golf GTI, Série 1, A3 Sportback).
- **Sedan**: sedãs, incluindo fastbacks de 4 portas tipo Gran Coupé (Cronos, Virtus, Onix Plus, Corolla, Civic, Série 3, Classe C, Seal, Panamera fica em Sedan).
- **Picape**: todas as picapes (Strada, Saveiro, Montana, Toro, Rampage, Maverick, Hilux, Ranger, S10, Titano, Ram 1500, Shark). Use `subcategoria` para compacta/intermediária/média/grande e preencha `picape`.
- **Perua/Station Wagon**: peruas (ex.: Porsche Taycan Cross Turismo, Audi RS6 Avant, Volvo V60 se houver).
- **Minivan**: Spin, Carnival, Denza D9, GAC M8, ID. Buzz, Classe V etc.
- **Cupê/Conversível**: cupês de 2 portas e conversíveis (911, Série 4 Coupé/Cabrio, Mustang, Z4, Classe CLE, AMG GT, Ferrari etc.). SUVs-cupê (X6, GLE Coupé) continuam em SUV.

**Fora do escopo**: furgões e vans de carga/passageiros comerciais (Fiorino, Ducato, Master, Sprinter, Expert, Transit), caminhões, chassis-cabine, versões exclusivas para PcD/frotistas/taxistas que não aparecem no site para o público geral, e modelos que só existem como encomenda especial sem página no site BR.

## Fontes

```jsonc
{ "url": "https://...", "tipo": "site_oficial", "acessado_em": "2026-10-19" }
```

`tipo`: `site_oficial` (site da marca, configurador), `ficha_tecnica_pdf` (PDF oficial),
`imprensa_oficial` (site de imprensa/newsroom da marca no Brasil), `inmetro_pbev` (tabela oficial
PBEV/Inmetro — usada para consumo e autonomia elétrica), `secundaria` (qualquer outra —
só para lacunas; listar o campo em `campos_fonte_secundaria`).

## Regras gerais

- **Nunca inventar dado.** Se não foi possível confirmar: `null` (ou `{}` em consumo).
- Números como números (`159990`, não `"R$ 159.990"`). Decimal com ponto.
- Textos em português do Brasil, com acentos.
- Só versões listadas para venda ao público no Brasil, anos-modelo 2026/2027.
