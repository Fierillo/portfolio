import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  { files: ['src/**/*.js'], languageOptions: { globals: globals.browser } },
  { files: ['*.config.js', '*.config.mjs', 'scripts/**/*.js'], languageOptions: { globals: globals.node } },
];
