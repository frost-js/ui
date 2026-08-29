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
                name: 'Frost UI Coverage',
                outputFile: './test-results/coverage/index.html',
                coverage: {
                    name: 'Frost UI Source Coverage',
                    outputDir: './coverage',
                    reports: [
                        'console-summary',
                        'html',
                        'lcovonly',
                    ],
                    entryFilter: (entry) => normalizePath(entry.url).endsWith('/assets/frost-ui-bundle.js'),
                    sourceFilter: (sourcePath) => {
                        const normalizedPath = normalizePath(sourcePath);

                        // The entry module only re-exports symbols. Bundling erases those
                        // statements, so V8 cannot associate runtime ranges with this file.
                        return normalizedPath.startsWith('src/js/') &&
                            normalizedPath !== 'src/js/index.js';
                    },
                    sourceMapResolver: (_url, defaultResolver) => defaultResolver(sourceMapUrl),
                    all: './src/js',
                },
            },
        ],
    ],
});
