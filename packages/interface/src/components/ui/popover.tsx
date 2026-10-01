import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { cn } from '../utils';

/**
 * Carries the element registered by `PopoverAnchor` to `PopoverContent`, and a
 * way for `PopoverForm` to close the popover once it has saved. The anchor is
 * state rather than a ref so the positioner re-renders once the anchor mounts.
 */
const PopoverContext = React.createContext<{
	anchor: HTMLElement | null;
	setAnchor: (element: HTMLElement | null) => void;
	close: () => void;
} | null>(null);

function Popover<Payload = unknown>({
	actionsRef: actionsRefProp,
	...props
}: PopoverPrimitive.Root.Props<Payload>) {
	const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
	const ownActionsRef = React.useRef<PopoverPrimitive.Root.Actions>(null);
	const actionsRef = actionsRefProp ?? ownActionsRef;

	// Closing through Base UI's actions keeps controlled popovers working: it
	// reports the change through `onOpenChange` instead of setting state here.
	const close = React.useCallback(
		() => actionsRef.current?.close(),
		[actionsRef],
	);
	const context = React.useMemo(
		() => ({ anchor, setAnchor, close }),
		[anchor, close],
	);

	return (
		<PopoverContext.Provider value={context}>
			<PopoverPrimitive.Root actionsRef={actionsRef} {...props} />
		</PopoverContext.Provider>
	);
}

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverClose = PopoverPrimitive.Close;

type PopoverAnchorProps = useRender.ComponentProps<'div'>;

/**
 * Positions the popover against an element other than its trigger — e.g. a
 * whole input field whose icon button is the trigger. Renders a `<div>`; use
 * `render` to make an existing element the anchor instead.
 */
function PopoverAnchor({ render, ref, ...props }: PopoverAnchorProps) {
	const context = React.useContext(PopoverContext);

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
	const context = React.useContext(PopoverContext);

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				align={align}
				side={side}
				sideOffset={sideOffset}
				// An explicit `anchor` wins, then a `PopoverAnchor`, then Base UI's
				// default of the trigger.
				anchor={anchor ?? context?.anchor ?? undefined}
				className="z-50"
			>
				<PopoverPrimitive.Popup
					className={cn(
						'flex w-72 max-w-(--available-width) origin-(--transform-origin) flex-col gap-3 rounded-lg bg-[var(--popover-surface-bg)] p-3 text-[var(--popover-surface-fg)] text-sm shadow-[var(--popover-surface-shadow)] outline-none transition-[opacity,transform] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
						className,
					)}
					{...props}
				/>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}

/** Names the popup for assistive tech, so render one whenever it has a heading. */
function PopoverTitle({
	className,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Title>) {
	return (
		<PopoverPrimitive.Title
			className={cn('font-semibold text-sm leading-none', className)}
			{...props}
		/>
	);
}

function PopoverDescription({
	className,
	...props
}: React.ComponentProps<typeof PopoverPrimitive.Description>) {
	return (
		<PopoverPrimitive.Description
			className={cn('text-muted-foreground text-xs', className)}
			{...props}
		/>
	);
}

function PopoverFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex justify-end gap-2 pt-1', className)} {...props} />
	);
}

/**
 * Edits values inside a popover with one rule for saving: Enter or a submit
 * button saves and closes, while Escape, clicking outside or a `PopoverClose`
 * discards. Call `event.preventDefault()` in `onSubmit` to keep it open, e.g.
 * when validation fails. Use `defaultValue` on the fields so every opening
 * starts from the saved value rather than a stale draft.
 */
function PopoverForm({
	className,
	onSubmit,
	...props
}: React.ComponentProps<'form'>) {
	const context = React.useContext(PopoverContext);

	return (
		<form
			className={cn('flex flex-col gap-3', className)}
			onSubmit={(event) => {
				onSubmit?.(event);
				const keepOpen = event.defaultPrevented;
				// The popover is the whole interaction, so never navigate the page.
				event.preventDefault();
				if (!keepOpen) {
					context?.close();
				}
			}}
			{...props}
		/>
	);
}

export {
	Popover,
	PopoverTrigger,
	PopoverAnchor,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverDescription,
	PopoverFooter,
	PopoverForm,
	PopoverClose,
};
