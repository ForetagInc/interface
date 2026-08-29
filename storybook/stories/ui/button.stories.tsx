import { Button } from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';

const VARIANTS = [
	'primary',
	'secondary',
	'destructive',
	'outline',
	'ghost',
	'link',
] as const;

const meta = {
	title: 'Primitives/Button',
	component: Button,
	argTypes: {
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'xl', 'icon'],
		},
		variant: {
			control: 'select',
			options: [...VARIANTS],
		},
		isLoading: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	args: {
		children: 'Button',
		size: 'default',
		variant: 'secondary',
		isLoading: false,
		disabled: false,
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Every variant side by side — the list is otherwise unlocked by any test, so
// this is what makes an accidental duplicate or a theme regression visible.
export const AllVariants: Story = {
	parameters: { controls: { exclude: ['variant'] } },
	render: (args) => (
		<div className="flex flex-wrap items-center gap-3">
			{VARIANTS.map((variant) => (
				<Button {...args} key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</div>
	),
};

export const Icon: Story = {
	args: {
		size: 'icon',
		children: <i className="ti ti-plus" />,
		'aria-label': 'Add',
	},
};

export const Loading: Story = {
	args: { isLoading: true, children: 'Saving' },
};
