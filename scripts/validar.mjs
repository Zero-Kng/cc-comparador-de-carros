// Valida arquivos de marca contra as convenções de data/README.md.
// Uso: node scripts/validar.mjs data/marcas/fiat.json [outro.json ...]
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { pathToFileURL } from 'node:url';

export const CATEGORIAS = ['SUV Compacto', 'SUV Médio', 'SUV Grande', 'Hatch', 'Sedan', 'Picape', 'Perua/Station Wagon', 'Minivan', 'Cupê/Conversível'];
export const PROPULSOES = ['Combustão', 'Híbrido leve (MHEV)', 'Híbrido (HEV)', 'Híbrido plug-in (PHEV)', 'Elétrico (BEV)', 'Elétrico com extensor (EREV)'];
const COMBUSTIVEIS = ['Flex', 'Gasolina', 'Etanol', 'Diesel', 'Elétrico'];
const TRANSMISSOES = ['Manual', 'Automática', 'CVT', 'Automatizada de dupla embreagem', 'Automatizada', 'Redução única', 'e-CVT', 'DHT'];
const TRACOES = ['Dianteira', 'Traseira', 'Integral (AWD)', '4x4 (com reduzida)', '4x4 (sem reduzida)', '4x2'];
const STATUS = ['À venda', 'Pré-venda'];
const TIPOS_FONTE = ['site_oficial', 'ficha_tecnica_pdf', 'imprensa_oficial', 'inmetro_pbev', 'secundaria'];
const CICLOS = ['PBEV/Inmetro', 'WLTP', 'NEDC', 'CLTC', 'EPA', 'Fabricante'];
const AR = ['Manual', 'Digital', 'Digital dual zone', 'Digital 3+ zonas'];
const CARPLAY = ['Sem fio', 'Com fio', 'Não'];
const CABINES = ['Simples', 'Dupla', 'Estendida'];
const CHAVES_FONTE_ENERGIA = ['etanol', 'gasolina', 'diesel', 'eletrico', 'combinada'];
const CHAVES_CONSUMO = ['cidade_etanol', 'estrada_etanol', 'cidade_gasolina', 'estrada_gasolina', 'cidade_diesel', 'estrada_diesel', 'cidade_eletrico_km_le', 'estrada_eletrico_km_le'];

const CAMPOS_MARCA = ['marca', 'slug', 'site_oficial', 'coletado_em', 'modelos'];
const CAMPOS_MODELO = ['id', 'modelo', 'categoria', 'subcategoria', 'propulsoes', 'pais_fabricacao', 'imagem', 'fontes', 'versoes'];
const CAMPOS_VERSAO = ['id', 'versao', 'ano_modelo', 'status', 'preco_sugerido_brl', 'preco_obs', 'motor', 'transmissao', 'tracao', 'desempenho', 'consumo', 'dimensoes_mm', 'peso_kg', 'porta_malas_l', 'tanque_l', 'lugares', 'portas', 'pneus', 'picape', 'equipamentos', 'fonte_url', 'campos_fonte_secundaria', 'observacoes'];
const CAMPOS_MOTOR = ['tipo_propulsao', 'combustivel', 'descricao', 'cilindrada_cm3', 'cilindros', 'turbo', 'potencia_cv', 'torque_kgfm', 'bateria_kwh', 'autonomia_eletrica_km', 'autonomia_ciclo'];
const CAMPOS_DIM = ['comprimento', 'largura', 'largura_com_retrovisores', 'altura', 'entre_eixos', 'altura_livre_solo'];
const CAMPOS_EQUIP_BOOL = ['controle_estabilidade', 'frenagem_autonoma_emergencia', 'piloto_automatico_adaptativo', 'assistente_permanencia_faixa', 'alerta_ponto_cego', 'camera_re', 'camera_360', 'sensor_estacionamento_dianteiro', 'farois_led', 'painel_digital', 'carregador_inducao', 'partida_sem_chave', 'bancos_couro', 'banco_motorista_eletrico', 'teto_solar', 'rodas_liga_leve'];
const CAMPOS_EQUIP = ['airbags', 'ar_condicionado', 'multimidia_polegadas', 'carplay_android_auto', 'rodas_polegadas', 'destaques', ...CAMPOS_EQUIP_BOOL];

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;

export function validarMarca(dados, nomeArquivo = '') {
  const erros = [];
  const avisos = [];
  const err = (c, m) => erros.push(`${c}: ${m}`);
  const warn = (c, m) => avisos.push(`${c}: ${m}`);

  const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
  const isInt = (v) => Number.isInteger(v);
  const numOuNull = (c, v) => { if (v !== null && !isNum(v)) err(c, `deve ser número ou null (recebido ${JSON.stringify(v)})`); };
  const intOuNull = (c, v) => { if (v !== null && !isInt(v)) err(c, `deve ser inteiro ou null (recebido ${JSON.stringify(v)})`); };
  const strOuNull = (c, v) => { if (v !== null && typeof v !== 'string') err(c, 'deve ser string ou null'); };
  const boolOuNull = (c, v) => { if (v !== null && typeof v !== 'boolean') err(c, 'deve ser boolean ou null'); };
  const enumOuNull = (c, v, lista) => { if (v !== null && !lista.includes(v)) err(c, `valor "${v}" fora do enum [${lista.join(' | ')}]`); };
  const faixa = (c, v, min, max) => { if (isNum(v) && (v < min || v > max)) warn(c, `valor ${v} fora da faixa plausível ${min}–${max}`); };
  const exatas = (c, obj, campos) => {
    if (!isObj(obj)) { err(c, 'deve ser objeto'); return false; }
    for (const k of campos) if (!(k in obj)) err(c, `campo obrigatório ausente: ${k}`);
    for (const k of Object.keys(obj)) if (!campos.includes(k)) err(c, `campo desconhecido: ${k}`);
    return true;
  };
  const mapaEnergia = (c, obj) => {
    if (!isObj(obj)) { err(c, 'deve ser objeto'); return; }
    for (const [k, v] of Object.entries(obj)) {
      if (!CHAVES_FONTE_ENERGIA.includes(k)) err(c, `chave inválida: ${k}`);
      if (!isNum(v)) err(`${c}.${k}`, 'deve ser número');
    }
  };

  if (!exatas('marca', dados, CAMPOS_MARCA)) return { erros, avisos };
  if (typeof dados.marca !== 'string' || !dados.marca) err('marca', 'nome obrigatório');
  if (!SLUG.test(dados.slug ?? '')) err('slug', 'deve ser kebab-case');
  if (nomeArquivo && basename(nomeArquivo, '.json') !== dados.slug) err('slug', `difere do nome do arquivo (${basename(nomeArquivo)})`);
  if (!DATA.test(dados.coletado_em ?? '')) err('coletado_em', 'formato AAAA-MM-DD');
  if (!Array.isArray(dados.modelos) || dados.modelos.length === 0) { err('modelos', 'lista não vazia obrigatória'); return { erros, avisos }; }

  const ids = new Set();
  const idUnico = (c, id) => { if (ids.has(id)) err(c, `id duplicado: ${id}`); ids.add(id); };

  for (const [i, m] of dados.modelos.entries()) {
    const cm = `modelos[${i}]${m?.modelo ? ` (${m.modelo})` : ''}`;
    if (!exatas(cm, m, CAMPOS_MODELO)) continue;
    if (!SLUG.test(m.id) || !m.id.startsWith(`${dados.slug}-`)) err(`${cm}.id`, `deve ser kebab-case iniciando com "${dados.slug}-"`);
    idUnico(`${cm}.id`, m.id);
    if (!CATEGORIAS.includes(m.categoria)) err(`${cm}.categoria`, `"${m.categoria}" fora do enum`);
    strOuNull(`${cm}.subcategoria`, m.subcategoria);
    strOuNull(`${cm}.pais_fabricacao`, m.pais_fabricacao);
    if (m.imagem !== null && exatas(`${cm}.imagem`, m.imagem, ['arquivo', 'fonte_imagem', 'pagina_origem'])) {
      if (typeof m.imagem.arquivo !== 'string' || !/^img\/carros\/[a-z0-9-]+\.webp$/.test(m.imagem.arquivo)) err(`${cm}.imagem.arquivo`, 'deve ser "img/carros/<id>.webp"');
      strOuNull(`${cm}.imagem.fonte_imagem`, m.imagem.fonte_imagem);
      strOuNull(`${cm}.imagem.pagina_origem`, m.imagem.pagina_origem);
    }
    if (m.imagem === null) warn(cm, 'sem imagem');
    if (!Array.isArray(m.propulsoes) || m.propulsoes.some((p) => !PROPULSOES.includes(p))) err(`${cm}.propulsoes`, 'lista com valores do enum de propulsão');
    if (!Array.isArray(m.fontes) || m.fontes.length === 0) err(`${cm}.fontes`, 'pelo menos 1 fonte');
    else for (const [j, f] of m.fontes.entries()) {
      const cf = `${cm}.fontes[${j}]`;
      if (!exatas(cf, f, ['url', 'tipo', 'acessado_em'])) continue;
      if (!/^https?:\/\//.test(f.url)) err(cf, 'url inválida');
      if (!TIPOS_FONTE.includes(f.tipo)) err(cf, `tipo "${f.tipo}" inválido`);
      if (!DATA.test(f.acessado_em)) err(cf, 'acessado_em AAAA-MM-DD');
    }
    if (m.fontes?.length && m.fontes.every((f) => f.tipo === 'secundaria')) warn(cm, 'só tem fontes secundárias');
    if (!Array.isArray(m.versoes) || m.versoes.length === 0) { err(`${cm}.versoes`, 'lista não vazia obrigatória'); continue; }

    const propulsoesVersoes = new Set();
    for (const [j, v] of m.versoes.entries()) {
      const cv = `${cm}.versoes[${j}]${v?.versao ? ` (${v.versao} ${v.ano_modelo})` : ''}`;
      if (!exatas(cv, v, CAMPOS_VERSAO)) continue;
      if (!SLUG.test(v.id) || !v.id.startsWith(`${m.id}-`) || !v.id.endsWith(`-${v.ano_modelo}`)) err(`${cv}.id`, `deve ser "${m.id}-<versao>-${v.ano_modelo}" em kebab-case`);
      idUnico(`${cv}.id`, v.id);
      if (typeof v.versao !== 'string' || !v.versao) err(`${cv}.versao`, 'obrigatório');
      if (![2026, 2027].includes(v.ano_modelo)) err(`${cv}.ano_modelo`, 'deve ser 2026 ou 2027');
      if (!STATUS.includes(v.status)) err(`${cv}.status`, `"${v.status}" inválido`);
      intOuNull(`${cv}.preco_sugerido_brl`, v.preco_sugerido_brl);
      faixa(`${cv}.preco_sugerido_brl`, v.preco_sugerido_brl, 50000, 15000000);
      strOuNull(`${cv}.preco_obs`, v.preco_obs);

      const mo = v.motor;
      if (exatas(`${cv}.motor`, mo, CAMPOS_MOTOR)) {
        if (!PROPULSOES.includes(mo.tipo_propulsao)) err(`${cv}.motor.tipo_propulsao`, `"${mo.tipo_propulsao}" inválido`);
        else propulsoesVersoes.add(mo.tipo_propulsao);
        if (!COMBUSTIVEIS.includes(mo.combustivel)) err(`${cv}.motor.combustivel`, `"${mo.combustivel}" inválido`);
        strOuNull(`${cv}.motor.descricao`, mo.descricao);
        intOuNull(`${cv}.motor.cilindrada_cm3`, mo.cilindrada_cm3);
        intOuNull(`${cv}.motor.cilindros`, mo.cilindros);
        boolOuNull(`${cv}.motor.turbo`, mo.turbo);
        mapaEnergia(`${cv}.motor.potencia_cv`, mo.potencia_cv);
        mapaEnergia(`${cv}.motor.torque_kgfm`, mo.torque_kgfm);
        for (const [k, p] of Object.entries(mo.potencia_cv ?? {})) faixa(`${cv}.motor.potencia_cv.${k}`, p, k === 'eletrico' ? 5 : 40, 1600);
        for (const t of Object.values(mo.torque_kgfm ?? {})) faixa(`${cv}.motor.torque_kgfm`, t, 5, 200);
        if (isObj(mo.potencia_cv) && Object.keys(mo.potencia_cv).length === 0) warn(`${cv}.motor.potencia_cv`, 'vazio');
        numOuNull(`${cv}.motor.bateria_kwh`, mo.bateria_kwh);
        numOuNull(`${cv}.motor.autonomia_eletrica_km`, mo.autonomia_eletrica_km);
        enumOuNull(`${cv}.motor.autonomia_ciclo`, mo.autonomia_ciclo, CICLOS);
        if (mo.autonomia_eletrica_km !== null && mo.autonomia_ciclo === null) warn(`${cv}.motor`, 'autonomia sem ciclo informado');
        if (mo.combustivel === 'Elétrico' && mo.tipo_propulsao !== 'Elétrico (BEV)') warn(`${cv}.motor`, 'combustível Elétrico com propulsão não-BEV');
      }

      if (exatas(`${cv}.transmissao`, v.transmissao, ['tipo', 'marchas'])) {
        if (!TRANSMISSOES.includes(v.transmissao.tipo)) err(`${cv}.transmissao.tipo`, `"${v.transmissao.tipo}" inválido`);
        intOuNull(`${cv}.transmissao.marchas`, v.transmissao.marchas);
      }
      enumOuNull(`${cv}.tracao`, v.tracao, TRACOES);
      if (v.tracao === null) warn(`${cv}.tracao`, 'null');

      if (exatas(`${cv}.desempenho`, v.desempenho, ['aceleracao_0_100_s', 'velocidade_maxima_kmh'])) {
        numOuNull(`${cv}.desempenho.aceleracao_0_100_s`, v.desempenho.aceleracao_0_100_s);
        numOuNull(`${cv}.desempenho.velocidade_maxima_kmh`, v.desempenho.velocidade_maxima_kmh);
        faixa(`${cv}.desempenho.aceleracao_0_100_s`, v.desempenho.aceleracao_0_100_s, 2, 25);
        faixa(`${cv}.desempenho.velocidade_maxima_kmh`, v.desempenho.velocidade_maxima_kmh, 100, 400);
      }

      if (!isObj(v.consumo)) err(`${cv}.consumo`, 'deve ser objeto');
      else for (const [k, val] of Object.entries(v.consumo)) {
        if (!CHAVES_CONSUMO.includes(k)) err(`${cv}.consumo`, `chave inválida: ${k}`);
        if (!isNum(val)) err(`${cv}.consumo.${k}`, 'deve ser número');
        else faixa(`${cv}.consumo.${k}`, val, 3, k.includes('eletrico') ? 120 : 40);
      }

      if (exatas(`${cv}.dimensoes_mm`, v.dimensoes_mm, CAMPOS_DIM)) {
        for (const k of CAMPOS_DIM) intOuNull(`${cv}.dimensoes_mm.${k}`, v.dimensoes_mm[k]);
        faixa(`${cv}.dimensoes_mm.comprimento`, v.dimensoes_mm.comprimento, 2500, 6500);
        faixa(`${cv}.dimensoes_mm.largura`, v.dimensoes_mm.largura, 1400, 2300);
        faixa(`${cv}.dimensoes_mm.altura`, v.dimensoes_mm.altura, 1000, 2200);
        faixa(`${cv}.dimensoes_mm.entre_eixos`, v.dimensoes_mm.entre_eixos, 1800, 4000);
        faixa(`${cv}.dimensoes_mm.altura_livre_solo`, v.dimensoes_mm.altura_livre_solo, 80, 400);
        faixa(`${cv}.dimensoes_mm.largura_com_retrovisores`, v.dimensoes_mm.largura_com_retrovisores, 1600, 2700);
        if (v.dimensoes_mm.largura !== null && v.dimensoes_mm.largura_com_retrovisores !== null && v.dimensoes_mm.largura_com_retrovisores <= v.dimensoes_mm.largura) warn(`${cv}.dimensoes_mm`, 'largura com retrovisores <= largura sem retrovisores');
        if (v.dimensoes_mm.comprimento === null) warn(`${cv}.dimensoes_mm`, 'comprimento null');
      }
      intOuNull(`${cv}.peso_kg`, v.peso_kg); faixa(`${cv}.peso_kg`, v.peso_kg, 700, 4500);
      intOuNull(`${cv}.porta_malas_l`, v.porta_malas_l); faixa(`${cv}.porta_malas_l`, v.porta_malas_l, 50, 2500);
      numOuNull(`${cv}.tanque_l`, v.tanque_l); faixa(`${cv}.tanque_l`, v.tanque_l, 20, 150);
      intOuNull(`${cv}.lugares`, v.lugares); faixa(`${cv}.lugares`, v.lugares, 2, 9);
      intOuNull(`${cv}.portas`, v.portas); faixa(`${cv}.portas`, v.portas, 2, 5);
      strOuNull(`${cv}.pneus`, v.pneus);

      if (m.categoria === 'Picape') {
        if (exatas(`${cv}.picape`, v.picape, ['cabine', 'cacamba_l', 'capacidade_carga_kg'])) {
          enumOuNull(`${cv}.picape.cabine`, v.picape.cabine, CABINES);
          intOuNull(`${cv}.picape.cacamba_l`, v.picape.cacamba_l);
          intOuNull(`${cv}.picape.capacidade_carga_kg`, v.picape.capacidade_carga_kg);
        }
      } else if (v.picape !== null) err(`${cv}.picape`, 'deve ser null fora da categoria Picape');

      const eq = v.equipamentos;
      if (exatas(`${cv}.equipamentos`, eq, CAMPOS_EQUIP)) {
        intOuNull(`${cv}.equipamentos.airbags`, eq.airbags); faixa(`${cv}.equipamentos.airbags`, eq.airbags, 2, 12);
        for (const k of CAMPOS_EQUIP_BOOL) boolOuNull(`${cv}.equipamentos.${k}`, eq[k]);
        enumOuNull(`${cv}.equipamentos.ar_condicionado`, eq.ar_condicionado, AR);
        numOuNull(`${cv}.equipamentos.multimidia_polegadas`, eq.multimidia_polegadas);
        enumOuNull(`${cv}.equipamentos.carplay_android_auto`, eq.carplay_android_auto, CARPLAY);
        numOuNull(`${cv}.equipamentos.rodas_polegadas`, eq.rodas_polegadas); faixa(`${cv}.equipamentos.rodas_polegadas`, eq.rodas_polegadas, 13, 24);
        if (!Array.isArray(eq.destaques) || eq.destaques.some((d) => typeof d !== 'string')) err(`${cv}.equipamentos.destaques`, 'lista de strings');
        const nulos = CAMPOS_EQUIP.filter((k) => eq[k] === null).length;
        if (nulos > CAMPOS_EQUIP.length / 2) warn(`${cv}.equipamentos`, `${nulos} de ${CAMPOS_EQUIP.length} campos null`);
      }
      strOuNull(`${cv}.fonte_url`, v.fonte_url);
      if (!Array.isArray(v.campos_fonte_secundaria) || v.campos_fonte_secundaria.some((s) => typeof s !== 'string')) err(`${cv}.campos_fonte_secundaria`, 'lista de strings');
      strOuNull(`${cv}.observacoes`, v.observacoes);
    }
    if (Array.isArray(m.propulsoes)) {
      const declaradas = new Set(m.propulsoes);
      const faltando = [...propulsoesVersoes].filter((p) => !declaradas.has(p));
      if (faltando.length) err(`${cm}.propulsoes`, `não inclui propulsões usadas nas versões: ${faltando.join(', ')}`);
    }
  }
  return { erros, avisos };
}

function principal(arquivos) {
  if (arquivos.length === 0) { console.error('Uso: node scripts/validar.mjs <arquivo.json> [...]'); process.exit(2); }
  let falhou = false;
  for (const arq of arquivos) {
    let dados;
    try { dados = JSON.parse(readFileSync(arq, 'utf8')); }
    catch (e) { console.log(`✗ ${arq}: JSON inválido — ${e.message}`); falhou = true; continue; }
    const { erros, avisos } = validarMarca(dados, arq);
    const nv = (dados.modelos ?? []).reduce((s, m) => s + (m.versoes?.length ?? 0), 0);
    console.log(`${erros.length ? '✗' : '✓'} ${arq}: ${dados.modelos?.length ?? 0} modelos, ${nv} versões, ${erros.length} erros, ${avisos.length} avisos`);
    for (const e of erros) console.log(`   ERRO  ${e}`);
    for (const a of avisos) console.log(`   aviso ${a}`);
    if (erros.length) falhou = true;
  }
  process.exit(falhou ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) principal(process.argv.slice(2));
