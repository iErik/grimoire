import path from 'path';

import devEnv from './dev.env';
import prodEnv from './prod.env';

export default {
  build: {
    env: prodEnv,
    assetsRoot: path.resolve(__dirname, '../app/assets'),
    assetsSubDirectory: '.',
    assetsPublicPath: './assets/',
    cssSourceMap: true
  },

  dev: {
    env: devEnv,
    port: devEnv['PORT'] || 8080,
    assetsRoot: path.resolve(__dirname, '../app/assets'),
    assetsSubDirectory: '.',
    assetsPublicPath: `http://localhost:${devEnv.PORT || 8080}/assets/`,
    cssSourceMap: true
  }
}
