<?php
// Testes de renderização das páginas PHP: roda a página na CLI com um $_GET montado.
require __DIR__ . '/verificar.php';

function renderPagina(string $arquivo, array $get): string
{
    $_GET = $get;
    ob_start();
    include __DIR__ . '/../../' . $arquivo;
    return ob_get_clean();
}

// ---- Explorar modelos ----
$h = renderPagina('explorar.php', ['categoria' => 'SUV Compacto', 'marca' => 'fiat']);
verificar(str_contains($h, 'Fastback'), 'resultado aparece');
verificar(str_contains($h, 'href="carro.html?id=fiat-fastback"'), 'link para a ficha');
verificar(preg_match('/<option value="SUV Compacto" selected/', $h) === 1, 'filtro volta preenchido');
verificar(str_contains($h, 'R$ 119.990 a R$ 184.990'), 'faixa de preço formatada');
$secao = substr($h, strpos($h, '<section class="resultados"'), strpos($h, '</section>') - strpos($h, '<section class="resultados"'));
verificar(str_contains($secao, 'Fastback') && !str_contains($secao, 'Onix'), 'outras marcas não aparecem nos resultados');

$x = renderPagina('explorar.php', ['modelo' => '"><script>alert(1)</script>', 'preco_min' => '<script>alert(2)</script>']);
verificar(!str_contains($h . $x, '<script>alert'), 'sem injeção');

$v = renderPagina('explorar.php', ['preco_max' => '1']);
verificar(str_contains($v, 'Nenhum modelo encontrado') && str_contains($v, 'Limpar filtros'), 'estado vazio');

$todos = renderPagina('explorar.php', []);
verificar(str_contains($todos, '282 modelos encontrados'), 'sem filtro lista todos');
verificar(str_contains($todos, 'aria-current="page"') && str_contains($todos, 'data-contador'), 'cabeçalho com página atual e contador');

$ford = renderPagina('explorar.php', ['marca' => 'ford']);
verificar(str_contains($ford, 'selo-secundaria') && str_contains($ford, 'Fonte secundária'), 'preço secundário sinalizado no Explorar');
verificar(!str_contains($h, 'step="1000"'), 'campos de preço aceitam qualquer valor');

// ---- Como comparamos ----
$c = renderPagina('como-comparamos.php', []);
$dataBase = date('d/m/Y', strtotime(json_decode(file_get_contents(__DIR__ . '/../../data/carros.json'), true)['gerado_em']));
foreach (['45', '282', '802', '699', '87,2%', '90,5%', $dataBase] as $n) {
    verificar(str_contains($c, $n), "número $n");
}
verificar(str_contains($c, 'PBEV/Inmetro'), 'explica o PBEV');
verificar(str_contains($c, 'SUV Compacto') && str_contains($c, '>48<'), 'tabela por categoria');

concluir();
