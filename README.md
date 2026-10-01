# Interface

Interface is the design system for Foretag and associated brands.

- **[`packages/interface`](packages/interface)** — `@foretag/interface`, the published React component library.
- **[`storybook`](storybook)** — the documentation site and story-driven test suite.

## Getting started

```bash
bun install
bun run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Build the package, then serve Storybook on port 6006 |
| `bun run build` | Build the package and the static Storybook site |
| `bun run test` | Unit tests plus the browser story tests |
| `bun run ci` | Everything CI runs: lint, format check, typecheck, unit tests, story tests, build |
