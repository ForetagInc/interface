# @foretag/interface

> Interface UI components, design tokens, primitives and shared interface foundations by [Foretag](https://foretag.co).

[![npm version](https://img.shields.io/npm/v/%40foretag%2Finterface)](https://www.npmjs.com/package/@foretag/interface)
[![license: Unlicense](https://img.shields.io/badge/license-Unlicense-blue)](UNLICENSE)

**Interface** is the design system that powers every Foretag product — 40+ accessible React components built on [Base UI](https://base-ui.com) and [Tailwind CSS v4](https://tailwindcss.com), with a multi-theme token system, typed variants, and zero product-specific baggage.

Primitives only — anything product-specific belongs in the app that owns it.

## Highlights

- ⚛️ **React 19 + Base UI** — accessible, unstyled behaviour underneath; composition via Base UI's `render` prop instead of `asChild`
- 🎨 **Four built-in themes** — `marble`, `graphene`, `euclid` and `doomsday`, each expressed purely through design tokens with light/dark/system mode resolution
- 🧩 **Typed variants** — every component's variants are real TypeScript props, defined with [Tailwind Variants](https://www.tailwind-variants.org)
- 🌗 **Theme runtime included** — `applyTheme`, `useResolvedThemeMode` and friends handle mode resolution, `data-*` attributes and `color-scheme` for you
- 🪶 **Tree-shakeable ESM** — `sideEffects` limited to CSS, types shipped alongside

## Installation

```bash
bun add @foretag/interface
```

`react` and `react-dom` **19** are peer dependencies. The stylesheet is shipped as Tailwind v4 source CSS, so your app needs Tailwind CSS v4 in its build pipeline.

## Quick start

Import the stylesheet once, then use components anywhere:

```tsx
import '@foretag/interface/styles.css';
import { Button, Card, Badge } from '@foretag/interface';

export function Example() {
	return (
		<Card>
			<Badge>New</Badge>
			<Button variant="destructive" size="lg">
				Delete workspace
			</Button>
		</Card>
	);
}
```

## Entry points

| Import | Contents |
| --- | --- |
| `@foretag/interface` | All components, hooks and theme helpers |
| `@foretag/interface/styles.css` | Tokens, themes, fonts, icons and Tailwind layers |
| `@foretag/interface/themes` | Theme helpers alone, without pulling in React |

## Theming

Interface ships four themes, each defined entirely in CSS tokens:

| Theme | Modes | Character |
| --- | --- | --- |
| `marble` *(default)* | light · dark | Neutral, balanced |
| `graphene` | dark | Deep, high-contrast |
| `euclid` | light | Crisp, editorial |
| `doomsday` | dark | Moody, dramatic |

Apply a theme by writing `data-theme` and mode attributes to the document root — or let the runtime do it:

```tsx
import { applyTheme } from '@foretag/interface/themes';

// Resolves 'system' against the OS preference, clamps to modes
// the theme supports, and writes data-theme / data-mode / .dark
applyTheme(document.documentElement, 'graphene', 'system');
```

Inside React, `useResolvedThemeMode()` tracks the resolved `light`/`dark` mode reactively. Theme-scoped styling is available through Tailwind variants like `theme-marble:` and `dark:`.

## Components

<table>
<tr><td><strong>Actions</strong></td><td>Button · Dropdown Menu · Command · Kbd</td></tr>
<tr><td><strong>Forms</strong></td><td>Form · Field · Label · Input · Input Group · Number Input · Currency Input · Textarea · Checkbox · Radio Group · Switch · Slider · Select · Native Select · Choicebox · Date Picker · Calendar</td></tr>
<tr><td><strong>Overlays</strong></td><td>Dialog · Alert Dialog · Sheet · Popover · Tooltip · Sonner (toasts)</td></tr>
<tr><td><strong>Layout</strong></td><td>Card · Sidebar · Resizable · Scroll Area · Separator · Collapsible · Accordion · Tabs</td></tr>
<tr><td><strong>Display</strong></td><td>Avatar · Avatar Group · Badge · Alert · Breadcrumb · Progress · Skeleton · Empty</td></tr>
</table>

Full documentation and a live component reference live in Storybook.

## Conventions

Two things differ from what you may know from shadcn/ui or Radix:

1. **Composition** uses Base UI's `render` prop rather than `asChild`.
2. **Variants** are typed props defined with Tailwind Variants — no string-matching class names.

## License

Public domain, under the [Unlicense](UNLICENSE). Take what you need.
