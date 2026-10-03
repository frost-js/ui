import frostConfig, { browserConfig, nodeConfig } from '@fr0st/eslint-config';

export default [
    {
        ignores: [
            '.tmp/**',
            'coverage/**',
            'dist/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    frostConfig,
    browserConfig,
    {
        ...nodeConfig,
        files: [
            '*.config.js',
            'test/support/server/**/*.js',
        ],
    },
    {
        name: '@fr0st/ui/browser-globals',
        files: [
            'test/**/*.js',
        ],
        languageOptions: {
            globals: {
                $: 'readonly',
                UI: 'readonly',
            },
        },
    },
];
