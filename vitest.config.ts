import { defineConfig } from 'vitest/config';

// Storybook's test addon reads this file to discover the suites it can run.
export default defineConfig({
	test: {
		projects: [
			'packages/interface/vitest.config.ts',
			'storybook/vitest.config.ts',
		],
	},
});
