<?php
// Mini-ferramenta de teste para PHP CLI: verificar() acumula falhas e concluir() imprime o resultado.

$GLOBALS['falhas'] = [];
$GLOBALS['verificacoes'] = 0;

function verificar(bool $ok, string $mensagem): void
{
    $GLOBALS['verificacoes']++;
    if (!$ok) {
        $GLOBALS['falhas'][] = $mensagem;
    }
}

function concluir(): void
{
    if ($GLOBALS['falhas']) {
        echo 'FALHOU (' . count($GLOBALS['falhas']) . ' de ' . $GLOBALS['verificacoes'] . "):\n";
        foreach ($GLOBALS['falhas'] as $f) {
            echo "  - $f\n";
        }
        exit(1);
    }
    echo 'OK (' . $GLOBALS['verificacoes'] . " verificações)\n";
    exit(0);
}
