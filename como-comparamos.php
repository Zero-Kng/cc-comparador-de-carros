<?php
require_once __DIR__ . '/php/dados.php';

$base = carregarBase();
$est = estatisticas($base);
$consumo = $est['consumo'];
$dataBase = date('d/m/Y', strtotime($est['gerado_em']));

$titulo = 'Como comparamos';
$paginaAtual = 'como-comparamos';
include __DIR__ . '/php/cabecalho.php';
?>
<main class="conteudo metodo">
  <div class="metodo__topo">
    <p class="rotulo">Transparência</p>
    <h1>Como comparamos</h1>
    <p class="metodo__apoio">Cada número do site tem origem. Usamos o que a fabricante publica e, quando ela não publica,
      dizemos isso, em vez de inventar.</p>
  </div>

  <section class="numeros" aria-label="A base em números">
    <div class="numero"><strong><?= $est['marcas'] ?></strong><span>marcas</span></div>
    <div class="numero"><strong><?= $est['modelos'] ?></strong><span>modelos</span></div>
    <div class="numero"><strong><?= $est['versoes'] ?></strong><span>versões</span></div>
    <div class="numero"><strong><?= porcentagem($est['com_preco'], $est['versoes']) ?></strong><span>das versões com preço sugerido</span></div>
  </section>
  <p class="metodo__data rotulo">Base atualizada em <?= e($dataBase) ?> · anos-modelo 2026 e 2027</p>

  <div class="metodo__colunas">
    <section class="metodo__bloco">
      <h2>De onde vêm os dados</h2>
      <ol class="fontes">
        <li><strong>Site oficial da fabricante.</strong> Página do modelo, configurador, ficha técnica em PDF ou site de imprensa da marca no Brasil. É a fonte principal de preço, motor, dimensões e equipamentos.</li>
        <li><strong>PBEV/Inmetro.</strong> O consumo segue a tabela oficial do Programa Brasileiro de Etiquetagem Veicular, a mesma para todas as marcas. Assim os números são comparáveis entre si.</li>
        <li><strong>Fonte secundária, só para lacunas.</strong> Quando a fabricante não divulga um dado, usamos imprensa especializada e marcamos o valor com <span class="selo-secundaria" aria-hidden="true">*</span> em todo o site.</li>
      </ol>
    </section>

    <section class="metodo__bloco">
      <h2>Origem do consumo</h2>
      <p><?= $consumo['total'] ?> das <?= $est['versoes'] ?> versões (<?= porcentagem($consumo['total'], $est['versoes']) ?>) têm consumo informado.</p>
      <?php
      $faixas = [
          ['PBEV/Inmetro', $consumo['pbev'], 'pbev'],
          ['Fonte secundária', $consumo['secundaria'], 'secundaria'],
          ['Site da marca', $consumo['site'], 'site'],
      ];
      ?>
      <div class="barra" role="img" aria-label="Origem do consumo por versão">
        <?php foreach ($faixas as [$rotulo, $n, $classe]): ?>
          <span class="barra__faixa barra__faixa--<?= $classe ?>" style="flex-grow: <?= $n ?>"></span>
        <?php endforeach; ?>
      </div>
      <ul class="legenda">
        <?php foreach ($faixas as [$rotulo, $n, $classe]): ?>
          <li><span class="legenda__cor barra__faixa--<?= $classe ?>"></span><?= e($rotulo) ?>: <strong><?= $n ?></strong> versões (<?= porcentagem($n, $est['versoes']) ?> da base)</li>
        <?php endforeach; ?>
      </ul>
      <p class="metodo__nota">As <?= $est['versoes'] - $consumo['total'] ?> versões restantes aparecem como “Não divulgado”. A maioria são esportivos de luxo, que não participam do PBEV.</p>
    </section>
  </div>

  <div class="metodo__colunas">
    <section class="metodo__bloco">
      <h2>Regras que seguimos</h2>
      <ul class="regras">
        <li><strong>Nada é inventado.</strong> Se não conseguimos confirmar um dado, ele aparece como “Não divulgado”.</li>
        <li><strong>Preço sugerido</strong> é o preço público da versão no site da marca, sem opcionais, pintura ou frete.</li>
        <li><strong>Uma ficha por ano-modelo.</strong> Se a versão existe em 2026 e 2027, as duas aparecem separadas.</li>
        <li><strong>Só carros vendidos oficialmente no Brasil</strong>, de todas as marcas, das populares às exóticas.</li>
        <li><strong><?= $est['com_fonte_secundaria'] ?> versões</strong> (<?= porcentagem($est['com_fonte_secundaria'], $est['versoes']) ?>) têm pelo menos um dado de fonte secundária, sempre sinalizado.</li>
      </ul>
    </section>

    <section class="metodo__bloco">
      <h2>Modelos por categoria</h2>
      <table class="tabela">
        <thead><tr><th scope="col">Categoria</th><th scope="col">Modelos</th></tr></thead>
        <tbody>
          <?php foreach ($est['por_categoria'] as $categoria => $n): ?>
            <tr>
              <td><a href="explorar.php?categoria=<?= urlencode($categoria) ?>"><?= e($categoria) ?></a></td>
              <td><?= $n ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </section>
  </div>
</main>
<?php include __DIR__ . '/php/rodape.php'; ?>
