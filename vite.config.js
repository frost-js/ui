import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
    const external = [];
    const output = [];

    switch (mode) {
        case 'bundle':
            output.push(
                {
                    entryFileNames: 'frost-ui-bundle.js',
                    format: 'umd',
                    minify: false,
                    name: 'UI',
                },
                {
                    entryFileNames: 'frost-ui-bundle.min.js',
                    format: 'umd',
                    minify: true,
                    name: 'UI',
                },
            );
            break;
        case 'umd':
            external.push('@fr0st/query');
            output.push(
                {
                    entryFileNames: 'frost-ui.js',
                    format: 'umd',
                    globals: {
                        '@fr0st/query': 'fQuery',
                    },
                    minify: false,
                    name: 'UI',
                },
                {
                    entryFileNames: 'frost-ui.min.js',
                    format: 'umd',
                    globals: {
                        '@fr0st/query': 'fQuery',
                    },
                    minify: true,
                    name: 'UI',
                },
            );
            break;
        default:
            external.push('@fr0st/query');
            output.push(
                {
                    entryFileNames: 'frost-ui.esm.js',
                    format: 'es',
                    minify: false,
                },
                {
                    entryFileNames: 'frost-ui.esm.min.js',
                    format: 'es',
                    minify: true,
                },
            );
    }

    return {
        build: {
            emptyOutDir: false,
            lib: {
                entry: 'src/js/index.js',
                name: 'UI',
            },
            minify: false,
            outDir: 'dist',
            rolldownOptions: {
                external,
                output,
            },
            sourcemap: true,
            target: 'baseline-widely-available',
        },
    };
});
