# diffwise — Constitution

> Ce fichier est la source de vérité du projet.
> Tout LLM ou contributeur doit le lire avant de générer ou modifier du code.

---

## Stack & Versions

- **Runtime:** Node.js 20+ / TypeScript 5.x (strict mode)
- **CLI:** citty
- **UI:** Vue 3.x (Composition API uniquement) + Vite + Pinia
- **Backend:** Hono
- **AI:** Anthropic SDK — modèle `claude-sonnet-4-6`
- **Tests:** Vitest
- **Monorepo:** npm workspaces

---

## TypeScript

- `strict: true` — pas de `any`, pas de `as unknown`
- Tous les types publics d'un module sont exportés depuis son `index.ts`
- Préférer `type` à `interface` sauf pour les contrats extensibles
- Pas de `non-null assertion` (`!`) — gérer explicitement les cas `null/undefined`

---

## Structure des packages

| Package         | Rôle                                               |
|-----------------|----------------------------------------------------|
| `packages/core` | Moteur partagé — parser, prompt builder, AI client |
| `packages/cli`  | Interface CLI — aucune logique métier propre        |
| `packages/api`  | Serveur HTTP — délègue tout à `core`               |
| `packages/ui`   | Frontend Vue 3 — consomme `api`                    |

- **Règle absolue :** `cli`, `api` et `ui` n'importent jamais directement entre eux
- Tout code partagé va dans `packages/core`
- Pas d'import circulaire entre packages

---

## Nommage

- **Fichiers :** `kebab-case` (ex: `diff-parser.ts`, `prompt-builder.ts`)
- **Classes / Types :** `PascalCase`
- **Fonctions / Variables :** `camelCase`
- **Constantes :** `SCREAMING_SNAKE_CASE`
- **Composants Vue :** `PascalCase.vue` (ex: `DiffInput.vue`)

---

## Conventions de code

- Une fonction = une responsabilité
- Pas de `console.log` dans le code commité — utiliser un logger dédié
- Pas de code commenté dans les PRs — supprimer ou ouvrir un ticket
- Les fonctions `async` retournent toujours un type explicite
- Les erreurs sont typées — pas de `catch (e: any)`

---

## Tests

- Chaque module de `packages/core` a un fichier de test `*.spec.ts`
- Les tests unitaires couvrent : le parser, le prompt builder, le formatter
- Pas de test requis pour les couches CLI/API/UI en Phase 1
- Convention de fichier : `src/diff-parser.spec.ts` colocalisé avec le module

---

## Prompts & AI

- Le `system prompt` est défini dans `prompt-builder.ts` — jamais inline
- Le mode (`description` | `explain` | `review`) est un paramètre explicite
- Les diffs > 6000 tokens estimés sont chunqués avant envoi
- `max_tokens: 1500` par appel
- Les prompts sont versionnés dans `packages/core/src/prompts/`

---

## Git & PR

- Branches : `feat/`, `fix/`, `chore/`, `docs/`
- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Une PR = une fonctionnalité ou un fix
- Description de PR générée avec diffwise lui-même dès la Phase 1 ✓

---

## Ce qui est hors scope

- Support des diffs binaires
- Authentification utilisateur (Phase 1 & 2)
- Stockage persistant (Phase 1)
- Support multi-LLM (Anthropic uniquement)
