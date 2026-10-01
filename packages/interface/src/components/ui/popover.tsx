import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { cn } from '../utils';

/**
 * Carries the element registered by `PopoverAnchor` to `PopoverContent`. It is
 * state rather than a ref so the positioner re-renders once the anchor mounts.
 */
const PopoverAnchorContext = React.createContext<{
	anchor: HTMLElement | null;
	setAnchor: (element: HTMLElement | null) => void;
} | null>(null);

function Popover<Payload = unknown>(
	props: PopoverPrimitive.Root.Props<Payload>,
) {
	const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
	const context = React.useMemo(() => ({ anchor, setAnchor }), [anchor]);

	return (
		<PopoverAnchorContext.Provider value={context}>
			<PopoverPrimitive.Root {...props} />
		</PopoverAnchorContext.Provider>
	);
}

const PopoverTrigger = PopoverPrimitive.Trigger;

type PopoverAnchorProps = useRender.ComponentProps<'div'>;

/**
 * Positions the popover against an element other than its trigger — e.g. a
 * whole input field whose icon button is the trigger. Renders a `<div>`; use
 * `render` to make an existing element the anchor instead.
 */
function PopoverAnchor({ render, ref, ...props }: PopoverAnchorProps) {
	const context = React.useContext(PopoverAnchorContext);

	return useRender({
		render,
		ref: [ref ?? null, context?.setAnchor ?? null],
		defaultTagName: 'div',
		props,
	});
}

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Popup> &
	Pick<
		React.ComponentProps<typeof PopoverPrimitive.Positioner>,
		'side' | 'align' | 'sideOffset' | 'anchor'
	>;

function PopoverContent({
	className,
	align = 'center',
	side,
	sideOffset = 4,
	anchor,
	...props
}: PopoverContentProps) {
	const anchorContext = React.useContext(PopoverAnchorContext);

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				// An explicit `anchor` wins, then a `PopoverAnchor`, then Base UI's
				// default of the trigger.
				anchor={anchor ?? anchorContext?.anchor ?? undefined}
				className="z-50"
			>
				<PopoverPrimitive.Popup
					className={cn(
						'w-72 origin-(--transform-origin) rounded-md bg-[var(--popover-surface-bg)] p-4 text-[var(--popover-surface-fg)] shadow-[var(--popover-surface-shadow)] outline-none transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
