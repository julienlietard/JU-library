module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:storybook/recommended'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
      'react/prop-types': 'off',
    },
  };