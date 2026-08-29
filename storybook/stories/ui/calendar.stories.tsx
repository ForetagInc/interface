import { Calendar } from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta: Meta = {
	title: 'Primitives/Calendar',
};

export default meta;

type Story = StoryObj;

export const SingleDate: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date(2026, 7, 15));

		return <Calendar mode="single" selected={date} onSelect={setDate} />;
	},
};

// `embedded` is the fluid variant — it fills its container, so an unconstrained
// canvas tells you nothing. This is the width it is actually meant for.
export const Embedded: Story = {
	render: () => {
		const [date, setDate] = useState<Date | undefined>(new Date(2026, 7, 15));

		return (
			<div
				style={{ width: 280 }}
				className="rounded-md border border-border p-3"
			>
				<Calendar
					variant="embedded"
					mode="single"
					selected={date}
					onSelect={setDate}
				/>
			</div>
		);
	},
};

// Today, selected, today-and-selected, outside and disabled all at once — the
// states that used to need `!important` to resolve against each other.
export const States: Story = {
	render: () => {
		const today = new Date();
		const [date, setDate] = useState<Date | undefined>(today);

		return (
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				defaultMonth={today}
				disabled={{ dayOfWeek: [0, 6] }}
			/>
		);
	},
};
