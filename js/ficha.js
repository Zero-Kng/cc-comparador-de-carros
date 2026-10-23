import { formatarNumero, formatarPreco, NAO_DIVULGADO } from './formatar.js';

const NOMES_COMBUSTIVEL = { etanol: 'etanol', gasolina: 'gasolina', diesel: 'diesel', eletrico: 'elétrico', combinada: 'combinada' };

const sufixo = (n, unidade, casas = 1) => (n === null || n === undefined ? NAO_DIVULGADO : `${formatarNumero(n, casas)} ${unidade}`);
const simNao = (b) => (b === null || b === undefined ? NAO_DIVULGADO : b ? 'Sim' : 'Não');
const texto = (t) => (t === null || t === undefined || t === '' ? NAO_DIVULGADO : String(t));

function ehSecundaria(campos, caminhos) {
  return campos.some((f) => caminhos.some((c) => f === c || c.startsWith(f + '.') || f.startsWith(c + '.')));
}

export function campoSecundario(versao, campo) {
  return ehSecundaria(versao.campos_fonte_secundaria ?? [], [campo]);
}

export function faixaDePreco(versoes) {
  const comPreco = versoes.filter((v) => v.preco_sugerido_brl !== null);
  if (!comPreco.length) return { texto: formatarPreco(null), secundaria: false };
  const precos = comPreco.map((v) => v.preco_sugerido_brl);
  const [min, max] = [Math.min(...precos), Math.max(...precos)];
  return {
    texto: min === max ? formatarPreco(min) : `${formatarPreco(min)} a ${formatarPreco(max)}`,
    secundaria: comPreco.some((v) => campoSecundario(v, 'preco_sugerido_brl')),
  };
}

export function linhasFicha(versao) {
  const linhas = [];
  const campos = versao.campos_fonte_secundaria ?? [];
  const add = (grupo, rotulo, valor, caminhos, principal = false) =>
    linhas.push({ grupo, rotulo, valor, caminhos, principal, secundaria: ehSecundaria(campos, caminhos) });

  const { motor, transmissao, desempenho, consumo, dimensoes_mm: dim, equipamentos: eq } = versao;
  const eletrico = motor.combustivel === 'Elétrico';

  const G1 = 'Motor e desempenho';
  add(G1, 'Motor', texto(motor.descricao), ['motor.descricao'], true);
  add(G1, 'Propulsão', `${motor.tipo_propulsao} · ${motor.combustivel}`, ['motor.tipo_propulsao', 'motor.combustivel']);
  const potencias = Object.entries(motor.potencia_cv ?? {});
  if (potencias.length === 0) add(G1, 'Potência', NAO_DIVULGADO, ['motor.potencia_cv'], true);
  for (const [chave, cv] of potencias) {
    add(G1, `Potência (${NOMES_COMBUSTIVEL[chave] ?? chave})`, sufixo(cv, 'cv', 0), [`motor.potencia_cv.${chave}`], true);
  }
  for (const [chave, kgfm] of Object.entries(motor.torque_kgfm ?? {})) {
    add(G1, `Torque (${NOMES_COMBUSTIVEL[chave] ?? chave})`, sufixo(kgfm, 'kgfm'), [`motor.torque_kgfm.${chave}`]);
  }
  const cambio = transmissao.marchas ? `${transmissao.tipo}, ${transmissao.marchas} marchas` : texto(transmissao.tipo);
  add(G1, 'Câmbio', cambio, ['transmissao.tipo', 'transmissao.marchas'], true);
  add(G1, 'Tração', texto(versao.tracao), ['tracao']);
  add(G1, '0–100 km/h', sufixo(desempenho.aceleracao_0_100_s, 's'), ['desempenho.aceleracao_0_100_s'], true);
  add(G1, 'Velocidade máxima', sufixo(desempenho.velocidade_maxima_kmh, 'km/h', 0), ['desempenho.velocidade_maxima_kmh']);
  if (motor.bateria_kwh !== null) add(G1, 'Bateria', sufixo(motor.bateria_kwh, 'kWh'), ['motor.bateria_kwh']);
  if (motor.autonomia_eletrica_km !== null) {
    const ciclo = motor.autonomia_ciclo ? ` (${motor.autonomia_ciclo})` : '';
    add(G1, 'Autonomia elétrica', `${formatarNumero(motor.autonomia_eletrica_km, 0)} km${ciclo}`, ['motor.autonomia_eletrica_km', 'motor.autonomia_ciclo']);
  }

  const G2 = 'Consumo';
  let algumConsumo = false;
  for (const chave of ['etanol', 'gasolina', 'diesel', 'eletrico']) {
    const unidade = chave === 'eletrico' ? 'km/le' : 'km/l';
    const kc = chave === 'eletrico' ? 'cidade_eletrico_km_le' : `cidade_${chave}`;
    const ke = chave === 'eletrico' ? 'estrada_eletrico_km_le' : `estrada_${chave}`;
    if (consumo?.[kc] === undefined && consumo?.[ke] === undefined) continue;
    algumConsumo = true;
    const lado = (n) => (n === undefined || n === null ? '—' : formatarNumero(n));
    add(G2, `Consumo ${NOMES_COMBUSTIVEL[chave]} (cidade / estrada)`, `${lado(consumo[kc])} / ${lado(consumo[ke])} ${unidade}`,
      [`consumo.${kc}`, `consumo.${ke}`], true);
  }
  if (!algumConsumo) add(G2, 'Consumo', NAO_DIVULGADO, ['consumo'], true);

  const G3 = 'Espaço e dimensões';
  add(G3, 'Porta-malas', sufixo(versao.porta_malas_l, 'L', 0), ['porta_malas_l'], true);
  add(G3, 'Lugares', texto(versao.lugares), ['lugares']);
  add(G3, 'Portas', texto(versao.portas), ['portas']);
  add(G3, 'Comprimento', sufixo(dim.comprimento, 'mm', 0), ['dimensoes_mm.comprimento']);
  if (dim.largura === null && dim.largura_com_retrovisores !== null) {
    add(G3, 'Largura', `${formatarNumero(dim.largura_com_retrovisores, 0)} mm (Com retrovisor)`, ['dimensoes_mm.largura_com_retrovisores']);
  } else {
    add(G3, 'Largura', sufixo(dim.largura, 'mm', 0), ['dimensoes_mm.largura']);
  }
  add(G3, 'Altura', sufixo(dim.altura, 'mm', 0), ['dimensoes_mm.altura']);
  add(G3, 'Entre-eixos', sufixo(dim.entre_eixos, 'mm', 0), ['dimensoes_mm.entre_eixos']);
  add(G3, 'Altura livre do solo', sufixo(dim.altura_livre_solo, 'mm', 0), ['dimensoes_mm.altura_livre_solo']);
  add(G3, 'Peso', sufixo(versao.peso_kg, 'kg', 0), ['peso_kg']);
  if (!eletrico) add(G3, 'Tanque', sufixo(versao.tanque_l, 'L'), ['tanque_l']);
  add(G3, 'Pneus', texto(versao.pneus), ['pneus']);
  if (versao.picape) {
    add(G3, 'Cabine', texto(versao.picape.cabine), ['picape.cabine']);
    add(G3, 'Caçamba', sufixo(versao.picape.cacamba_l, 'L', 0), ['picape.cacamba_l']);
    add(G3, 'Capacidade de carga', sufixo(versao.picape.capacidade_carga_kg, 'kg', 0), ['picape.capacidade_carga_kg']);
  }

  const G4 = 'Equipamentos';
  const e = (campo) => [`equipamentos.${campo}`];
  add(G4, 'Airbags', texto(eq.airbags), e('airbags'), true);
  add(G4, 'CarPlay / Android Auto', texto(eq.carplay_android_auto), e('carplay_android_auto'), true);
  add(G4, 'Multimídia', eq.multimidia_polegadas === null ? NAO_DIVULGADO : `${formatarNumero(eq.multimidia_polegadas)}"`, e('multimidia_polegadas'));
  add(G4, 'Painel digital', simNao(eq.painel_digital), e('painel_digital'));
  add(G4, 'Ar-condicionado', texto(eq.ar_condicionado), e('ar_condicionado'));
  add(G4, 'Frenagem autônoma de emergência', simNao(eq.frenagem_autonoma_emergencia), e('frenagem_autonoma_emergencia'));
  add(G4, 'Piloto automático adaptativo', simNao(eq.piloto_automatico_adaptativo), e('piloto_automatico_adaptativo'));
  add(G4, 'Assistente de permanência em faixa', simNao(eq.assistente_permanencia_faixa), e('assistente_permanencia_faixa'));
  add(G4, 'Alerta de ponto cego', simNao(eq.alerta_ponto_cego), e('alerta_ponto_cego'));
  add(G4, 'Câmera de ré', simNao(eq.camera_re), e('camera_re'));
  add(G4, 'Câmera 360°', simNao(eq.camera_360), e('camera_360'));
  add(G4, 'Sensor de estacionamento dianteiro', simNao(eq.sensor_estacionamento_dianteiro), e('sensor_estacionamento_dianteiro'));
  add(G4, 'Faróis de LED', simNao(eq.farois_led), e('farois_led'));
  add(G4, 'Carregador por indução', simNao(eq.carregador_inducao), e('carregador_inducao'));
  add(G4, 'Partida sem chave', simNao(eq.partida_sem_chave), e('partida_sem_chave'));
  add(G4, 'Bancos de couro', simNao(eq.bancos_couro), e('bancos_couro'));
  add(G4, 'Banco do motorista elétrico', simNao(eq.banco_motorista_eletrico), e('banco_motorista_eletrico'));
  add(G4, 'Teto solar', simNao(eq.teto_solar), e('teto_solar'));
  const rodas = eq.rodas_polegadas === null ? NAO_DIVULGADO
    : `${eq.rodas_polegadas}"${eq.rodas_liga_leve ? ', liga leve' : ''}`;
  add(G4, 'Rodas', rodas, [...e('rodas_polegadas'), ...e('rodas_liga_leve')]);
  if (eq.destaques?.length) add(G4, 'Destaques', eq.destaques.join(' · '), e('destaques'));

  return linhas;
}

export function alinharLinhas(listas) {
  const chave = (l) => `${l.grupo}|${l.rotulo}`;
  const rotulos = [];
  const vistos = new Set();
  for (const lista of listas) {
    for (const l of lista) {
      if (vistos.has(chave(l))) continue;
      vistos.add(chave(l));
      rotulos.push({ grupo: l.grupo, rotulo: l.rotulo, principal: l.principal });
    }
  }
  const celulas = rotulos.map((r) => listas.map((lista) => lista.find((l) => chave(l) === `${r.grupo}|${r.rotulo}`) ?? null));
  return { rotulos, celulas };
}
