import { Select as SelectPrimitive } from '@base-ui/react/select';
import * as React from 'react';
import { tv } from 'tailwind-variants';
import { cn } from '../utils';

type SelectSize = 'base' | 'small';

const SelectSizeContext = React.createContext<SelectSize>('base');

const selectTriggerVariants = tv({
	base: 'flex w-full items-center justify-between gap-2 rounded-md border-0 bg-[var(--select-bg)] text-[var(--select-fg)] shadow-[var(--select-shadow)] transition-[color,background-color,border-color,box-shadow] hover:bg-[var(--select-bg-hover)] focus:outline-none focus-visible:shadow-[var(--select-shadow-focus)] focus-visible:ring-0 data-disabled:cursor-not-allowed data-disabled:bg-[var(--select-disabled-bg)] data-disabled:text-[var(--select-disabled-fg)] data-[placeholder]:text-[var(--select-placeholder)] [&>span]:line-clamp-1',
	variants: {
		size: {
			base: 'h-9 px-2.5 py-2 text-sm',
			small: 'h-8 px-2 py-1.5 text-xs',
		},
	},
	defaultVariants: {
		size: 'base',
	},
});

const selectItemVariants = tv({
	base: 'relative flex w-full cursor-pointer select-none items-center rounded-md pr-2 pl-8 text-[var(--select-content-fg)] outline-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground',
	variants: {
		size: {
			base: 'h-8 py-1.5 text-sm',
			small: 'h-7 py-1 text-xs',
		},
	},
	defaultVariants: {
		size: 'base',
	},
});

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
	size?: SelectSize;
};

const Select = ({ size = 'base', children, ...props }: SelectProps) => (
	<SelectSizeContext.Provider value={size}>
		<SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
	</SelectSizeContext.Provider>
);

const SelectGroup = SelectPrimitive.Group;

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;

/** Matches what Base UI treats as "nothing selected" for the placeholder. */
function isEmptyValue(value: unknown) {
	return (
		value === null ||
		value === undefined ||
		value === '' ||
		(Array.isArray(value) && value.length === 0)
	);
}

function SelectValue({ placeholder, children, ...props }: SelectValueProps) {
	// Without children, Base UI resolves the label from the root's `items`
	// (records, arrays, groups and `itemToStringLabel`) and shows `placeholder`
	// while nothing is selected.
	if (children == null) {
		return <SelectPrimitive.Value placeholder={placeholder} {...props} />;
	}

	// Base UI lets children override the placeholder; keep it winning while the
	// select is empty so custom formatting never has to handle that case.
	return (
		<SelectPrimitive.Value placeholder={placeholder} {...props}>
			{(value) => {
				if (isEmptyValue(value)) return placeholder;
				return typeof children === 'function' ? children(value) : children;
			}}
		</SelectPrimitive.Value>
	);
}

function SelectTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
	const size = React.useContext(SelectSizeContext);

	return (
		<SelectPrimitive.Trigger
			className={cn(selectTriggerVariants({ size }), className)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon className="flex flex-col items-center justify-center text-(--select-placeholder)">
				<i className="ti ti-selector" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
	return (
		<SelectPrimitive.ScrollUpArrow
			className={cn(
				'absolute inset-x-0 top-0 z-10 flex cursor-default items-center justify-center rounded-t-md bg-[var(--select-content-bg)] py-1 text-[var(--select-content-fg)]',
				className,
			)}
			{...props}
		>
			<i className="ti ti-chevron-up text-base" />
		</SelectPrimitive.ScrollUpArrow>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
	return (
		<SelectPrimitive.ScrollDownArrow
			className={cn(
				'absolute inset-x-0 bottom-0 z-10 flex cursor-default items-center justify-center rounded-b-md bg-[var(--select-content-bg)] py-1 text-[var(--select-content-fg)]',
				className,
			)}
			{...props}
		>
			<i className="ti ti-chevron-down text-base" />
		</SelectPrimitive.ScrollDownArrow>
	);
}

type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Popup> &
	Pick<
		React.ComponentProps<typeof SelectPrimitive.Positioner>,
		| 'side'
		| 'align'
		| 'sideOffset'
		| 'collisionPadding'
		| 'alignItemWithTrigger'
	>;

function SelectContent({
	className,
	children,
	side,
	align,
	sideOffset = 8,
	collisionPadding = 24,
	// Base UI defaults this to true, which overlaps the popup onto the trigger so
	// the selected item's text lines up with the trigger's value. That makes the
	// popup jump around with the selection, and it only applies to mouse input, so
	// click and keyboard open differently. Default to a conventional dropdown.
	alignItemWithTrigger = false,
	...props
}: SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Positioner
				className="z-50"
				side={side}
				align={align}
				sideOffset={sideOffset}
				collisionPadding={collisionPadding}
				alignItemWithTrigger={alignItemWithTrigger}
			>
				<SelectPrimitive.Popup
					className={cn(
						'max-h-(--available-height) min-w-(--anchor-width) origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-md bg-[var(--select-content-bg)] text-[var(--select-content-fg)] shadow-[var(--select-content-shadow)] transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
						className,
					)}
					{...props}
				>
					<SelectScrollUpButton />
					<SelectPrimitive.List className="overflow-y-auto p-0.5">
						{children}
					</SelectPrimitive.List>
					<SelectScrollDownButton />
				</SelectPrimitive.Popup>
			</SelectPrimitive.Positioner>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
	return (
		<SelectPrimitive.GroupLabel
			className={cn('py-1.5 pr-2 pl-8 font-semibold text-sm', className)}
			{...props}
		/>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	const size = React.useContext(SelectSizeContext);

	return (
		<SelectPrimitive.Item
			className={cn(selectItemVariants({ size }), className)}
			{...props}
		>
			<span className="absolute left-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<i className="ti ti-check text-lg" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

// Base UI's select has no separator part, so this is a plain presentational rule.
function SelectSeparator({ className, ...props }: React.ComponentProps<'hr'>) {
	return (
		<hr
			className={cn('-mx-1 my-1 h-px border-0 bg-separator', className)}
			{...props}
		/>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
