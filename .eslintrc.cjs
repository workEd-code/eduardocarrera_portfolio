module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',        // importante para React 17+
    'plugin:react-hooks/recommended',
    'prettier',                        // apaga reglas que chocan con Prettier
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',   // detecta automáticamente la versión de React
    },
  },
  rules: {
    // Aquí ponemos reglas estrictas (puedes ir aflojando después si quieres)
    'no-unused-vars': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/no-unescaped-entities': 'error',
    'react/prop-types': 'off',              // si no usas PropTypes
    'react/self-closing-comp': 'error',
    'react/jsx-fragments': ['error', 'syntax'],
    'no-console': 'off',   // ← permite console.log sin molestar
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/set-state-in-effect': 'off',   // ← AGREGA ESTA LÍNEA
    eqeqeq: 'error',
    curly: 'error',
  },
};