// Only the rules named here are on, every one an error. No
// shareable preset is extended, so a rule is only enabled by
// listing it.
export default {
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-scss', '@stylistic/stylelint-plugin'],
  reportDescriptionlessDisables: true,
  reportUnscopedDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  ignoreFiles: [
    '**/node_modules/**',
    'app/assets/**',
    'release/**',
    // Vendored: foundation's settings file.
    'app/styles/vendors/**'
  ],
  rules: {
    // Formatting
    '@stylistic/indentation': 2,
    '@stylistic/string-quotes': ['single', { avoidEscape: true }],
    '@stylistic/declaration-block-trailing-semicolon': 'always',
    // url() arguments aren't counted.
    '@stylistic/max-line-length': 70,

    // Correctness
    'block-no-empty': true,
    'declaration-block-no-duplicate-properties': true,
    'property-no-unknown': true,
    'unit-no-unknown': true,
    'color-no-invalid-hex': true,
    'scss/at-rule-no-unknown': true
  }
}
