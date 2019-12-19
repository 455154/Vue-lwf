module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi':0,'quotes':0,'no-unused-vars':0,'object-curly-spacing':0,'key-spacing':0,
    'no-trailing-spaces':0,'comma-spacing':0,'padded-blocks':0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
