import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	Input,
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverForm,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Sidebar,
	SidebarContent,
	SidebarProvider,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '../index';

describe('Interface UI primitives', () => {
	// Vitest runs without `globals`, so Testing Library cannot register its own
	// cleanup; without this, portals and roots from one test leak into the next.
	afterEach(cleanup);

	test('renders button', () => {
		render(<Button>Launch</Button>);
		expect(screen.getByRole('button', { name: 'Launch' })).toBeInTheDocument();
	});

	test('renders input', () => {
		render(<Input aria-label="Search" placeholder="Search components" />);
		expect(
			screen.getByPlaceholderText('Search components'),
		).toBeInTheDocument();
	});

	test('renders select structure', () => {
		render(
			<Select>
				<SelectTrigger aria-label="Theme">
					<SelectValue placeholder="Choose theme" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="marble">Marble</SelectItem>
					<SelectItem value="graphene">Graphene</SelectItem>
				</SelectContent>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	test('select value shows the placeholder, then the label from `items`', () => {
		const { rerender } = render(
			<Select items={{ marble: 'Marble', graphene: 'Graphene' }} value={null}>
				<SelectTrigger aria-label="Theme">
					<SelectValue placeholder="Choose theme" />
				</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Choose theme');

		rerender(
			<Select
				items={{ marble: 'Marble', graphene: 'Graphene' }}
				value="graphene"
			>
				<SelectTrigger aria-label="Theme">
					<SelectValue placeholder="Choose theme" />
				</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Graphene');
	});

	test('select value resolves labels from grouped `items`', () => {
		render(
			<Select
				items={[
					{ label: 'Light', items: [{ value: 'euclid', label: 'Euclid' }] },
				]}
				defaultValue="euclid"
			>
				<SelectTrigger aria-label="Theme">
					<SelectValue placeholder="Choose theme" />
				</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Euclid');
	});

	test('select value keeps the placeholder over custom children while empty', () => {
		render(
			<Select>
				<SelectTrigger aria-label="Theme">
					<SelectValue placeholder="Choose theme">
						{(value: string) => `Theme: ${value}`}
					</SelectValue>
				</SelectTrigger>
			</Select>,
		);
		expect(screen.getByRole('combobox')).toHaveTextContent('Choose theme');
	});

	test('select items keep icon and detail out of the selected label', async () => {
		const user = userEvent.setup();
		render(
			<Select items={{ fr: 'France', jp: 'Japan' }} defaultValue="fr">
				<SelectTrigger aria-label="Country">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="fr" icon="🇫🇷" detail="EUR">
						France
					</SelectItem>
					<SelectItem value="jp" icon="🇯🇵" detail="JPY">
						Japan
					</SelectItem>
				</SelectContent>
			</Select>,
		);

		await user.click(screen.getByRole('combobox', { name: 'Country' }));
		const japan = await screen.findByRole('option', { name: /Japan/ });
		expect(japan).toHaveTextContent('JPY');
		await user.click(japan);

		await waitFor(() => {
			expect(screen.getByRole('combobox')).toHaveTextContent(/^Japan$/);
		});
	});

	test('renders dialog structure', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogTitle>Confirm</DialogTitle>
					<DialogDescription>Do you want to proceed?</DialogDescription>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.getByText('Confirm')).toBeInTheDocument();
	});

	test('renders tabs', () => {
		render(
			<Tabs defaultValue="a">
				<TabsList>
					<TabsTrigger value="a">A</TabsTrigger>
					<TabsTrigger value="b">B</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Panel A</TabsContent>
				<TabsContent value="b">Panel B</TabsContent>
			</Tabs>,
		);
		expect(screen.getByRole('tab', { name: 'A' })).toBeInTheDocument();
		expect(screen.getByText('Panel A')).toBeInTheDocument();
	});

	test('tabs switch panels on click and arrow keys', async () => {
		const user = userEvent.setup();
		render(
			<Tabs defaultValue="a">
				<TabsList>
					<TabsTrigger value="a">A</TabsTrigger>
					<TabsTrigger value="b">B</TabsTrigger>
				</TabsList>
				<TabsContent value="a">Panel A</TabsContent>
				<TabsContent value="b">Panel B</TabsContent>
			</Tabs>,
		);

		await user.click(screen.getByRole('tab', { name: 'B' }));
		expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute(
			'aria-selected',
			'true',
		);
		expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel B');

		await user.keyboard('{ArrowLeft}');
		expect(screen.getByRole('tab', { name: 'A' })).toHaveFocus();
	});

	test('renders sidebar', () => {
		render(
			<SidebarProvider>
				<Sidebar>
					<SidebarContent>Navigation</SidebarContent>
				</Sidebar>
			</SidebarProvider>,
		);
		expect(screen.getByText('Navigation')).toBeInTheDocument();
	});

	describe('popover form', () => {
		function EditName({ validate }: { validate: (name: string) => boolean }) {
			const [name, setName] = React.useState('Ada');
			return (
				<Popover>
					<PopoverTrigger>Name: {name}</PopoverTrigger>
					<PopoverContent>
						<PopoverForm
							onSubmit={(event) => {
								const next = String(
									new FormData(event.currentTarget).get('name'),
								);
								if (!validate(next)) {
									event.preventDefault();
									return;
								}
								setName(next);
							}}
						>
							<Input aria-label="Name" name="name" defaultValue={name} />
						</PopoverForm>
					</PopoverContent>
				</Popover>
			);
		}

		test('submitting saves and closes the popover', async () => {
			const user = userEvent.setup();
			render(<EditName validate={() => true} />);

			await user.click(screen.getByRole('button', { name: 'Name: Ada' }));
			const field = await screen.findByRole('textbox', { name: 'Name' });
			await user.clear(field);
			await user.type(field, 'Grace{Enter}');

			await waitFor(() => {
				expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull();
			});
			expect(screen.getByRole('button', { name: 'Name: Grace' })).toBeVisible();
		});

		test('preventing default keeps the popover open with the draft', async () => {
			const user = userEvent.setup();
			render(<EditName validate={(name) => name.length > 0} />);

			await user.click(screen.getByRole('button', { name: 'Name: Ada' }));
			const field = await screen.findByRole('textbox', { name: 'Name' });
			await user.clear(field);
			await user.keyboard('{Enter}');

			expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
			expect(screen.getByRole('button', { name: 'Name: Ada' })).toBeVisible();
		});
	});

	describe('popover anchor', () => {
		function rect(x: number, y: number, width: number, height: number) {
			return DOMRect.fromRect({ x, y, width, height });
		}

		test('renders a div that takes its props and ref', () => {
			let anchorElement: HTMLElement | null = null;
			render(
				<Popover>
					<PopoverAnchor
						ref={(element) => {
							anchorElement = element;
						}}
						data-testid="anchor"
						className="field"
					>
						<PopoverTrigger>Open</PopoverTrigger>
					</PopoverAnchor>
				</Popover>,
			);

			const anchor = screen.getByTestId('anchor');
			expect(anchor.tagName).toBe('DIV');
			expect(anchor).toHaveClass('field');
			expect(anchorElement).toBe(anchor);
		});

		test('composes with an existing element through `render`', () => {
			const spanRef = React.createRef<HTMLSpanElement>();
			render(
				<Popover>
					<PopoverAnchor render={<span ref={spanRef} />} data-testid="anchor">
						<Input aria-label="Due date" />
					</PopoverAnchor>
				</Popover>,
			);

			const anchor = screen.getByTestId('anchor');
			expect(anchor.tagName).toBe('SPAN');
			// The rendered element keeps its own ref alongside the anchor's.
			expect(spanRef.current).toBe(anchor);
		});

		test('positions the popup against the anchor rather than the trigger', async () => {
			render(
				<Popover defaultOpen>
					<PopoverAnchor
						ref={(element) => {
							if (element) {
								element.getBoundingClientRect = () => rect(300, 400, 200, 40);
							}
						}}
					>
						<PopoverTrigger
							ref={(element: HTMLButtonElement | null) => {
								if (element) {
									element.getBoundingClientRect = () => rect(470, 410, 20, 20);
								}
							}}
						>
							Open
						</PopoverTrigger>
					</PopoverAnchor>
					<PopoverContent>Calendar</PopoverContent>
				</Popover>,
			);

			// Base UI publishes the anchor's size on the positioner, so it reports
			// the 200x40 anchor, not the 20x20 trigger it would default to.
			const positioner = (await screen.findByText('Calendar')).parentElement;
			await waitFor(() => {
				expect(positioner?.style.getPropertyValue('--anchor-width')).toBe(
					'200px',
				);
			});
			expect(positioner?.style.getPropertyValue('--anchor-height')).toBe(
				'40px',
			);
		});

		test('an explicit `anchor` on the content wins over PopoverAnchor', async () => {
			const explicit = document.createElement('div');
			explicit.getBoundingClientRect = () => rect(0, 0, 120, 24);
			document.body.append(explicit);

			render(
				<Popover defaultOpen>
					<PopoverAnchor
						ref={(element) => {
							if (element) {
								element.getBoundingClientRect = () => rect(300, 400, 200, 40);
							}
						}}
					>
						<PopoverTrigger>Open</PopoverTrigger>
					</PopoverAnchor>
					<PopoverContent anchor={explicit}>Calendar</PopoverContent>
				</Popover>,
			);

			const positioner = (await screen.findByText('Calendar')).parentElement;
			await waitFor(() => {
				expect(positioner?.style.getPropertyValue('--anchor-width')).toBe(
					'120px',
				);
			});
			explicit.remove();
		});
	});
});
