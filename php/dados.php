<?php

function carregarBase(?string $caminho = null): array
{
    $caminho ??= __DIR__ . '/../data/carros.json';
    return json_decode(file_get_contents($caminho), true, 512, JSON_THROW_ON_ERROR);
}

function listarVersoes(array $base): array
{
    $itens = [];
    foreach ($base['marcas'] as $marca) {
        foreach ($marca['modelos'] as $modelo) {
            foreach ($modelo['versoes'] as $versao) {
                $itens[] = ['marca' => $marca, 'modelo' => $modelo, 'versao' => $versao];
            }
        }
    }
    return $itens;
}

function lerFiltros(array $get, array $base): array
{
    $categorias = [];
    $marcas = [];
    $modelos = [];
    $propulsoes = [];
    $cambios = [];
    foreach (listarVersoes($base) as $item) {
        $categorias[$item['modelo']['categoria']] = true;
        $marcas[$item['marca']['slug']][$item['modelo']['id']] = true;
        $modelos[$item['modelo']['id']] = true;
        $propulsoes[$item['versao']['motor']['tipo_propulsao']] = true;
        $cambios[$item['versao']['transmissao']['tipo']] = true;
    }

    $texto = fn(string $chave) => isset($get[$chave]) && is_string($get[$chave]) && $get[$chave] !== '' ? $get[$chave] : null;
    $daLista = fn(?string $valor, array $validos) => $valor !== null && isset($validos[$valor]) ? $valor : null;
    $numero = fn(?string $valor) => $valor !== null && ctype_digit($valor) ? (int) $valor : null;

    $marca = $daLista($texto('marca'), $marcas);
    $modelo = $texto('modelo');
    if ($modelo !== null && ($marca !== null ? !isset($marcas[$marca][$modelo]) : !isset($modelos[$modelo]))) {
        $modelo = null;
    }

    $ano = $numero($texto('ano'));
    $precoMin = $numero($texto('preco_min'));
    $precoMax = $numero($texto('preco_max'));
    if ($precoMin !== null && $precoMax !== null && $precoMin > $precoMax) {
        [$precoMin, $precoMax] = [$precoMax, $precoMin];
    }

    return [
        'categoria' => $daLista($texto('categoria'), $categorias),
        'marca' => $marca,
        'modelo' => $modelo,
        'preco_min' => $precoMin,
        'preco_max' => $precoMax,
        'ano' => in_array($ano, [2026, 2027], true) ? $ano : null,
        'propulsao' => $daLista($texto('propulsao'), $propulsoes),
        'cambio' => $daLista($texto('cambio'), $cambios),
    ];
}

function filtrarVersoes(array $itens, array $filtros): array
{
    return array_values(array_filter($itens, function (array $item) use ($filtros): bool {
        $v = $item['versao'];
        $preco = $v['preco_sugerido_brl'];
        return ($filtros['categoria'] === null || $item['modelo']['categoria'] === $filtros['categoria'])
            && ($filtros['marca'] === null || $item['marca']['slug'] === $filtros['marca'])
            && ($filtros['modelo'] === null || $item['modelo']['id'] === $filtros['modelo'])
            && ($filtros['ano'] === null || $v['ano_modelo'] === $filtros['ano'])
            && ($filtros['propulsao'] === null || $v['motor']['tipo_propulsao'] === $filtros['propulsao'])
            && ($filtros['cambio'] === null || $v['transmissao']['tipo'] === $filtros['cambio'])
            && ($filtros['preco_min'] === null || ($preco !== null && $preco >= $filtros['preco_min']))
            && ($filtros['preco_max'] === null || ($preco !== null && $preco <= $filtros['preco_max']));
    }));
}

function agruparPorModelo(array $itens): array
{
    $grupos = [];
    foreach ($itens as $item) {
        $id = $item['modelo']['id'];
        $grupos[$id] ??= ['marca' => $item['marca'], 'modelo' => $item['modelo'],
            'preco_min' => null, 'preco_max' => null, 'preco_secundario' => false, 'qtd' => 0];
        $grupos[$id]['qtd']++;
        $preco = $item['versao']['preco_sugerido_brl'];
        if ($preco !== null) {
            if (in_array('preco_sugerido_brl', $item['versao']['campos_fonte_secundaria'], true)) {
                $grupos[$id]['preco_secundario'] = true;
            }
            $grupos[$id]['preco_min'] = min($grupos[$id]['preco_min'] ?? $preco, $preco);
            $grupos[$id]['preco_max'] = max($grupos[$id]['preco_max'] ?? $preco, $preco);
        }
    }
    $grupos = array_values($grupos);
    usort($grupos, function (array $a, array $b): int {
        if ($a['preco_min'] === null || $b['preco_min'] === null) {
            return [$a['preco_min'] === null, $a['marca']['marca'] . $a['modelo']['modelo']]
                <=> [$b['preco_min'] === null, $b['marca']['marca'] . $b['modelo']['modelo']];
        }
        return $a['preco_min'] <=> $b['preco_min'];
    });
    return $grupos;
}

function origemConsumo(array $versao): ?string
{
    if (empty($versao['consumo'])) {
        return null;
    }
    foreach ($versao['campos_fonte_secundaria'] ?? [] as $campo) {
        if (str_starts_with($campo, 'consumo')) {
            return 'secundaria';
        }
    }
    if (preg_match('/Consumo (da tabela )?PBEV|PBEV\/Inmetro 20\d\d|tabela PBEV/i', $versao['observacoes'] ?? '')) {
        return 'pbev';
    }
    return 'site';
}

function estatisticas(array $base): array
{
    $itens = listarVersoes($base);
    $porCategoria = array_fill_keys(array_keys($base['totais']['modelos_por_categoria']), 0);
    $modelos = 0;
    foreach ($base['marcas'] as $marca) {
        foreach ($marca['modelos'] as $modelo) {
            $modelos++;
            $porCategoria[$modelo['categoria']] = ($porCategoria[$modelo['categoria']] ?? 0) + 1;
        }
    }

    $consumo = ['total' => 0, 'pbev' => 0, 'secundaria' => 0, 'site' => 0];
    $comPreco = 0;
    $comSecundaria = 0;
    foreach ($itens as $item) {
        $v = $item['versao'];
        if ($v['preco_sugerido_brl'] !== null) {
            $comPreco++;
        }
        if (!empty($v['campos_fonte_secundaria'])) {
            $comSecundaria++;
        }
        $origem = origemConsumo($v);
        if ($origem !== null) {
            $consumo['total']++;
            $consumo[$origem]++;
        }
    }

    return [
        'marcas' => count($base['marcas']),
        'modelos' => $modelos,
        'versoes' => count($itens),
        'por_categoria' => $porCategoria,
        'com_preco' => $comPreco,
        'consumo' => $consumo,
        'com_fonte_secundaria' => $comSecundaria,
        'gerado_em' => $base['gerado_em'],
    ];
}

function precoBR(?int $n): string
{
    return $n === null ? 'Preço não divulgado' : 'R$ ' . number_format($n, 0, ',', '.');
}

function porcentagem(int $parte, int $total): string
{
    return number_format($total ? 100 * $parte / $total : 0, 1, ',', '.') . '%';
}

function e(?string $t): string
{
    return htmlspecialchars($t ?? '', ENT_QUOTES, 'UTF-8');
}

function opcao(string $valor, string $rotulo, $atual): string
{
    $sel = (string) $atual === $valor ? ' selected' : '';
    return '<option value="' . e($valor) . '"' . $sel . '>' . e($rotulo) . '</option>';
}
