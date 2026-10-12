import { Label, OtpInput } from '@foretag/interface';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

const meta = {
	title: 'Primitives/OtpInput',
	component: OtpInput,
	argTypes: {
		size: { control: 'select', options: ['base', 'small'] },
		length: { control: { type: 'number', min: 1, max: 12 } },
		groupSize: { control: { type: 'number', min: 0, max: 12 } },
		separator: { control: 'text' },
		disabled: { control: 'boolean' },
		mask: { control: 'boolean' },
	},
	args: {
		size: 'base',
		length: 6,
		groupSize: 3,
		separator: '-',
		disabled: false,
		mask: false,
	},
	// OTP slots take their accessible name from the field's <label>, so every
	// story renders one.
	render: (args) => <LabelledOtpInput {...args} />,
} satisfies Meta<typeof OtpInput>;

export default meta;

type Story = StoryObj<typeof meta>;

function LabelledOtpInput({
	label = 'Verification code',
	hint,
	...props
}: React.ComponentProps<typeof OtpInput> & {
	label?: string;
	hint?: React.ReactNode;
}) {
	const id = React.useId();
	return (
		<div style={{ display: 'grid', gap: 8 }}>
			<Label htmlFor={id}>{label}</Label>
			<OtpInput id={id} {...props} />
			{hint && <span style={{ fontSize: 12, opacity: 0.6 }}>{hint}</span>}
		</div>
	);
}

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = React.useState('');
		return (
			<LabelledOtpInput
				{...args}
				value={value}
				onValueChange={setValue}
				hint={`Value: ${value || '—'}`}
			/>
		);
	},
};

// `onValueComplete` fires once every slot is filled, so the code can be
// verified without a submit button.
export const OnComplete: Story = {
	render: (args) => {
		const [verified, setVerified] = React.useState(false);
		return (
			<LabelledOtpInput
				{...args}
				onValueChange={() => setVerified(false)}
				onValueComplete={() => setVerified(true)}
				hint={
					verified ? 'Verified' : `Enter the ${args.length ?? 6}-digit code`
				}
			/>
		);
	},
};

export const Pin: Story = {
	render: (args) => <LabelledOtpInput {...args} label="PIN" />,
	args: { length: 4, groupSize: 4, mask: true },
};

export const CustomGroupSize: Story = {
	args: { length: 8, groupSize: 4 },
};

export const CustomSeparator: Story = {
	args: {
		separator: <i className="ti ti-point" style={{ fontSize: 16 }} />,
	},
};

export const Alphanumeric: Story = {
	args: {
		validationType: 'alphanumeric',
		normalizeValue: (v) => v.toUpperCase(),
	},
};

export const Invalid: Story = {
	args: { defaultValue: '123456', 'aria-invalid': true },
};

export const Disabled: Story = {
	args: { defaultValue: '123', disabled: true },
};

export const Small: Story = {
	args: { size: 'small' },
};
