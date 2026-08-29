import { Textarea } from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Primitives/Textarea',
	component: Textarea,
	argTypes: {
		size: { control: 'select', options: ['base', 'small'] },
		resizable: {
			control: 'select',
			options: [true, false, 'horizontal', 'vertical'],
		},
		rows: { control: { type: 'number', min: 1, max: 12 } },
		disabled: { control: 'boolean' },
	},
	args: {
		size: 'base',
		rows: 4,
		placeholder: 'Leave with the neighbour',
		disabled: false,
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// `resizable` defaults to 'vertical'. Drag each grip to confirm the axis.
export const Resizable: Story = {
	parameters: { controls: { exclude: ['resizable'] } },
	render: (args) => (
		<div className="flex w-96 flex-col gap-4">
			{([false, 'vertical', 'horizontal', true] as const).map((resizable) => {
				const id = `resizable-${String(resizable)}`;
				return (
					<div key={id} className="flex flex-col gap-1">
						<label className="text-muted-foreground text-xs" htmlFor={id}>
							resizable={String(resizable)}
						</label>
						<Textarea {...args} id={id} resizable={resizable} />
					</div>
				);
			})}
		</div>
	),
};

export const Disabled: Story = {
	args: { disabled: true, value: 'Cannot edit or resize' },
};
