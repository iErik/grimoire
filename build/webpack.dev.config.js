import webpack from 'webpack';
import merge from 'webpack-merge';

import { validateConf as validate } from './utils';
import baseConfig from './webpack.base.config';
import config from '../config';

const port = process.env.PORT || config.dev.port;

Object.keys(baseConfig.entry).forEach((name) => {
  baseConfig.entry[name] =
    [ `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`
    ].concat(baseConfig.entry[name]);
});

export default validate(merge(baseConfig,
{ output:
    { publicPath: config.dev.assetsPublicPath
    , filename: 'app.js'
    }

, sassLoader: { sourceMap: config.dev.cssSourceMap }
, debug: true
, devtool: '#eval-source-map'
, target: 'electron-renderer'
, plugins:
    [ new webpack.HotModuleReplacementPlugin()
    , new webpack.NoErrorsPlugin()
    , new webpack.DefinePlugin({
        'process.env': config.dev.env,
      })
    ]
}));
