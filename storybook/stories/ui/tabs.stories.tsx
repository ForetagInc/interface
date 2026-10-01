import {
	Button,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';

type TabsDemoArgs = {
	/** Lives on TabsList; reaches every trigger via context. */
	size: 'sm' | 'default' | 'lg' | 'xl';
};

const meta: Meta<TabsDemoArgs> = {
	title: 'Primitives/Tabs',
	argTypes: {
		size: { control: 'select', options: ['sm', 'default', 'lg', 'xl'] },
	},
	args: {
		size: 'default',
	},
};

export default meta;

type Story = StoryObj<TabsDemoArgs>;

export const Default: Story = {
	render: ({ size }) => (
		<Tabs defaultValue="overview" style={{ width: 460 }}>
			<TabsList size={size}>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">Revenue is up 12% this month.</TabsContent>
			<TabsContent value="activity">Four orders were placed today.</TabsContent>
			<TabsContent value="settings">Manage workspace preferences.</TabsContent>
		</Tabs>
	),
};

// TabsList takes Button's sizes, so a tab group and its neighbouring actions
// share one height in a toolbar.
export const Sizes: Story = {
	// Every size is on screen at once, so a size control has nothing to drive.
	parameters: { controls: { exclude: ['size'] } },
	render: () => (
		<div style={{ display: 'grid', gap: 12 }}>
			{(['sm', 'default', 'lg', 'xl'] as const).map((size) => (
				<div
					key={size}
					style={{ display: 'flex', alignItems: 'center', gap: 8 }}
				>
					<Tabs defaultValue="day">
						<TabsList size={size} aria-label={`Range (${size})`}>
							<TabsTrigger value="day">Day</TabsTrigger>
							<TabsTrigger value="week">Week</TabsTrigger>
							<TabsTrigger value="month">Month</TabsTrigger>
						</TabsList>
					</Tabs>
					<Button variant="outline" size={size}>
						Export
					</Button>
				</div>
			))}
		</div>
	),
};
