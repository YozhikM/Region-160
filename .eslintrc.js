module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:flowtype/recommended'],
  plugins: ['import', 'flowtype', 'flowtype-errors', 'prettier', 'unicorn', 'immutable', 'array-func'],
  rules: {
    'camelcase': 0,
    'react/jsx-filename-extension': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-for': 0,
    'react/sort-comp': 0,
    'class-methods-use-this': 0,
    'flowtype-errors/show-errors': 2,
    'flowtype-errors/enforce-min-coverage': [2, 50],
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': 0,
    'unicorn/no-abusive-eslint-disable': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/throw-new-error': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/no-fn-reference-in-iterator': 'error',
    'unicorn/import-index': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/regex-shorthand': 'error',
    'unicorn/prefer-spread': 0,
    "prettier/prettier": [
      "error",
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: "es5",
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
};
