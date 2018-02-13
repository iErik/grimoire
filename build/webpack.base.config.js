import path from 'path';
import autoprefixer from 'autoprefixer';
import jsonImporter from 'node-sass-json-importer';

import { assetsPath } from './utils';
import { dependencies as externals } from '../app/package.json';
import config from '../config';

var projectRoot = path.resolve(__dirname, '../');

export default {
  entry: { app: ['./app/app.js'] }
, output:
  { path: config.build.assetsRoot
  , publicPath: process.env.NODE_ENV === 'production'
    ? config.build.assetsPublicPath
    : config.dev.assetsPublicPath
  , filename: '[name].js'
  , libraryTarget: 'commonjs2'
  }

, resolve:
  { extensions: ['.js', '.jsx', '.json', '.scss', '.css']
  , alias:
    { 'app': path.resolve(__dirname, '../app')
    , 'containers': path.resolve(__dirname, '../app/containers')
    , 'components': path.resolve(__dirname, '../app/components')
    , 'layouts': path.resolve(__dirname, '../app/layouts')
    , 'pages': path.resolve(__dirname, '../app/pages')

    , 'collections': path.resolve(__dirname, '../app/database/collections')
    , 'database': path.resolve(__dirname, '../app/database')
    , 'seeds': path.resolve(__dirname, '../app/database/seeds')
    , 'storage': path.resolve(__dirname, '../app/storage')

    , 'store': path.resolve(__dirname, '../app/store')
    , 'reducers': path.resolve(__dirname, '../app/reducers')
    , 'actions': path.resolve(__dirname, '../app/actions')
    , 'sagas': path.resolve(__dirname, '../app/sagas')

    , 'styles': path.resolve(__dirname, '../app/styles')
    , 'config': path.resolve(__dirname, '../app/config')
    , 'utils': path.resolve(__dirname, '../app/utils')
    }
  }
//, externals: Object.keys(externals || {})

, module:
  { rules:
    [
      { test: /\.jsx?$/
      , loader: 'babel-loader'
      , include: [ path.join(projectRoot, 'app') ]
      , exclude: /node_modules/
      }
      ,
      { test: /\.(scss|css)$/
      , use:
        [ { loader: 'style-loader' }
        , { loader: 'css-loader' }
        , { loader: 'postcss-loader'
          , options: { plugins: [autoprefixer({ browsers: ['electron 1.7'] })] }
          }
        , { loader: 'sass-loader'
          , options: { importer: jsonImporter }
          }
        ]
      }
      ,
      { test: /\.(ico|webp|png|jpe?g|gif|svg)(\?.*)?$/
      , loader: 'url-loader'
      , options:
        { limit: 10000
        , name: assetsPath('images/[name].[hash:7].[ext]')
        }
      }
      ,
      { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/
      , loader: 'url-loader'
      , options:
        { limit: 800000
        , name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
