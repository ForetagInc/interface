import { Avatar, AvatarFallback } from './avatar';
import { cn } from '../utils';
import * as React from 'react';

type AvatarProps = React.ComponentProps<typeof Avatar>;
type AvatarSize = NonNullable<AvatarProps['size']>;

// The overlap tracks the avatar box so the stagger reads the same at every size.
const overlapBySize: Record<AvatarSize, string> = {
	'2xsmall': '-ml-1.5',
	xsmall: '-ml-1.5',
	small: '-ml-2',
	base: '-ml-2',
	large: '-ml-2.5',
	xlarge: '-ml-3',
};

interface AvatarGroupProps
	extends Omit<React.ComponentProps<'div'>, 'children'> {
	children: React.ReactElement<AvatarProps> | React.ReactElement<AvatarProps>[];
	/** Sizes every avatar in the group, the overflow chip included. */
	size?: AvatarSize;
	/**
	 * Shapes every avatar in the group. Left unset, each child keeps its own
	 * variant and the overflow chip follows the first one.
	 */
	variant?: AvatarProps['variant'];
	/** Extra classes for each avatar (ex: shadow, ring colour). */
	avatarClassName?: string;
	/**
	 * Escape hatch for a size outside the scale. Prefer `size`, which also keeps
	 * the overlap in step.
	 */
	sizeClassName?: string;
	max?: number;
}

export const AvatarGroup = ({
	children,
	max,
	size = 'base',
	variant,
	className,
	avatarClassName,
	sizeClassName,
	...props
}: AvatarGroupProps) => {
	const all = React.Children.toArray(children).filter(
		React.isValidElement,
	) as React.ReactElement<AvatarProps>[];
	const total = all.length;

	const limit = typeof max === 'number' && max > 0 ? max : total;
	const displayed = all.slice(0, limit);
	const remaining = total > limit ? total - limit : 0;

	const count = displayed.length + (remaining > 0 ? 1 : 0);
	const shape = variant ?? displayed[0]?.props.variant;

	// Avatars are painted left over right, so the stack is declared rather than
	// left to DOM order: with every layer on `auto`, `hover:z-*` is the only
	// z-index in play and whichever avatar is hovered wins by default. Naming
	// each layer keeps the resting order stable and lets hover raise past it.
	const layer = (index: number) =>
		({ '--avatar-layer': count - index }) as React.CSSProperties;

	// No overlap on the leading avatar -- its negative margin would pull it
	// outside the group's own box and misalign whatever sits to the left.
	const stack = (index: number) =>
		cn(
			'z-(--avatar-layer) ring-2 ring-(color:--avatar-group-ring) hover:z-50',
			index > 0 && overlapBySize[size],
		);

	return (
		<div
			className={cn(
				// The ring punches each avatar out of the surface behind it, so it
				// tracks that surface: override the variable on a tinted background.
				'isolate flex items-center [--avatar-group-ring:var(--background)]',
				className,
			)}
			{...props}
		>
			{displayed.map((avatar, index) =>
				React.cloneElement(avatar, {
					key: avatar.key ?? index,
					size,
					variant: variant ?? avatar.props.variant,
					style: { ...avatar.props.style, ...layer(index) },
					className: cn(
						stack(index),
						avatar.props.className,
						avatarClassName,
						sizeClassName,
					),
				}),
			)}

			{remaining > 0 && (
				<Avatar
					size={size}
					variant={shape}
					style={layer(displayed.length)}
					className={cn(
						stack(displayed.length),
						avatarClassName,
						sizeClassName,
					)}
				>
					{/* No size class here: the fallback fills the padded box, and
					    pinning it to the outer size overflows the inset radius. */}
					<AvatarFallback className="bg-muted-foreground text-background">
						+{remaining}
					</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
};
