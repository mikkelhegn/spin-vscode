// @ts-check

const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
    {
        ignores: ['out', 'dist', '**/*.d.ts'],
    },
    tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 6,
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/naming-convention': ['warn', {
                selector: 'enumMember',
                format: ['PascalCase'],
            }],
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '_.*',
                caughtErrorsIgnorePattern: '_.*',
            }],
            'curly': 'warn',
            'eqeqeq': 'error',
            'no-empty-function': 'off',
            'no-throw-literal': 'warn',
        },
    },
);
