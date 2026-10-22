<?php
require __DIR__ . '/verificar.php';
require __DIR__ . '/../../php/dados.php';

$base = carregarBase();

// Números da base em 22/10/2026
$est = estatisticas($base);
verificar($est['marcas'] === 45 && $est['modelos'] === 282 && $est['versoes'] === 802, 'totais');
verificar($est['consumo'] === ['total' => 726, 'pbev' => 699, 'secundaria' => 21, 'site' => 6], 'origem do consumo');
verificar($est['com_fonte_secundaria'] === 179, 'versões com fonte secundária');
verificar($est['com_preco'] === 722, 'versões com preço');
verificar($est['por_categoria']['SUV Compacto'] === 48, 'modelos SUV Compacto');
verificar(array_key_first($est['por_categoria']) === 'SUV Compacto', 'categorias na ordem oficial');
verificar($est['gerado_em'] === $base['gerado_em'], 'data da base');

// Filtros
$itens = listarVersoes($base);
verificar(count($itens) === 802, 'listarVersoes achata todas as versões');
verificar(count(filtrarVersoes($itens, lerFiltros(['categoria' => 'SUV Compacto'], $base))) === 158, 'filtro por categoria');
verificar(count(agruparPorModelo(filtrarVersoes($itens, lerFiltros(['marca' => 'fiat'], $base)))) === 8, 'modelos Fiat');

$ano = filtrarVersoes($itens, lerFiltros(['ano' => '2027'], $base));
verificar(count($ano) > 0 && count(array_filter($ano, fn($i) => $i['versao']['ano_modelo'] !== 2027)) === 0, 'filtro por ano');

$faixa = filtrarVersoes($itens, lerFiltros(['preco_min' => '100000', 'preco_max' => '150000'], $base));
verificar(count($faixa) > 0 && count(array_filter($faixa, fn($i) => $i['versao']['preco_sugerido_brl'] === null
    || $i['versao']['preco_sugerido_brl'] < 100000 || $i['versao']['preco_sugerido_brl'] > 150000)) === 0, 'faixa de preço exclui sem preço');

$eletricos = filtrarVersoes($itens, lerFiltros(['propulsao' => 'Elétrico (BEV)'], $base));
verificar(count($eletricos) > 0 && count(array_filter($eletricos, fn($i) => $i['versao']['motor']['tipo_propulsao'] !== 'Elétrico (BEV)')) === 0, 'filtro por propulsão');
$cvt = filtrarVersoes($itens, lerFiltros(['cambio' => 'CVT'], $base));
verificar(count($cvt) > 0 && count(array_filter($cvt, fn($i) => $i['versao']['transmissao']['tipo'] !== 'CVT')) === 0, 'filtro por câmbio');

// Entradas inválidas ou maliciosas
$lixo = lerFiltros(['categoria' => '<script>', 'ano' => '2030', 'preco_min' => 'abc', 'marca' => 'naoexiste', 'cambio' => ['x']], $base);
verificar($lixo['categoria'] === null && $lixo['ano'] === null && $lixo['preco_min'] === null && $lixo['marca'] === null && $lixo['cambio'] === null, 'entradas inválidas ignoradas');
$inv = lerFiltros(['preco_min' => '200000', 'preco_max' => '100000'], $base);
verificar($inv['preco_min'] === 100000 && $inv['preco_max'] === 200000, 'mínimo e máximo trocados');
verificar(lerFiltros(['marca' => 'fiat', 'modelo' => 'bmw-x1'], $base)['modelo'] === null, 'modelo de outra marca');
verificar(lerFiltros(['modelo' => 'bmw-x1'], $base)['modelo'] === 'bmw-x1', 'modelo sem marca é aceito');

// Agrupamento e ordenação
$grupos = agruparPorModelo(filtrarVersoes($itens, lerFiltros([], $base)));
verificar(count($grupos) === 282, 'sem filtro lista todos');
verificar(end($grupos)['preco_min'] === null, 'sem preço vão para o fim');
verificar($grupos[0]['preco_min'] <= $grupos[1]['preco_min'], 'ordenado pelo menor preço');
$fb = array_values(array_filter($grupos, fn($g) => $g['modelo']['id'] === 'fiat-fastback'))[0];
verificar($fb['preco_min'] === 119990 && $fb['preco_max'] === 184990 && $fb['qtd'] === 10, 'faixa e quantidade do Fastback');

$porId = array_combine(array_map(fn($g) => $g['modelo']['id'], $grupos), $grupos);
verificar($porId['ford-mustang']['preco_secundario'] === true, 'faixa com preço de fonte secundária é sinalizada');
verificar($porId['fiat-fastback']['preco_secundario'] === false, 'faixa só com preço oficial não é sinalizada');

// Origem do consumo e escape
verificar(origemConsumo(['consumo' => [], 'observacoes' => null, 'campos_fonte_secundaria' => []]) === null, 'sem consumo');
verificar(e('<b>"x"</b>') === '&lt;b&gt;&quot;x&quot;&lt;/b&gt;', 'escape');
verificar(e(null) === '', 'escape de null');
verificar(precoBR(174490) === 'R$ 174.490' && precoBR(null) === 'Preço não divulgado', 'preço formatado');
verificar(porcentagem(699, 802) === '87,2%' && porcentagem(726, 802) === '90,5%', 'porcentagem com vírgula');

concluir();
