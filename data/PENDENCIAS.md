# Pendências da base (coleta de 19–21/10/2026)

Base: 45 marcas, 281 modelos, 800 versões (após a revisão de anos-modelo em 21/10/2026). Todos os arquivos passam em `scripts/validar.mjs` sem erros.

## Cobertura dos campos
| Campo | Versões com dado |
|---|---|
| Preço sugerido | 90% |
| Potência | 99% |
| Comprimento | 96% |
| Porta-malas | 75% |
| 0–100 km/h | 74% |
| **Consumo** | **90,5%** (eram 36%): 726 de 802 versões. São 699 do PBEV (87% da base), 21 de fonte secundária e 6 do site da marca (recontado em 22/10/2026) |
| Versões com algum campo de fonte secundária | ~13% |

## Prioridade 1: consumo, restante
Preenchido a partir da **tabela PBEV/Inmetro 2026** (atualização 14/ago/2026), fonte `inmetro_pbev`:
391 versões que estavam vazias, 39 que tinham consumo de fonte secundária e 25 autonomias elétricas.
Casamento feito por marca, modelo, propulsão, combustível, cilindrada, turbo, câmbio e nome da versão, com revisão manual dos ambíguos.
- **Padronizado pelo PBEV** (decisão do usuário, 21/10/2026): as 236 versões que tinham consumo do site da marca
  também passaram a usar o PBEV, e 666 versões têm consumo PBEV. Só 13 versões sem linha no PBEV mantêm o consumo do site:
  X6 40i, Tiggo 9, S10 Trail Boss, Haval H7, Civic Type R, Lexus ES, AMG GLB 35, G 63 Manufaktur, AMG GT, Countryman JCW e Jaecoo 5.
- **2ª rodada (21/10/2026)**:
  - 33 duplicatas do PBEV foram desfeitas com dados oficiais. Os critérios foram siglas da versão (Macan E4/E4S…), tração, autonomia PBEV (Volvo, BYD, Audi) e valores citados por matérias que apontam qual linha é a atual (T-Cross 2027, Tiggo 7 Sport e Tiggo 8 PHEV, Saveiro CS).
  - 16 versões ganharam consumo de **fonte secundária** (matérias citando o Inmetro), marcado em `campos_fonte_secundaria`: i20 1.0 TGDI AT, CS55, CS75, Jetour S08, Ranger Raptor, Leapmotor B10 REEV, Triton Tarmac/Savana/Sertões/BF///MS, Tunland V9, Mini JCW GP e bZ4X.
- **Ainda sem consumo (76 versões)**:
  - **45 exóticas** (Aston Martin, Ferrari, Lamborghini, Maserati, McLaren, Rolls-Royce): não participam do PBEV, e só existe consumo WLTP combinado, que não se encaixa em cidade/estrada;
  - **31 outras**, sem dado confiável encontrado:
    - **Fora do PBEV:** Tiggo 9 PHEV, CS55 PHEV, Denza Z9 GT/D9, Kia EV9, ID.4, RAV4 PHEV XSE, Classe V, G 63, AMG GLC 53, GR Corolla e Ram 2500/3500 (picapes pesadas, isentas);
    - **Duplicatas sem matéria que desempate:** Tiggo 7 Pro e Pro PHEV, i20 1.0 MT, Kardian Evolution AT, Taycan GTS/Turbo S, Cayenne GTS e Cayenne Electric S;
    - **Sem linha própria:** S10 100 Anos, Ranger XL CD AT, Hunter 4Work MT e Saveiro Extreme CD.
- Scripts e dados do casamento estão em `scratchpad/pbev/`: `parse.mjs`, `casar.mjs`, `alias.json`, `manual.json`, `aplicar.mjs`, `extra.json` e `aplicar-extra.mjs`.

## Prioridade 2: dados inferidos ou calculados (resolvido em 21/10/2026)
- **GWM Ora 03**: comprimento (4.235), largura (1.825) e altura (1.603) agora vêm de fontes secundárias (Webmotors, car.blog.br, Itatiaia). O peso da BEV58 não é divulgado, então virou `null`.
- **Mercedes-Benz**:
  - C 200 e C 300 traseira, pela ficha oficial europeia;
  - GLA 200 dianteira e V 300 traseira, por fontes secundárias;
  - CLA 200 e E 300 sem fonte → `null`.
- **Exóticas**:
  - Revuelto: DCT de 8 marchas confirmado no site oficial;
  - MCPura e Temerario: DCT de 8 marchas, e Ferrari Luce: redução única, confirmados por fontes secundárias.
- **Controle de estabilidade**: virou regra documentada no README. É obrigatório desde 1º/jan/2024 (Contran 567/2015 e 799/2020), por isso fica sempre `true`; as 30 versões que estavam `null` foram ajustadas.
- **Toyota**: Hilux e SW4 Argentina e GR Yaris Japão, por fontes secundárias; GR Corolla sem fonte → `null`.
- **Inferências menores citadas pelos agentes, ainda sem revisão**:
  - VW: nº de cilindros deduzido da cilindrada; tração dianteira da Saveiro;
  - Amarok 4Motion registrado como 4x4 sem reduzida;
  - tração escolhida na F-150, Maverick Tremor e Bronco Sport;
  - transmissão "DHT" e "Redução única" nos BYD (a marca não informa).

## Prioridade 3: anos-modelo (resolvido em 21/10/2026)
- **Regras novas no README**:
  - vale o ano-modelo que o site oficial oferece;
  - quando a marca não informa o ano, usa-se a Tabela FIPE ou anúncios de 0 km, marcando `ano_modelo` como fonte secundária;
  - nas exóticas, adota-se o ano corrente, com nota.
- **Ano confirmado via FIPE** (secundária): Geely EX2, EX5 e EX5 EM-i (2026) e JAC Hunter 4Work (2026).
  Também ficam como fonte secundária, como já estavam: Lexus RX/RZ/ES, Denza, Omoda & Jaecoo, GAC e Avatr.
- **Removidos da base** (sem evidência de 2026/2027):
  - Hyundai IONIQ 5: só existe como 2024/25 e 2025;
  - BYD Dolphin Plus: só 2025 na FIPE;
  - JAC E-JS4: último ano na FIPE é 2023;
  - JAC E-J7: FIPE só 0 km/2022/2023.
  A base passou a ter 281 modelos e 800 versões. Os backups estão no scratchpad (`backup-marcas-4`).
- **Exóticas** (45 versões): a nota "ano-modelo informado como 2026" virou "não divulgado; adotado o ano corrente".
- **Mantido como está**: versões 2026 que ainda aparecem na API, mas não no site (Jeep Renegade/Commander, Ram Rampage/Dakota, Range Rover/RR Sport), seguem fora, pela regra "o que o site oferece".
- **A verificar**: a FIPE já lista a JAC Hunter (4Work, HD, HDX) como **2027**, mas o site da JAC não diferencia. Hoje a base só tem o 2026.

## Prioridade 4: modelos fora por serem de ano-modelo anterior (reavaliado em 22/10/2026)
- **Incluído**: **Ford Mustang Dark Horse 2026**. A imprensa (Autoo, Gazeta SP) e a FIPE confirmam o 2026 por R$ 649 mil.
  - Potência e torque vêm do site oficial; câmbio de 10 marchas e consumo, do PBEV; 0–100 e velocidade máxima, da imprensa.
  - Dimensões, peso, tração e boa parte dos equipamentos ficaram `null`.
- **Continuam fora** (sem evidência de 2026/2027 em 22/10/2026):
  - só 2025 ou "0 km" na FIPE: Mustang Mach-E, BMW i4, BYD Tan e Dolphin Plus, Kia EV5, Hyundai IONIQ 5;
  - sem indício de 2026: Volvo EX90 e Renault Megane E-Tech;
  - Kia Stonic: o renovado ainda não foi lançado;
  - Mustang GT Performance: listado como "futuro lançamento";
  - Mercedes AMG GT 4 portas: 25/25;
  - Fiat 500e: 2022;
  - JAC E-JS4 (2023) e E-J7 (2022/23);
  - Blazer EV: situação desconhecida.
- **Saíram do mercado**: Chevrolet Equinox EV (esgotou em jul/2026) e Porsche 718 (fora de linha).

## Outros pontos (revisados em 22/10/2026)
- **Preços de fonte secundária**: Hyundai (HB20/HB20S 2027, Kona, Palisade) e GAC (12 versões).
  Não há tabela oficial pública; os valores conferem com Autoo, Webmotors e FIPE 0 km e seguem marcados como secundários.
  **Sem preço** (a marca não divulga): Denza, Zeekr e as exóticas.
- **VW Saveiro Robust Etanol**: incluída, com preço de R$ 111.490, 116 cv e 16,1 kgfm, conforme o release oficial de 08/10/2026.
  O consumo cidade/estrada (8,1/8,9) é de fonte secundária; o combinado oficial é 8,5 km/l.
- **JAC Hunter 4Work AT**: o site oficial mostra mesmo R$ 264.900, acima da HD (R$ 259.900). O valor foi mantido, com nota.
- **Equipamentos esparsos**:
  - **Fiat**: as 6 versões foram completadas pela API de itens de série, que voltou a funcionar;
  - **Mercedes e Rolls-Royce**: sem fonte (a Mercedes não publica lista de itens), continuam `null` em airbags, multimídia, painel e CarPlay.
- **Largura**: criado o campo `dimensoes_mm.largura_com_retrovisores`.
  - Preenchido em 104 versões: Audi, Fiat, Ford, Jeep, Lamborghini, Land Rover (XML do configurador), Mercedes (API do site) e Citroën Aircross.
  - Ainda há 74 versões sem nenhuma largura (Peugeot, Basalt, Ram e exóticas, entre outras).
- **Categorias limítrofes**:
  - Mudaram BMW X1, iX1, X2 e iX2 (→ SUV Compacto, junto com Q3, GLA e UX), Outlander PHEV (→ SUV Grande, 7 lugares) e Lexus RZ (→ SUV Médio, como o bZ4X);
  - Mantidos pelo posicionamento: Niro, Bronco Sport, Sealion 7, Defender 90, Velar, Q3 e Grecale; Zeekr 001 continua como Perua.
  - O critério foi documentado no README.

## Descartadas (sem venda oficial de carro novo no Brasil em 10/2026)
Subaru, Jaguar, Bentley, Neta, Dodge, Xpeng, Lynk & Co, iCaur, Smart, Polestar, Tesla, Mazda, Seres, Haima.
