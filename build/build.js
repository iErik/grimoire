import path from 'path';
import ora from 'ora';
import webpack from 'webpack';
import 'shelljs/global';

import config from '../config';
import webpackMainConfig from './webpack.electron.config';
import webpackRendererConfig from './webpack.prod.config';

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = JSON.parse(config.build.env.NODE_ENV);

var spinner = ora('building for production...');
spinner.start();

var assetsPath = config.build.assetsRoot
rm('-rf', assetsPath);
mkdir('-p', assetsPath);

webpack([webpackMainConfig, webpackRendererConfig], function(err, stats) {
  spinner.stop();
  if (err) throw err;

  process.stdout.write(stats.toString({
    colors: true,
    progress: true,
    modules: true,
    children: false,
    chunks: false,
    chunkModule: false,
  }) + '\n');
});
