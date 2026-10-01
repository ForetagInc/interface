import {
	Button,
	Input,
	Label,
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
	title: 'Primitives/Popover',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger render={<Button variant="outline" />}>
				Set discount
			</PopoverTrigger>
			<PopoverContent>
				<div style={{ display: 'grid', gap: 8 }}>
					<Label htmlFor="discount">Discount %</Label>
					<Input id="discount" defaultValue="10" />
				</div>
			</PopoverContent>
		</Popover>
	),
};

// Only the icon button opens the popover, but it lines up with the whole field —
// the shape DatePicker uses. Without PopoverAnchor it would centre on the icon.
// The popup also reads the anchor's width through `--anchor-width`.
export const WithAnchor: Story = {
	render: () => (
		<Popover>
			<PopoverAnchor
				style={{ width: 320, display: 'flex', alignItems: 'center', gap: 8 }}
			>
				<Input aria-label="Coupon code" placeholder="Coupon code" />
				<PopoverTrigger
					render={
						<Button variant="outline" size="icon" aria-label="Browse coupons" />
					}
				>
					<i className="ti ti-chevron-down" />
				</PopoverTrigger>
			</PopoverAnchor>
			<PopoverContent align="start" className="w-(--anchor-width)">
				<div style={{ display: 'grid', gap: 8 }}>
					<span className="font-medium text-sm">Available coupons</span>
					<Button variant="ghost">SPRING10 · 10% off</Button>
					<Button variant="ghost">FREESHIP · Free delivery</Button>
				</div>
			</PopoverContent>
		</Popover>
	),
};
