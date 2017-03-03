import path from 'path';
import ora from 'ora';
import webpack from 'webpack';
import 'shelljs/global';

import config from '../config';
import webpackMainConfig from './webpack.electron.config';
import webpackRendererConfig from './webpack.prod.config';

env.NODE_ENV = 'production';

var spinner = ora('building for production...');
spinner.start();

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
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
