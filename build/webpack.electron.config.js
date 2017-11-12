import webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.base.config';
import config from '../config';

export default merge(baseConfig,
{ entry: ['./app/main.dev']
, output:
  { path: __dirname
  , filename: '../app/main.js'
  }

, target: 'electron-main'
, node:
  { __dirname: false
  , __filename: false
  }

, plugins:
  [ new webpack.DefinePlugin(
    { 'process.env': config.build.env
    })
  ]
});
