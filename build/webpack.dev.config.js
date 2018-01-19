import webpack from 'webpack';
import merge from 'webpack-merge';

import FriendlyErrors from 'friendly-errors-webpack-plugin';

import baseConfig from './webpack.base.config';
import config from '../config';

const port = process.env.PORT || config.dev.port;

Object.keys(baseConfig.entry).forEach((name) => {
  baseConfig.entry[name] =
    [ `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`
    ].concat(baseConfig.entry[name]);
});

export default merge.smart(baseConfig,
{ output:
    { path: config.dev.assetsRoot
    , publicPath: config.dev.assetsPublicPath
    , filename: 'app.js'
    }

, module:
  { rules:
    [{ test: /\.(scss|css)$/
     , use:
       [ { loader: 'postcss-loader'
         , options:
           { sourceMap: config.dev.cssSourceMap
           , sourceMapContents: false
           }
         }
       , { loader: 'sass-loader'
         , options: { sourceMap: config.dev.cssSourceMap }
         }
       ]
    }]
  }

, devtool: '#eval-source-map'
, target: 'electron-renderer'
, plugins:
    [ new webpack.HotModuleReplacementPlugin()
    , new webpack.NoEmitOnErrorsPlugin()
    , new webpack.LoaderOptionsPlugin({ debug: true })
    , new webpack.DefinePlugin({ 'process.env': config.dev.env })
    , new FriendlyErrors()
    ]
});
