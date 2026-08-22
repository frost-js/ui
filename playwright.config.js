import { defineConfig } from '@playwright/test';

const browserSpecificPositioningTests = [
    '**/popper/dropdown*.spec.js',
    '**/popper/popover*.spec.js',
    '**/popper/tooltip*.spec.js',
];

export default defineConfig({
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                permissions: [
                    'clipboard-read',
                ],
            },
        },
        {
            name: 'firefox',
            testIgnore: browserSpecificPositioningTests,
            use: { browserName: 'firefox' },
        },
        {
            name: 'webkit',
            testIgnore: browserSpecificPositioningTests,
            use: { browserName: 'webkit' },
        },
    ],
    testDir: './test/specs',
    testMatch: '**/*.spec.js',
    timeout: 30000,
    use: {
        baseURL: 'http://localhost:3001',
        headless: true,
        reducedMotion: 'reduce',
        viewport: {
            height: 600,
            width: 800,
        },
    },
    webServer: {
        command: 'node test/support/server/static-server.js',
        reuseExistingServer: !process.env.CI,
        url: 'http://localhost:3001',
    },
});
