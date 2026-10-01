import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { tv, type VariantProps } from 'tailwind-variants';
import * as React from 'react';
import { cn } from '../utils';

const Tabs = TabsPrimitive.Root;

// The list is sized like a Button so the two line up in a toolbar: the same
// 1px border, and each trigger takes the Button's vertical padding minus the
// list's 2px inset. Heights stay derived from padding and line height, as
// Button's are, rather than fixed — 26 / 34 / 42 / 54px for sm → xl.
// Width scales with height too: padding is half the trigger's height and the
// minimum width about 2.4×, so every size keeps the same proportions.
const tabsTriggerVariants = tv({
	base: 'inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-[color,background-color,border-color,box-shadow] focus-visible:shadow-[var(--input-shadow-focus)] focus-visible:outline-none focus-visible:ring-0 data-active:bg-background data-active:text-foreground data-active:shadow-sm data-disabled:pointer-events-none data-disabled:opacity-50',
	variants: {
		size: {
			sm: 'min-w-12 gap-1.5 px-2.5 py-0.5 text-xs',
			default: 'min-w-17 gap-1.5 px-3.5 py-1 text-sm',
			lg: 'min-w-22 gap-2 px-4.5 py-2 text-sm',
			xl: 'min-w-28 gap-2 px-6 py-3 text-base',
		},
	},
	defaultVariants: {
		size: 'default',
	},
});

type TabsSize = NonNullable<VariantProps<typeof tabsTriggerVariants>['size']>;

const TabsSizeContext = React.createContext<TabsSize>('default');

function TabsList({
	className,
	size = 'default',
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { size?: TabsSize }) {
	return (
		<TabsSizeContext.Provider value={size}>
			<TabsPrimitive.List
				data-size={size}
				className={cn(
					'inline-flex items-center justify-center rounded-md border border-transparent bg-muted p-0.5 text-muted-foreground',
					className,
				)}
				{...props}
			/>
		</TabsSizeContext.Provider>
	);
}

function TabsTrigger({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Tab>) {
	const size = React.useContext(TabsSizeContext);

	return (
		<TabsPrimitive.Tab
			className={cn(tabsTriggerVariants({ size }), className)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Panel>) {
	return (
		<TabsPrimitive.Panel
			className={cn(
				'mt-2 focus-visible:shadow-[var(--input-shadow-focus)] focus-visible:outline-none focus-visible:ring-0',
				className,
			)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
