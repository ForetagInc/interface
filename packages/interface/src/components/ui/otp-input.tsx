import { OTPField } from '@base-ui/react/otp-field';
import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils';

const otpSlotVariants = tv({
	base: [
		'caret-foreground bg-(--input-bg) hover:bg-(--input-bg-hover) border-0 shadow-(--input-shadow) text-(--input-fg) text-center font-medium tabular-nums transition-[color,background-color,border-color,box-shadow] relative shrink-0 appearance-none rounded-md p-0 outline-none ring-0',
		'focus:ring-0 focus-visible:shadow-(--input-shadow-focus) focus-visible:ring-0',
		'disabled:cursor-not-allowed disabled:bg-(--input-disabled-bg) disabled:text-(--input-disabled-fg)',
		'aria-[invalid=true]:shadow-(--input-shadow-error) data-invalid:shadow-(--input-shadow-error)',
	],
	variants: {
		size: {
			base: 'size-(--otp-slot-size) text-sm',
			small: 'size-(--otp-slot-size-small) text-xs',
		},
	},
	defaultVariants: {
		size: 'base',
	},
});

export interface OtpInputProps
	extends
		Omit<React.ComponentProps<typeof OTPField.Root>, 'length' | 'children'>,
		VariantProps<typeof otpSlotVariants> {
	/** Number of characters in the code. */
	length?: number;
	/** Characters per group; a separator renders between groups. Use `length` (or 0) for no separator. */
	groupSize?: number;
	/** Rendered between groups. */
	separator?: React.ReactNode;
	slotClassName?: string;
	'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

function groupSlots(length: number, groupSize: number): number[][] {
	const indexes = Array.from({ length }, (_, i) => i);
	if (groupSize <= 0 || groupSize >= length) return [indexes];

	const groups: number[][] = [];
	for (let i = 0; i < length; i += groupSize) {
		groups.push(indexes.slice(i, i + groupSize));
	}
	return groups;
}

// Label it with `<Label htmlFor={id}>`: `id` lands on the first slot and the
// remaining slots inherit that label.
const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
	(
		{
			className,
			slotClassName,
			size,
			length = 6,
			groupSize = 3,
			separator = '-',
			'aria-invalid': ariaInvalid,
			...props
		},
		ref,
	) => {
		const groups = groupSlots(length, groupSize);

		return (
			<OTPField.Root
				ref={ref}
				length={length}
				data-slot="otp-input"
				className={cn('flex w-fit items-center gap-(--otp-gap)', className)}
				{...props}
			>
				{groups.map((group, groupIndex) => (
					<React.Fragment key={group[0]}>
						{groupIndex > 0 && (
							<OTPField.Separator
								data-slot="otp-input-separator"
								className={cn(
									'flex select-none items-center text-(--input-placeholder)',
									size === 'small' ? 'text-xs' : 'text-sm',
								)}
							>
								{separator}
							</OTPField.Separator>
						)}
						<div data-slot="otp-input-group" className="flex gap-(--otp-gap)">
							{group.map((index) => (
								<OTPField.Input
									key={index}
									data-slot="otp-input-slot"
									aria-invalid={ariaInvalid}
									className={cn(otpSlotVariants({ size }), slotClassName)}
								/>
							))}
						</div>
					</React.Fragment>
				))}
			</OTPField.Root>
		);
	},
);

OtpInput.displayName = 'OtpInput';

export { OtpInput, otpSlotVariants };
