import { useEffect, useRef, useState } from 'react';

/**
 * Storybook themes the preview's <html>, but MDX prose keeps Storybook's own
 * docs surface — which does not follow the interface theme. Swatches therefore
 * have to carry their own themed canvas, or dark-theme colours end up rendered
 * on a light card.
 */

type SwatchKind = 'surface' | 'colour';

/** Tokens that are text colours are shown *on* their surface, not as a chip. */
const PAIRED: Record<string, string> = {
	foreground: 'background',
	'card-foreground': 'card',
	'popover-foreground': 'popover',
	'primary-foreground': 'primary',
	'secondary-foreground': 'secondary',
	'muted-foreground': 'muted',
	'accent-foreground': 'accent',
	'destructive-foreground': 'destructive',
};

function useResolvedTokens(tokens: string[]) {
	const ref = useRef<HTMLDivElement>(null);
	const [values, setValues] = useState<Record<string, string>>({});

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const read = () => {
			const style = getComputedStyle(el);
			setValues(
				Object.fromEntries(
					tokens.map((t) => [t, style.getPropertyValue(`--${t}`).trim()]),
				),
			);
		};

		read();

		// applyTheme() rewrites data-theme / data-mode / .dark on <html>.
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme', 'data-mode', 'class'],
		});
		return () => observer.disconnect();
	}, [tokens]);

	return [ref, values] as const;
}

export function Swatches({ tokens }: { tokens: string[] }) {
	const [ref, values] = useResolvedTokens(tokens);

	return (
		<div
			ref={ref}
			style={{
				background: 'var(--background)',
				color: 'var(--foreground)',
				border: '1px solid var(--border)',
				borderRadius: 10,
				padding: 12,
				margin: '16px 0',
			}}
		>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
					gap: 10,
				}}
			>
				{tokens.map((token) => (
					<Swatch key={token} token={token} value={values[token] ?? ''} />
				))}
			</div>
		</div>
	);
}

function Swatch({ token, value }: { token: string; value: string }) {
	const surface = PAIRED[token];
	const kind: SwatchKind = surface ? 'surface' : 'colour';

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: 8,
				background: 'var(--card)',
				color: 'var(--card-foreground)',
				border: '1px solid var(--border)',
				borderRadius: 8,
				minWidth: 0,
			}}
		>
			<span
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 34,
					height: 34,
					flexShrink: 0,
					borderRadius: 6,
					fontSize: 13,
					fontWeight: 600,
					background:
						kind === 'surface' ? `var(--${surface})` : `var(--${token})`,
					color: kind === 'surface' ? `var(--${token})` : undefined,
					// A single themed border disappears whenever the chip and the
					// surface are close in value — which is exactly what happens to
					// --border, --input and --ring. A dark/light double ring reads
					// against any colour in any theme.
					boxShadow:
						'inset 0 0 0 1px rgb(0 0 0 / 0.22), 0 0 0 1px rgb(255 255 255 / 0.22)',
				}}
			>
				{kind === 'surface' ? 'Aa' : null}
			</span>
			<span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
				<code style={{ fontSize: 12 }}>--{token}</code>
				<code
					style={{
						fontSize: 11,
						opacity: 0.65,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
					title={value}
				>
					{value || '—'}
				</code>
			</span>
		</div>
	);
}
