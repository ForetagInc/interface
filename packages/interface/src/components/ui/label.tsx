import type * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils';

const labelVariants = tv({
	base: 'inline-flex items-center gap-1 text-[var(--label-fg)] select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
	variants: {
		size: {
			xsmall: 'text-[10px] leading-3',
			small: 'text-xs leading-4',
			base: 'text-sm leading-5',
			large: 'text-base leading-6',
		},
		weight: {
			regular: 'font-normal',
			plus: 'font-medium',
		},
	},
	defaultVariants: {
		size: 'base',
		weight: 'regular',
	},
});

type LabelProps = React.ComponentProps<'label'> &
	VariantProps<typeof labelVariants>;

// Base UI has no Label primitive; a native <label> already carries the behaviour.
function Label({ className, size, weight, ...props }: LabelProps) {
	return (
		// oxlint-disable-next-line jsx-a11y/label-has-associated-control -- consumers associate via htmlFor or nesting
		<label
			className={cn(labelVariants({ size, weight }), className)}
			{...props}
		/>
	);
}

export { Label, labelVariants };
