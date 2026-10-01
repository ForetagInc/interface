import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import type * as React from 'react';

import { cn } from '../utils';

function RadioGroup({
	className,
	...props
}: React.ComponentProps<typeof RadioGroupPrimitive>) {
	return (
		<RadioGroupPrimitive className={cn('grid gap-2', className)} {...props} />
	);
}

function RadioGroupItem({
	className,
	...props
}: React.ComponentProps<typeof RadioPrimitive.Root>) {
	return (
		<RadioPrimitive.Root
			// Shares the `--checkbox-*` token family so the two selection
			// controls match; `border-primary` read as flat black in most themes.
			className={cn(
				'inline-flex size-4 shrink-0 items-center justify-center rounded-full border shadow-[var(--checkbox-shadow,var(--borders-base))] outline-none transition-[background-color,border-color,box-shadow,color] [background:var(--checkbox-bg,var(--input-bg))] [border-color:var(--checkbox-border,var(--surface-border-base))] [color:transparent] focus-visible:shadow-[var(--borders-interactive-with-active)] data-disabled:cursor-not-allowed data-disabled:opacity-50 hover:[background:var(--checkbox-bg-hover,var(--input-bg-hover))] hover:[border-color:var(--checkbox-border-hover,var(--checkbox-border,var(--surface-border-base)))] data-checked:shadow-[var(--checkbox-checked-shadow,var(--button-shadow-primary))] data-checked:[background:var(--checkbox-checked-bg,var(--button-primary-bg))] data-checked:[border-color:var(--checkbox-checked-border,var(--button-primary-border))] data-checked:[color:var(--checkbox-checked-fg,var(--button-primary-fg))]',
				className,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator className="flex items-center justify-center">
				<span className="size-2 rounded-full bg-current" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	);
}

export { RadioGroup, RadioGroupItem };
