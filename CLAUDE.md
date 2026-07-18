# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

TCG-Copy is a Vue 3 + TypeScript app that simulates opening a Pokémon TCG booster pack: it deals 5 random cards (weighted by rarity), renders them as card components using live data from the PokéAPI and the TCGdex SDK, and lets the user reveal them one by one via click or arrow keys.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc --build`) then production build
- `npm run preview` — preview the production build
- `npm run test:unit` — run all tests with Vitest
- `npm run test:unit -- <pattern>` — run a subset, e.g. `npm run test:unit -- Booster`
- `npm run test:unit:coverage` — run tests with v8 coverage (writes `coverage/`, used by CI to comment on PRs)
- `npm run type-check` — `vue-tsc --build` only
- `npm run biome` — Biome format + lint with `--write` (auto-fixes)

Biome (not ESLint/Prettier) is the sole formatter/linter, using **tabs** and **single quotes**. Lefthook runs `npm run biome` on staged files as a pre-commit hook (installed via the `postinstall` script). CI (`.github/workflows/ci.yml`) runs three parallel-ish jobs against PRs into `main`/`dev`: `biome ci .`, `npm run type-check`, then tests+coverage (which requires the first two).

## Architecture

**Data flow for a booster pack** (see `src/components/booster/Booster.vue`):
1. `src/assets/pokemon.json` is the static roster (`{ id, name, rarity }` per `PokemonJSON`) mapped into `Card` model instances (`src/models/card.ts`).
2. `pickRandomCard()` rolls a weighted rarity tier (0–5, common→rare) then picks randomly within that tier.
3. `fetchPokemonData(id)` calls the public PokéAPI (`https://pokeapi.co/api/v2/pokemon/{id}`) for sprites/types/stats/moves, building a synthetic `attacks` array from the first two moves (fetching each move's detail for its type/power). `id === 0` is a hardcoded special case that returns a Shrek joke card instead of calling the API — do not treat `0` as a real Pokédex id elsewhere.
4. `generateBooster()` builds 5 `GeneratedCard` (`{ loading, card, data }`) objects sequentially (awaited in a loop, not parallel) and sorts the final hand by rarity ascending.
5. Card reveal/navigation state (`clickedIndices`, `selectedIndex`, `cutted`, `isPreviewing`, `allCardsClicked`) is plain component state driven by click handlers and global `keydown`/`keyup` listeners (ArrowRight advances/reveals, ArrowLeft peeks at the next card while held).

**Two parallel data sources per card**, merged only in `Card.vue`:
- `item.data` (`PokemonAPIData`, from PokéAPI) drives HP, elemental type, and image.
- `baseCard` (`Card` interface in `GeneralTypes.ts`, from TCGdex via `useTCGdexStore().getBaseSetCard(name)`) supplies real TCG attacks/weaknesses, matched by Pokémon *name* to that Pokémon's Base Set printing. Note there are two different `Card` types in this codebase — `src/interfaces/Card.ts` (the simple roster/model shape: id/name/rarity) vs. the `Card` interface inside `src/interfaces/GeneralTypes.ts` (the full TCG card shape: attacks/weaknesses/retreat/etc.) — check which one a file imports.

**`tcgdexStore` (Pinia, `src/stores/tcgdexStore.ts`)** memoizes two things in-memory for the session: full card objects by id (`cards`) and a Pokémon-name → Base-Set-card-id lookup (`baseSetMap`, `null` cached for "no base set printing found"). `getBaseSetCard(name)` composes both lookups.

**Type/energy icon handling**: PokéAPI types (e.g. `ground`, `bug`, `fairy`) don't match the original 90s TCG energy types. `pokemonTypeTransform` (`src/utils/pokemonTypeTransform.ts`) maps PokéAPI-era/extra types down to `OriginalPokemonTypesEnum` (dark/dragon/electric/fighting/fire/grass/normal/psychic/steel/water/null). `useEnergyIcon` composable wraps this to produce the inline style (size + `background-image: url('/img/energy/{type}-energy.png')`) used by `CardType`, `CardAttack`, `CardRetreat`, and `CardWeakness`.

**Card component composition** (`src/components/card/`): `Card.vue` is a shell that conditionally renders `CardHeader` → `CardImage` → `CardBody` (containing `CardAttack` per attack) → `CardFooter` (containing `CardWeakness` + `CardRetreat`), plus `CardRarity`. Each subcomponent is presentation-only (props in, no store access) except `Card.vue` itself, which owns the TCGdex fetch. Rarity classes (`rarity-0`..`rarity-5`) and per-card/per-index classes are applied directly on the root `.card` element for CSS targeting; styling lives in `Card.less` and is imported per-component via `@import` (not global) since each SFC uses `<style scoped>`.

**Path alias**: `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json` — keep in sync if changed). Less variables are globally injected into every `<style lang="less">` block via `additionalData` in `vite.config.ts` pointing at `@/assets/styles/vars.less`.

## Testing conventions

Tests live under `tests/` mirroring `src/` structure (not colocated). Uses `@vue/test-utils` `mount()` + Vitest, environment `jsdom`. Existing tests are smoke-level (mount and assert `wrapper.exists()`, or unit-test pure helpers like `pokemonTypeTransform`/`useEnergyIcon`) — follow that granularity rather than introducing new testing patterns.
