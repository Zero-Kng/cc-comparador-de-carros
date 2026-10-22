<?php
$atual = fn(string $pagina) => $paginaAtual === $pagina ? ' aria-current="page"' : '';
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($titulo) ?> · CC</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap">
  <link rel="stylesheet" href="css/estilo.css">
  <script type="module" src="js/comum.js"></script>
</head>
<body>
<header class="cabecalho">
  <div class="conteudo">
    <a class="logo" href="index.html" aria-label="CC, página inicial">CC</a>
    <nav class="menu" aria-label="Principal">
      <a href="explorar.php"<?= $atual('explorar') ?>>Explorar modelos</a>
      <a href="como-comparamos.php"<?= $atual('como-comparamos') ?>>Como comparamos</a>
      <a class="botao botao--pequeno" href="comparar.html"><span>Minha comparação (<span data-contador>0</span>)</span></a>
    </nav>
  </div>
</header>
