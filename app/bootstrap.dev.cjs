// Electron's Node loads an entry file containing `import` syntax as native
// ESM, bypassing babel-register. A .cjs entry is always CommonJS, so the
// require() below goes through babel-register's hook.
require('babel-register')
require('babel-polyfill')
require('./main.dev')
