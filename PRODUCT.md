# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience (confirmed 2026-11-16): people evaluating the author's work. The site is now a **portfolio piece**: recruiters, peers and potential clients open the public link to judge craft, both visual and technical. The in-product persona stays the same as before: someone in Brazil choosing a new car, who searches for a model, reads its spec sheet and compares versions side by side. The site must convince portfolio visitors by working convincingly for that persona.

## Product Purpose

CC compares new cars sold officially in Brazil (model years 2026 and 2027): suggested price, fuel consumption, powertrain, dimensions and key equipment, version by version. Success for the portfolio is a visitor who recognises a real, carefully built product rather than a template or an AI-generated page.

## Positioning

Version-level comparison (e.g. Fastback Impetus × Fastback Abarth), not just model-level, on a single dataset of 45 brands, 282 models and 802 versions with explicit sourcing: manufacturer data first, PBEV/Inmetro for consumption, secondary sources only for gaps and always flagged with `*`, and "Não divulgado" instead of invented values.

## Operating Context

- Started as a university assignment (HTML, CSS, forms, JavaScript; PHP as a bonus; at least 3 pages). The PDF delivery is finished and no longer needs updating.
- Public deployment: https://cc-comparador-de-carros.onrender.com (Render, Docker with `php:8.3-apache`); repository https://github.com/Zero-Kng/cc-comparador-de-carros (public). Each push to `main` redeploys.
- Pages: Início (hero search, marking versions to compare), Explorar modelos (GET filter form processed by PHP), Página do carro (versions and full spec sheet), Minha comparação (cards side by side, version switch, "Ver mais"), Como comparamos (sourcing explained, numbers computed by PHP).

## Capabilities and Constraints

- Plain HTML, CSS, ES-module JavaScript and PHP 8, no frameworks and no build step; source has no comments (user decision).
- Comparison list kept in `localStorage` (key `emparalelo.comparacao`), works in memory when storage is blocked.
- Data in `data/carros.json` (built from `data/marcas/*.json` by `scripts/unir.mjs`), light search index in `data/indice.json`; one transparent side-view photo per model in `img/carros/`.
- Automated tests: `npm test` (JS) and `php tests/php/*_test.php`; they pin real data values.
- Scope of the current redesign (confirmed): **visual only**. Same pages, same blocks, same flows and the same functions; colours, typography, layout and finish may change.

## Brand Commitments

- Name: **CC**.
- Logo: the two slanted, chamfered "C" letters in `img/logo.svg` (also inlined in every header and used as favicon). Binding.
- Current copy is not a brand commitment, but the redesign scope is visual only, so copy stays unless the user asks.

## Evidence on Hand

- Real dataset: 45 brands, 282 models, 802 versions; sources per model; `data/imagens.json` records each photo's origin.
- All car data and images were gathered with AI assistance (stated in README.md); the site must not claim official partnership with any manufacturer.
- No testimonials, users, press or metrics exist. Do not fabricate them.

## Product Principles

1. Honesty about data comes first: flagged secondary sources and "Não divulgado" are features, not blemishes to hide.
2. Comparison is the core act; everything should make reading two or more versions side by side easier.
3. A portfolio visitor should sense deliberate authorship in every page, not a generic template.
4. Works without frameworks and stays readable as source code.

## Accessibility & Inclusion

Portuguese (pt-BR) interface. Keyboard-usable search and controls, visible focus, `prefers-reduced-motion` respected (existing behaviour to keep).
