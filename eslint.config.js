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
        name: '@fr0st/ui/test-globals',
        files: [
            'test/**/*.js',
        ],
        languageOptions: {
            globals: {
                $: 'readonly',
                after: 'readonly',
                afterEach: 'readonly',
                Animation: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                UI: 'readonly',
            },
        },
    },
];
