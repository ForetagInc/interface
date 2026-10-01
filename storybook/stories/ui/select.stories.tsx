import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Base UI resolves the trigger label from `items`; without it the raw value shows.
const teammates = {
	ada: 'Ada Lovelace',
	alan: 'Alan Turing',
	eva: 'Eva Zeisel',
};

const sizes = {
	xs: 'Extra small',
	sm: 'Small',
	md: 'Medium',
	lg: 'Large',
	xl: 'Extra large',
};

const timezones = Object.fromEntries(
	Array.from({ length: 14 }, (_, i) => {
		const offset = i - 6;
		const value = `utc${offset >= 0 ? '+' : ''}${offset}`;
		return [value, `UTC${offset >= 0 ? '+' : ''}${offset}:00`];
	}),
);

type SelectDemoProps = {
	/** Lives on the Select root; reaches trigger and items via context. */
	size?: 'base' | 'small';
	/** The rest are SelectContent props, forwarded to Base UI's Positioner. */
	alignItemWithTrigger?: boolean;
	side?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	collisionPadding?: number;
	items?: Record<string, string>;
	defaultValue?: string;
	placeholder?: string;
	label?: string;
};

/**
 * The interesting props live on SelectContent rather than the Select root, so a
 * plain `component: Select` meta leaves them invisible in Controls. This wrapper
 * hoists both levels into one flat prop set the panel can drive.
 */
function SelectDemo({
	size,
	alignItemWithTrigger,
	side,
	align,
	sideOffset,
	collisionPadding,
	items = teammates,
	defaultValue,
	placeholder = 'Select an option',
	label = 'Demo select',
}: SelectDemoProps) {
	return (
		<div style={{ width: 280 }}>
			<Select size={size} items={items} defaultValue={defaultValue}>
				<SelectTrigger aria-label={label}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent
					align={align}
					alignItemWithTrigger={alignItemWithTrigger}
					collisionPadding={collisionPadding}
					side={side}
					sideOffset={sideOffset}
				>
					{Object.entries(items).map(([value, itemLabel]) => (
						<SelectItem key={value} value={value}>
							{itemLabel}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

const meta = {
	title: 'Primitives/Select',
	component: SelectDemo,
	argTypes: {
		size: { control: 'select', options: ['base', 'small'] },
		alignItemWithTrigger: { control: 'boolean' },
		side: {
			control: 'select',
			options: ['top', 'bottom', 'left', 'right'],
		},
		align: { control: 'select', options: ['start', 'center', 'end'] },
		sideOffset: { control: { type: 'number', min: 0, max: 32 } },
		collisionPadding: { control: { type: 'number', min: 0, max: 64 } },
		items: { control: 'object' },
		defaultValue: { control: 'text' },
		placeholder: { control: 'text' },
	},
	args: {
		size: 'base',
		alignItemWithTrigger: false,
		sideOffset: 8,
		collisionPadding: 24,
		items: teammates,
		defaultValue: 'ada',
		placeholder: 'Select a teammate',
		label: 'Assignee',
	},
} satisfies Meta<typeof SelectDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The case that exposed the misplacement: a value selected late in a long list.
// With Base UI's default `alignItemWithTrigger`, the popup overlapped the trigger
// and shifted to line the selected row up with the trigger's text — so it landed
// somewhere different for every selection, and differently again for keyboard vs
// mouse. It now opens below the trigger, in the same place every time.
export const PreselectedInLongList: Story = {
	args: {
		items: timezones,
		defaultValue: 'utc+6',
		placeholder: 'Select a timezone',
		label: 'Timezone',
	},
};

// Opt back into Base UI's native-select behaviour: the popup overlaps the trigger
// so the selected row sits over the trigger's value, keeping the current choice
// under the cursor. Deliberately a short list — the mode needs room to overlap,
// and Base UI falls back to a plain dropdown when it can't fit. Mouse input only.
export const AlignedToSelectedItem: Story = {
	args: {
		alignItemWithTrigger: true,
		items: sizes,
		defaultValue: 'md',
		placeholder: 'Select a size',
		label: 'Size',
	},
};

// Groups, labels and separators need their own composition, so this one opts out
// of the wrapper — the positioning controls above don't apply to it.
export const Grouped: Story = {
	parameters: {
		controls: {
			exclude: [
				'alignItemWithTrigger',
				'side',
				'align',
				'sideOffset',
				'collisionPadding',
				'items',
				'defaultValue',
				'placeholder',
				'label',
			],
		},
	},
	render: (args) => (
		<div style={{ width: 280 }}>
			<Select size={args.size} items={teammates} defaultValue="ada">
				<SelectTrigger aria-label="Assignee">
					<SelectValue placeholder="Select a teammate" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Engineering</SelectLabel>
						<SelectItem value="ada">Ada Lovelace</SelectItem>
						<SelectItem value="alan">Alan Turing</SelectItem>
					</SelectGroup>
					<SelectSeparator />
					<SelectGroup>
						<SelectLabel>Design</SelectLabel>
						<SelectItem value="eva">Eva Zeisel</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	),
};

const countries = [
	{ value: 'gb', label: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
	{ value: 'fr', label: 'France', flag: '🇫🇷', currency: 'EUR' },
	{ value: 'se', label: 'Sweden', flag: '🇸🇪', currency: 'SEK' },
	{ value: 'jp', label: 'Japan', flag: '🇯🇵', currency: 'JPY' },
	{ value: 'us', label: 'United States', flag: '🇺🇸', currency: 'USD' },
];

// `icon` leads each option and `detail` is pinned to the right. Only the label
// is item text, so typing "fr" finds France and the trigger never shows "EUR".
// The trigger repeats the flag through SelectValue's render function.
export const WithIconsAndDetail: Story = {
	parameters: {
		controls: {
			exclude: [
				'alignItemWithTrigger',
				'side',
				'align',
				'sideOffset',
				'collisionPadding',
				'items',
				'defaultValue',
				'placeholder',
				'label',
			],
		},
	},
	render: (args) => (
		<div style={{ width: 280 }}>
			<Select
				size={args.size}
				items={countries.map(({ value, label }) => ({ value, label }))}
				defaultValue="gb"
			>
				<SelectTrigger aria-label="Country">
					<SelectValue placeholder="Select a country">
						{(value: string) => {
							const country = countries.find((c) => c.value === value);
							return (
								<span className="flex items-center gap-2">
									<span aria-hidden="true">{country?.flag}</span>
									{country?.label}
								</span>
							);
						}}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{countries.map((country) => (
						<SelectItem
							key={country.value}
							value={country.value}
							icon={country.flag}
							detail={country.currency}
						>
							{country.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	),
};

// Any node works as an icon — here Tabler glyphs, with no detail.
export const WithIcons: Story = {
	parameters: {
		controls: {
			exclude: [
				'alignItemWithTrigger',
				'side',
				'align',
				'sideOffset',
				'collisionPadding',
				'items',
				'defaultValue',
				'placeholder',
				'label',
			],
		},
	},
	render: (args) => (
		<div style={{ width: 280 }}>
			<Select
				size={args.size}
				items={{ list: 'List', board: 'Board', calendar: 'Calendar' }}
				defaultValue="board"
			>
				<SelectTrigger aria-label="View">
					<SelectValue placeholder="Select a view" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="list" icon={<i className="ti ti-list" />}>
						List
					</SelectItem>
					<SelectItem
						value="board"
						icon={<i className="ti ti-layout-kanban" />}
					>
						Board
					</SelectItem>
					<SelectItem value="calendar" icon={<i className="ti ti-calendar" />}>
						Calendar
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	),
};
