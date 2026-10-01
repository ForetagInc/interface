import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig } from 'vitest/config';

const here = dirname(fileURLToPath(import.meta.url));

// Renders every story in headless Chrome and fails on render errors, failed
// play functions and axe violations. WebdriverIO resolves a chromedriver for the
// installed Chrome, so CI needs no separate browser download step.
export default defineConfig({
	plugins: [storybookTest({ configDir: join(here, '.storybook') })],
	test: {
		name: 'storybook',
		browser: {
			enabled: true,
			headless: true,
			provider: 'webdriverio',
			instances: [{ browser: 'chrome' }],
		},
	},
});
