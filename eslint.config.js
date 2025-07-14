// eslint.config.js
import js from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import globals from 'globals';

export default [
  js.configs.recommended, // Reglas recomendadas de ESLint base
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: eslintPluginN,
    },
    rules: {
      semi: ['error', 'always'],            // Requiere punto y coma
      quotes: ['error', 'single'],          // Comillas simples
      indent: ['error', 2],                 // Tabs de 2 espacios
      'no-trailing-spaces': 'error',        // Espacios innecesarios al final
      'eol-last': ['error', 'always'],      // Línea vacía al final de archivos

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignora args como `_req`, `_res`
      'no-console': 'off',
      eqeqeq: ['error', 'always'],          // Usar siempre === y !==
      'prefer-const': 'error',              // Preferir const cuando sea posible

      'n/no-deprecated-api': 'warn',        // Evita APIs Node.js obsoletas
      'n/handle-callback-err': 'error',     // Manejo de errores en callbacks
    },
  },
  {
    files: ['**/*.test.js', '**/tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
