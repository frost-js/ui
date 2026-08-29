import process from 'node:process';
import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config.js';

process.env.FROST_UI_COVERAGE = 'true';

const normalizePath = (filePath) => filePath.replaceAll('\\', '/');
const sourceMapUrl = new URL('./dist/frost-ui-bundle.js.map', import.meta.url).href;

export default defineConfig({
    ...baseConfig,
    projects: [
        {
            name: 'coverage',
            use: {
                browserName: 'chromium',
                permissions: [
                    'clipboard-read',
                ],
            },
        },
    ],
    reporter: [
        ['line'],
        [
            'monocart-reporter',
            {
                name: 'FrostUI Coverage',
                outputFile: './test-results/coverage/index.html',
                coverage: {
                    name: 'FrostUI Source Coverage',
                    outputDir: './coverage',
                    reports: [
                        'console-summary',
                        'html',
                        'lcovonly',
                    ],
                    entryFilter: (entry) => normalizePath(entry.url).endsWith('/assets/frost-ui-bundle.js'),
                    sourceFilter: (sourcePath) => normalizePath(sourcePath).startsWith('src/js/'),
                    sourceMapResolver: (_url, defaultResolver) => defaultResolver(sourceMapUrl),
                    all: './src/js',
                },
            },
        ],
    ],
});
