import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '../utils';

// Sizing is driven entirely by the --cal-* custom properties set on the root,
// mirroring the --button-* -> --btn-* indirection. The weekday header row and
// the day rows deliberately share one `grid-cols` track and one gap: they are
// separate <tr>s, so anything else leaves the labels misaligned with their
// columns.
const calendarVariants = tv({
	slots: {
		root: 'relative',
		months: 'relative flex flex-col',
		month: 'w-full',
		month_caption:
			'relative flex h-[var(--cal-caption)] w-full items-center justify-center px-[calc(var(--cal-nav)+0.5rem)]',
		caption_label: 'font-medium',
		nav: 'pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[var(--cal-caption)] items-center justify-between',
		nav_button:
			'pointer-events-auto inline-flex size-[var(--cal-nav)] items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40',
		month_grid: 'w-full',
		weekdays: 'grid gap-[var(--cal-gap)]',
		weekday:
			'flex h-[var(--cal-cell)] w-full items-center justify-center font-normal text-muted-foreground',
		weeks: 'grid gap-[var(--cal-gap)]',
		week: 'grid gap-[var(--cal-gap)]',
		day: 'group h-[var(--cal-cell)] w-full p-0 text-center',
		day_button: [
			'inline-flex h-[var(--cal-cell)] w-full items-center justify-center rounded-md px-0 font-normal transition-colors',
			// Every state below is scoped so that no two can match the same cell.
			// react-day-picker puts the state on the <td>, so reading it through
			// `group-*` lands these at a higher specificity than the base hover —
			// which is what lets the selected day win without `!important`.
			'group-[&:not([data-selected])]:hover:bg-accent group-[&:not([data-selected])]:hover:text-accent-foreground',
			'group-[&[data-today]:not([data-selected])]:bg-accent group-[&[data-today]:not([data-selected])]:text-accent-foreground',
			'group-[&[data-outside]:not([data-selected])]:text-muted-foreground',
			'group-data-[selected]:bg-primary group-data-[selected]:text-primary-foreground',
			'group-data-[selected]:hover:bg-primary group-data-[selected]:hover:text-primary-foreground',
			'group-data-[disabled]:opacity-50',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		],
		chevron: 'text-[length:var(--cal-chevron)]',
	},
	variants: {
		variant: {
			default: {
				root: 'w-fit rounded-md border border-border bg-background p-[var(--cal-pad)] [--cal-caption:var(--calendar-caption-height)] [--cal-cell:var(--calendar-cell-size)] [--cal-chevron:var(--calendar-chevron-size)] [--cal-gap:var(--calendar-gap)] [--cal-nav:var(--calendar-nav-size)] [--cal-pad:var(--calendar-padding)]',
				months: 'gap-4 sm:flex-row',
				month: 'space-y-4',
				caption_label: 'text-sm',
				month_grid: 'mt-3',
				weekdays: 'grid-cols-[repeat(7,var(--cal-cell))]',
				week: 'grid-cols-[repeat(7,var(--cal-cell))]',
				weekday: 'text-xs',
				day_button: 'text-sm',
			},
			embedded: {
				root: 'w-full rounded-none border-0 bg-transparent p-[var(--cal-pad)] [--cal-caption:var(--calendar-caption-height-compact)] [--cal-cell:var(--calendar-cell-size-compact)] [--cal-chevron:var(--calendar-chevron-size-compact)] [--cal-gap:var(--calendar-gap-compact)] [--cal-nav:var(--calendar-nav-size-compact)] [--cal-pad:var(--calendar-padding-compact)]',
				months: 'gap-2',
				month: 'space-y-2',
				caption_label: 'text-xs',
				month_grid: 'mt-1.5',
				weekdays: 'grid-cols-[repeat(7,minmax(0,1fr))]',
				week: 'grid-cols-[repeat(7,minmax(0,1fr))]',
				weekday: 'text-[10px]',
				day_button: 'text-xs',
			},
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type CalendarProps = React.ComponentProps<typeof DayPicker> &
	VariantProps<typeof calendarVariants>;

function Calendar({
	className,
	classNames,
	variant,
	showOutsideDays = true,
	// Months span four to six week rows, so without this the calendar changes
	// height as you page through them — and anything anchored to it (the
	// DatePicker popover) jumps with it. Six rows always, padded from the
	// neighbouring months.
	fixedWeeks = true,
	...props
}: CalendarProps) {
	const defaultClassNames = getDefaultClassNames();
	const s = calendarVariants({ variant });

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			fixedWeeks={fixedWeeks}
			// react-day-picker joins `classNames.root` and `className` verbatim, so
			// root styling lives here to keep a caller's `className` overridable.
			className={cn(defaultClassNames.root, s.root(), className)}
			classNames={{
				months: cn(defaultClassNames.months, s.months()),
				month: cn(defaultClassNames.month, s.month()),
				month_caption: cn(defaultClassNames.month_caption, s.month_caption()),
				caption_label: cn(defaultClassNames.caption_label, s.caption_label()),
				nav: cn(defaultClassNames.nav, s.nav()),
				button_previous: cn(defaultClassNames.button_previous, s.nav_button()),
				button_next: cn(defaultClassNames.button_next, s.nav_button()),
				month_grid: cn(defaultClassNames.month_grid, s.month_grid()),
				weekdays: cn(defaultClassNames.weekdays, s.weekdays()),
				weekday: cn(defaultClassNames.weekday, s.weekday()),
				weeks: cn(defaultClassNames.weeks, s.weeks()),
				week: cn(defaultClassNames.week, s.week()),
				day: cn(defaultClassNames.day, s.day()),
				day_button: cn(defaultClassNames.day_button, s.day_button()),
				// Range days are also `selected`, so the fill comes from the data
				// attribute above; only the rounding differs across the span.
				range_start: cn(
					defaultClassNames.range_start,
					'[&_button]:rounded-r-none [&_button]:rounded-l-md',
				),
				range_middle: cn(
					defaultClassNames.range_middle,
					'[&_button]:rounded-none',
				),
				range_end: cn(
					defaultClassNames.range_end,
					'[&_button]:rounded-l-none [&_button]:rounded-r-md',
				),
				hidden: cn(defaultClassNames.hidden, 'invisible'),
				...classNames,
			}}
			components={{
				Chevron: ({
					orientation,
					className: chevronClassName,
					...chevronProps
				}) => (
					<i
						className={cn(
							'ti',
							orientation === 'left' ? 'ti-chevron-left' : 'ti-chevron-right',
							s.chevron(),
							chevronClassName,
						)}
						{...chevronProps}
					/>
				),
			}}
			{...props}
		/>
	);
}

export { Calendar, calendarVariants };
