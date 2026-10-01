import {
	Button,
	Input,
	Label,
	Popover,
	PopoverAnchor,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverFooter,
	PopoverForm,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';

const meta: Meta = {
	title: 'Primitives/Popover',
};

export default meta;

type Story = StoryObj;

// Editing a value: the trigger shows what is saved, and the field only ever
// starts from that. Enter or Save commits and closes; Cancel, Escape or a click
// outside throws the draft away, so there is never a half-saved state.
export const Default: Story = {
	render: function EditDiscount() {
		const [discount, setDiscount] = useState(10);

		return (
			<Popover>
				<PopoverTrigger render={<Button variant="outline" />}>
					Discount: {discount}%
				</PopoverTrigger>
				<PopoverContent>
					<PopoverForm
						onSubmit={(event) => {
							const value = Number(
								new FormData(event.currentTarget).get('discount'),
							);
							setDiscount(value);
						}}
					>
						<PopoverHeader>
							<PopoverTitle>Discount</PopoverTitle>
							<PopoverDescription>
								Applied to every line on this order.
							</PopoverDescription>
						</PopoverHeader>
						<div style={{ display: 'grid', gap: 6 }}>
							<Label htmlFor="discount">Percentage</Label>
							<Input
								id="discount"
								name="discount"
								type="number"
								min={0}
								max={100}
								required
								defaultValue={discount}
							/>
						</div>
						<PopoverFooter>
							<PopoverClose render={<Button variant="ghost" size="sm" />}>
								Cancel
							</PopoverClose>
							<Button type="submit" variant="primary" size="sm">
								Save
							</Button>
						</PopoverFooter>
					</PopoverForm>
				</PopoverContent>
			</Popover>
		);
	},
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole('button', { name: 'Discount: 10%' });

		// Enter saves and closes.
		await userEvent.click(trigger);
		const field = await screen.findByLabelText('Percentage');
		await userEvent.clear(field);
		await userEvent.type(field, '25{Enter}');
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		await expect(trigger).toHaveTextContent('Discount: 25%');

		// Escape discards the draft, and the next opening starts from the saved value.
		await userEvent.click(trigger);
		const reopened = await screen.findByLabelText('Percentage');
		await expect(reopened).toHaveValue(25);
		await userEvent.clear(reopened);
		await userEvent.type(reopened, '50');
		await userEvent.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
		await expect(trigger).toHaveTextContent('Discount: 25%');
	},
};

// Read-only content needs no footer: the header names the popup and the body
// carries the detail.
export const Information: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger
				render={<Button variant="ghost" size="icon" aria-label="About VAT" />}
			>
				<i className="ti ti-info-circle" />
			</PopoverTrigger>
			<PopoverContent side="top">
				<PopoverHeader>
					<PopoverTitle>VAT</PopoverTitle>
					<PopoverDescription>
						Calculated from the delivery address at checkout.
					</PopoverDescription>
				</PopoverHeader>
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
				<PopoverHeader>
					<PopoverTitle>Available coupons</PopoverTitle>
				</PopoverHeader>
				<div style={{ display: 'grid', gap: 2 }}>
					<Button variant="ghost" className="justify-start">
						SPRING10 · 10% off
					</Button>
					<Button variant="ghost" className="justify-start">
						FREESHIP · Free delivery
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	),
};
