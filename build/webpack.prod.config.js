import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import autoprefixer from 'autoprefixer';
import jsonImporter from 'node-sass-json-importer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { assetsPath } from './utils';
import config from '../config';
import baseConfig from './webpack.base.config';

export default merge(baseConfig,
{ output:
    { path: config.build.assetsRoot
    , filename: assetsPath('scripts/[name].[chunkhash].js')
    , chunkFilename: assetsPath('scripts/[id].[chunkhash].js')
    , publicPath: config.build.assetsPublicPath
    , libraryTarget: 'commonjs2'
    }

, devtool: config.build.cssSourceMap ? '#source-map' : false
, target: 'electron-renderer'

, module:
  { rules:
    [{ test: /\.(scss|css)$/
     , loader: ExtractTextPlugin.extract({
         fallback: "style-loader",
         use:
         [ { loader: 'css-loader'
           , options: { sourceMap: config.build.cssSourceMap }
           }
         , { loader: 'postcss-loader'
           , options:
             { plugins: [autoprefixer({ browsers: ['electron 1.4'] })]
             , sourceMap: config.build.cssSourceMap
             }
           }
         , { loader: 'resolve-url-loader' }
         , { loader: 'sass-loader'
           , options:
             { importer: jsonImporter
             , sourceMap: config.build.cssSourceMap
             }
           }
         ]
       })
    }]
  }

, plugins:
  [ new ExtractTextPlugin(
      { filename: assetsPath('stylesheets/styles.css')
      , allChunks: true
      })

  , new webpack.DefinePlugin(
      { 'process.env': config.build.env
      })

  , new HtmlWebpackPlugin(
      { filename: '../app.html'
      , template: 'app/app.dev.html'
      , inject: true
      })
  ]

, node:
  { __dirname: false
  , __filename: false
  }
});
