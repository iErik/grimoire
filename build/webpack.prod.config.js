import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import validate from 'webpack-validator';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { assetsPath } from './utils';
import config from '../config';
import baseConfig from './webpack.base.config';

export default validate(merge(baseConfig,
{ output:
    { path: config.build.assetsRoot
    , filename: assetsPath('scripts/[name].[chunkhash].js')
    , chunkFilename: assetsPath('scripts/[id].[chunkhash].js')
    }

, devtool: config.build.cssSourceMap ? '#source-map' : false
, target: 'electron-renderer'

, module:
  { loaders:
    [
      { test: /\.scss$/
      , loader: ExtractTextPlugin.extract(
          ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        )
      }
    ]
  }

, plugins:
  [ new webpack.optimize.OccurrenceOrderPlugin()
  , new ExtractTextPlugin(assetsPath('stylesheets/[name].[contenthash].css'),
      { allChunks: true
      })

  , new webpack.DefinePlugin(
      { 'process.env': config.build.env
      })

  , new HtmlWebpackPlugin(
      { filename: '../app.html'
      , template: 'app/app.html'
      , inject: false
      })
  ]
}));
