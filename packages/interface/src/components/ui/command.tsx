import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { cn } from '../utils';
import { Dialog, DialogContent } from '.';

// Matches the flyout surface used by the menu and popover primitives, so a
// standalone palette reads as a surface instead of bare text on the page.
// `CommandDialog` strips it again -- there the dialog supplies the chrome.
const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive
		ref={ref}
		className={cn(
			'flex h-full w-full flex-col overflow-hidden rounded-md bg-ui-bg-component text-ui-fg-base shadow-elevation-flyout',
			className,
		)}
		{...props}
	/>
));

Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = Omit<
	React.ComponentProps<typeof Dialog>,
	'children'
> & {
	children?: React.ReactNode;
};

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent
				showOverlay={false}
				showCloseButton={false}
				className="min-w-lg overflow-hidden p-0"
			>
				<Command className="rounded-none bg-transparent shadow-none **:[[cmdk-input]]:h-12">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<div
		className="flex h-10 items-center gap-2 border-ui-border-base border-b px-3"
		cmdk-input-wrapper=""
	>
		{/* Tabler icons are a webfont, so they take a font size, not a box. */}
		<i className="ti ti-search shrink-0 text-lg text-ui-fg-subtle" />
		<CommandPrimitive.Input
			ref={ref}
			className={cn(
				'flex h-full w-full border-none bg-transparent p-0 text-sm shadow-none outline-none ring-0 placeholder:text-ui-fg-subtle focus:outline-none focus:ring-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	</div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn(
			'max-h-75 overflow-y-auto overflow-x-hidden overscroll-contain',
			className,
		)}
		{...props}
	/>
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Empty
		ref={ref}
		className={cn('py-6 text-center text-sm text-ui-fg-subtle', className)}
		{...props}
	/>
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Group
		ref={ref}
		className={cn(
			'overflow-hidden p-1 text-ui-fg-base [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:h-7 [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:text-ui-fg-subtle [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.03em]',
			className,
		)}
		{...props}
	/>
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Separator
		ref={ref}
		className={cn('my-1 h-px bg-separator', className)}
		{...props}
	/>
));

CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2 text-sm outline-none transition-colors data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ui-fg-subtle",
			className,
		)}
		{...props}
	/>
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn('ml-auto text-ui-fg-subtle text-xs', className)}
			{...props}
		/>
	);
};
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
