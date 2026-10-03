import frostConfig, { browserConfig, nodeConfig } from '@fr0st/eslint-config';

export default [
    {
        ignores: [
            '.tmp/**',
            'dist/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    frostConfig,
    browserConfig,
    {
        files: [
            'src/**/*.js',
        ],
        rules: {
            '@stylistic/indent': [
                'error',
                4,
                {
                    ignoredNodes: ['LogicalExpression > *'],
                    MemberExpression: 'off',
                    SwitchCase: 1,
                },
            ],
            '@stylistic/new-parens': 'error',
            '@stylistic/no-extra-semi': 'error',
            '@stylistic/space-infix-ops': 'error',
            'eqeqeq': 'error',
            'object-shorthand': 'error',
        },
    },
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
