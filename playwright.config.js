import { defineConfig } from '@playwright/test';

const baseURL = `http://localhost:${process.env.PORT ?? 3001}`;

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
            use: { browserName: 'firefox' },
        },
        {
            name: 'webkit',
            use: { browserName: 'webkit' },
        },
    ],
    testDir: './test/browser',
    testMatch: '**/*.test.js',
    timeout: 30000,
    use: {
        baseURL,
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
        url: baseURL,
    },
});
