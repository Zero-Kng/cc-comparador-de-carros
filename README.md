# CC: comparador de carros

Site para comparar preços, consumo, motorização e equipamentos dos carros vendidos no Brasil, anos-modelo 2026 e 2027.
Trabalho acadêmico feito com HTML, CSS, formulários, JavaScript e PHP, sem frameworks.

## Páginas

| Página | Arquivo | Tecnologia |
|---|---|---|
| Início, com busca de modelos | `index.html` | HTML, CSS, JS |
| Explorar modelos, com filtros | `explorar.php` | Formulário GET + PHP |
| Ficha do carro | `carro.html` | HTML, CSS, JS |
| Minha comparação | `comparar.html` | HTML, CSS, JS |
| Como comparamos | `como-comparamos.php` | PHP |

## Dados

`data/carros.json` reúne 45 marcas, 282 modelos e 802 versões, coletados dos sites oficiais das fabricantes.
O consumo segue o PBEV/Inmetro, e dados de fonte secundária aparecem marcados com `*`.
As convenções estão em `data/README.md`, e a origem de cada foto, em `data/imagens.json`.

> **Aviso:** todas as informações dos carros (preços, fichas técnicas, consumo e equipamentos) e todas as imagens
> foram recolhidas por IA, a partir dos sites das fabricantes e de outras fontes indicadas em cada modelo.
> Os dados podem conter erros ou estar desatualizados. Confira sempre na fonte oficial antes de qualquer decisão de compra.

## Como rodar

Com o PHP 8 instalado, na pasta do projeto:

```bash
php -S localhost:8000
```

Depois, abra `http://localhost:8000`.

## Testes

```bash
npm test
php tests/php/dados_test.php
php tests/php/paginas_test.php
```

## Publicação

O `Dockerfile` usa a imagem oficial `php:8.3-apache` e escuta na porta definida pela variável `PORT`, como o Render espera.
