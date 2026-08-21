import frostConfig, { browserConfig, nodeConfig } from '@fr0st/eslint-config';

export default [
    {
        ignores: [
            'dist/**',
            'screens/**',
        ],
    },
    frostConfig,
    browserConfig,
    {
        ...nodeConfig,
        files: [
            '*.config.js',
            'server/**/*.js',
            'test/**/*.js',
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
                Animation: 'readonly',
                UI: 'readonly',
            },
        },
    },
];
