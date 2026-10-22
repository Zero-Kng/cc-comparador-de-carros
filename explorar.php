<?php
require_once __DIR__ . '/php/dados.php';

$base = carregarBase();
$filtros = lerFiltros($_GET, $base);
$grupos = agruparPorModelo(filtrarVersoes(listarVersoes($base), $filtros));

$categorias = array_keys($base['totais']['modelos_por_categoria']);
$modelosPorMarca = [];
$propulsoes = [];
$cambios = [];
foreach ($base['marcas'] as $marca) {
    foreach ($marca['modelos'] as $modelo) {
        $modelosPorMarca[$marca['slug']][] = ['id' => $modelo['id'], 'nome' => $modelo['modelo']];
        foreach ($modelo['versoes'] as $v) {
            $propulsoes[$v['motor']['tipo_propulsao']] = true;
            $cambios[$v['transmissao']['tipo']] = true;
        }
    }
}
$propulsoes = array_keys($propulsoes);
$cambios = array_keys($cambios);
sort($propulsoes);
sort($cambios);

$maisFiltrosAberto = $filtros['propulsao'] !== null || $filtros['cambio'] !== null;

$titulo = 'Explorar modelos';
$paginaAtual = 'explorar';
include __DIR__ . '/php/cabecalho.php';
?>
<main class="conteudo explorar">
  <div class="explorar__topo">
    <p class="rotulo">Para quem ainda não decidiu</p>
    <h1>Explorar modelos</h1>
    <p class="explorar__apoio">Filtre por categoria, marca, preço e ano. Depois abra a ficha e escolha as versões para comparar.</p>
  </div>

  <form class="filtros cartao" method="get" action="explorar.php">
    <div class="filtros__grade">
      <div class="campo">
        <label for="categoria">Categoria</label>
        <select id="categoria" name="categoria">
          <option value="">Todas</option>
          <?php foreach ($categorias as $c) echo opcao($c, $c, $filtros['categoria']); ?>
        </select>
      </div>
      <div class="campo">
        <label for="marca">Marca</label>
        <select id="marca" name="marca">
          <option value="">Todas</option>
          <?php foreach ($base['marcas'] as $m) echo opcao($m['slug'], $m['marca'], $filtros['marca']); ?>
        </select>
      </div>
      <div class="campo">
        <label for="modelo">Modelo</label>
        <select id="modelo" name="modelo">
          <option value="">Todos</option>
          <?php
          foreach ($modelosPorMarca as $slug => $lista) {
              if ($filtros['marca'] !== null && $slug !== $filtros['marca']) continue;
              foreach ($lista as $mod) echo opcao($mod['id'], $mod['nome'], $filtros['modelo']);
          }
          ?>
        </select>
      </div>
      <div class="campo">
        <label for="preco_min">Preço mínimo (R$)</label>
        <input id="preco_min" name="preco_min" type="number" min="0" step="1" inputmode="numeric"
               placeholder="80000" value="<?= e((string) ($filtros['preco_min'] ?? '')) ?>">
      </div>
      <div class="campo">
        <label for="preco_max">Preço máximo (R$)</label>
        <input id="preco_max" name="preco_max" type="number" min="0" step="1" inputmode="numeric"
               placeholder="250000" value="<?= e((string) ($filtros['preco_max'] ?? '')) ?>">
      </div>
      <div class="campo">
        <label for="ano">Ano-modelo</label>
        <select id="ano" name="ano">
          <option value="">2026 e 2027</option>
          <?= opcao('2026', '2026', $filtros['ano']) . opcao('2027', '2027', $filtros['ano']) ?>
        </select>
      </div>
    </div>

    <details class="filtros__mais"<?= $maisFiltrosAberto ? ' open' : '' ?>>
      <summary>Mais filtros</summary>
      <div class="filtros__grade">
        <div class="campo">
          <label for="propulsao">Propulsão</label>
          <select id="propulsao" name="propulsao">
            <option value="">Todas</option>
            <?php foreach ($propulsoes as $p) echo opcao($p, $p, $filtros['propulsao']); ?>
          </select>
        </div>
        <div class="campo">
          <label for="cambio">Câmbio</label>
          <select id="cambio" name="cambio">
            <option value="">Todos</option>
            <?php foreach ($cambios as $c) echo opcao($c, $c, $filtros['cambio']); ?>
          </select>
        </div>
      </div>
    </details>

    <div class="filtros__acoes">
      <button class="botao botao--limao" type="submit">Filtrar modelos →</button>
      <a class="botao" href="explorar.php">Limpar filtros</a>
    </div>
  </form>

  <section class="resultados" aria-live="polite">
    <?php if (!$grupos): ?>
      <div class="aviso">
        <p><strong>Nenhum modelo encontrado</strong> com esses filtros.</p>
        <a class="botao" href="explorar.php">Limpar filtros</a>
      </div>
    <?php else: ?>
      <p class="resultados__total"><?= count($grupos) ?> <?= count($grupos) === 1 ? 'modelo encontrado' : 'modelos encontrados' ?></p>
      <ul class="resultados__grade">
        <?php foreach ($grupos as $g):
            $faixa = $g['preco_min'] === null ? precoBR(null)
                : ($g['preco_min'] === $g['preco_max'] ? precoBR($g['preco_min'])
                : precoBR($g['preco_min']) . ' a ' . precoBR($g['preco_max']));
        ?>
          <li>
            <a class="resultado cartao" href="carro.html?id=<?= e($g['modelo']['id']) ?>">
              <div class="foto-carro">
                <?php if ($g['modelo']['imagem']): ?>
                  <img src="<?= e($g['modelo']['imagem']['arquivo']) ?>" alt="" loading="lazy" width="1200" height="500">
                <?php endif; ?>
              </div>
              <div class="resultado__corpo">
                <span class="rotulo"><?= e($g['modelo']['categoria']) ?></span>
                <h2><?= e($g['marca']['marca']) ?> <?= e($g['modelo']['modelo']) ?></h2>
                <p class="resultado__preco"><?= e($faixa) ?><?php if ($g['preco_secundario']): ?><span class="selo-secundaria" title="Fonte secundária">*</span><?php endif; ?></p>
                <p class="resultado__versoes"><?= $g['qtd'] ?> <?= $g['qtd'] === 1 ? 'versão' : 'versões' ?> · Ver ficha →</p>
              </div>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
      <?php if (array_filter($grupos, fn($g) => $g['preco_secundario'])): ?>
        <p class="legenda-secundaria resultados__legenda"><span class="selo-secundaria" aria-hidden="true">*</span>
          Fonte secundária: a fabricante não divulga esse preço; ele vem da imprensa especializada.</p>
      <?php endif; ?>
    <?php endif; ?>
  </section>
</main>

<script type="application/json" id="modelos-por-marca"><?= json_encode($modelosPorMarca, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
<script type="module" src="js/explorar.js"></script>
<?php include __DIR__ . '/php/rodape.php'; ?>
