import { useRender } from '@base-ui/react/use-render';
import { tv, type VariantProps } from 'tailwind-variants';
import * as React from 'react';
import { cn } from '../utils';

const buttonVariants = tv({
	base: 'relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border font-medium outline-none transition-[color,background-color,border-color,box-shadow] [background:var(--btn-bg)] [border-color:var(--btn-border)] [color:var(--btn-fg)] shadow-[var(--btn-shadow)] hover:[background:var(--btn-bg-hover)] hover:[border-color:var(--btn-border-hover)] hover:[color:var(--btn-fg-hover,var(--btn-fg))] active:[background:var(--btn-bg-active)] active:[border-color:var(--btn-border-active)] active:shadow-[var(--btn-shadow-active)] focus-visible:shadow-[var(--borders-interactive-with-active)] focus-visible:ring-0 disabled:cursor-not-allowed disabled:[background:var(--button-disabled-bg)] disabled:[border-color:var(--button-disabled-border)] disabled:[color:var(--button-disabled-fg)] disabled:opacity-60 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary:
				'[--btn-bg:var(--button-primary-bg)] [--btn-bg-hover:var(--button-primary-bg-hover,var(--button-primary-bg))] [--btn-bg-active:var(--button-primary-bg-active,var(--button-primary-bg))] [--btn-border:var(--button-primary-border)] [--btn-border-hover:var(--button-primary-border-hover,var(--button-primary-border))] [--btn-border-active:var(--button-primary-border-active,var(--button-primary-border))] [--btn-fg:var(--button-primary-fg)] [--btn-shadow:var(--button-shadow-primary)] [--btn-shadow-active:var(--button-shadow-primary-active,var(--button-shadow-primary))]',
			secondary:
				'[--btn-bg:var(--button-secondary-bg)] [--btn-bg-hover:var(--button-secondary-bg-hover,var(--button-secondary-bg))] [--btn-bg-active:var(--button-secondary-bg-active,var(--button-secondary-bg))] [--btn-border:var(--button-secondary-border)] [--btn-border-hover:var(--button-secondary-border-hover,var(--button-secondary-border))] [--btn-border-active:var(--button-secondary-border-active,var(--button-secondary-border))] [--btn-fg:var(--button-secondary-fg)] [--btn-shadow:var(--button-shadow-secondary)] [--btn-shadow-active:var(--button-shadow-secondary-active,var(--button-shadow-secondary))]',
			destructive:
				'[--btn-bg:var(--button-danger-bg)] [--btn-bg-hover:var(--button-danger-bg-hover,var(--button-danger-bg))] [--btn-bg-active:var(--button-danger-bg-active,var(--button-danger-bg))] [--btn-border:var(--button-danger-border)] [--btn-border-hover:var(--button-danger-border-hover,var(--button-danger-border))] [--btn-border-active:var(--button-danger-border-active,var(--button-danger-border))] [--btn-fg:var(--button-danger-fg)] [--btn-shadow:var(--button-shadow-danger)] [--btn-shadow-active:var(--button-shadow-danger-active,var(--button-shadow-danger))]',
			outline:
				'[--btn-bg:var(--button-outline-bg)] [--btn-bg-hover:var(--button-outline-bg-hover,var(--button-outline-bg))] [--btn-bg-active:var(--button-outline-bg-active,var(--button-outline-bg))] [--btn-border:var(--button-outline-border)] [--btn-border-hover:var(--button-outline-border-hover,var(--button-outline-border))] [--btn-border-active:var(--button-outline-border-active,var(--button-outline-border))] [--btn-fg:var(--button-outline-fg)] [--btn-shadow:var(--button-shadow-outline)] [--btn-shadow-active:var(--button-shadow-outline-active,var(--button-shadow-outline))]',
			ghost:
				'[--btn-bg:var(--button-ghost-bg)] [--btn-bg-hover:var(--button-ghost-bg-hover,var(--button-ghost-bg))] [--btn-bg-active:var(--button-ghost-bg-active,var(--button-ghost-bg))] [--btn-border:var(--button-ghost-border)] [--btn-border-hover:var(--button-ghost-border-hover,var(--button-ghost-border))] [--btn-border-active:var(--button-ghost-border-active,var(--button-ghost-border))] [--btn-fg:var(--button-ghost-fg)] [--btn-shadow:var(--button-shadow-ghost)] [--btn-shadow-active:var(--button-shadow-ghost-active,var(--button-shadow-ghost))] [--btn-fg-hover:var(--button-ghost-fg-hover)]',
			link: '[--btn-bg:var(--button-link-bg)] [--btn-bg-hover:var(--button-link-bg-hover,var(--button-link-bg))] [--btn-bg-active:var(--button-link-bg-active,var(--button-link-bg))] [--btn-border:var(--button-link-border)] [--btn-border-hover:var(--button-link-border-hover,var(--button-link-border))] [--btn-border-active:var(--button-link-border-active,var(--button-link-border))] [--btn-fg:var(--button-link-fg)] [--btn-shadow:var(--button-shadow-link)] [--btn-shadow-active:var(--button-shadow-link-active,var(--button-shadow-link))] underline decoration-1 underline-offset-4 hover:decoration-2',
		},
		size: {
			default: 'gap-1.5 px-3 py-1.5 text-sm',
			sm: 'gap-1.5 px-2 py-1 text-xs',
			lg: 'gap-1.5 px-4 py-2.5 text-sm',
			xl: 'gap-1.5 px-5 py-3.5 text-base',
			icon: 'h-9 w-9 p-0',
		},
	},
	defaultVariants: {
		variant: 'secondary',
		size: 'default',
	},
});

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	/** Render as a different element, e.g. `render={<a href="/" />}`. */
	render?: useRender.RenderProp;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			render,
			isLoading = false,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const content = isLoading ? (
			<>
				<svg
					viewBox="0 0 24 24"
					className="size-4 animate-spin"
					aria-hidden="true"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
						fill="none"
						stroke="currentColor"
						strokeOpacity="0.25"
						strokeWidth="4"
					/>
					<path
						d="M22 12a10 10 0 0 1-10 10"
						fill="none"
						stroke="currentColor"
						strokeWidth="4"
						strokeLinecap="round"
					/>
				</svg>
				<span>{children}</span>
			</>
		) : (
			children
		);

		return useRender({
			render,
			ref,
			defaultTagName: 'button',
			props: {
				className: cn(buttonVariants({ variant, size, className })),
				disabled: disabled || isLoading,
				children: content,
				...props,
			},
		});
	},
);

Button.displayName = 'Button';

export { Button, buttonVariants };
