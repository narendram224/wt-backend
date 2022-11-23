module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        browser: true,
    },
    extends: 'eslint:recommended',
    globals: {},
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },

    rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'no-multi-spaces': ['error'],
        'no-console': 0,
        'no-underscore-dangle': 0,
        'no-return-await': 0,
    },
};
