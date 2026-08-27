# @foretag/interface

Foretag's design system: accessible React primitives built on [Base UI](https://base-ui.com) and Tailwind CSS v4.

Primitives only — anything product-specific belongs in the app that owns it.

## Install

```bash
bun add @foretag/interface
```

React 19 is a peer dependency.

## Use

```tsx
import '@foretag/interface/styles.css';
import { Button } from '@foretag/interface';

<Button variant="danger" size="lg">Delete</Button>;
```

Two conventions differ from shadcn/Radix: composition uses Base UI's `render`
prop rather than `asChild`, and variants are typed props defined with
[Tailwind Variants](https://www.tailwind-variants.org).

## Entry points

| Import | Contents |
| --- | --- |
| `@foretag/interface` | All primitives, hooks and theme helpers |
| `@foretag/interface/styles.css` | Tokens, themes, fonts and Tailwind layers |
| `@foretag/interface/themes` | Theme helpers alone, without pulling in React components |

Full documentation and a live component reference are in Storybook.

## Licence

[Unlicense](UNLICENSE).
