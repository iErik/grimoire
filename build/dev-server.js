import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { spawn } from 'child_process';

import config from '../config';
import webpackConfig from './webpack.dev.config';

if (!process.env.NODE_ENV)
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);

const app = express();
const compiler = webpack(webpackConfig);
const PORT = process.env.PORT = config.dev.port || 8080;
const URI = `http://localhost:${PORT}`;

const hotMiddleware = webpackHotMiddleware(compiler, {
  log: () => {}
});

const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  logLevel: 'silent'
});

devMiddleware.waitUntilValid(function() {
  console.log(`> Serving application assets at http://localhost:${PORT}/\n`);
});

app.use(devMiddleware);
app.use(hotMiddleware);

const server = app.listen(PORT, serverError => {
  if (serverError)
    return console.error(serverError);

  spawn('npm', ['run', 'start-dev'], { shell: true, env: process.env, stdio: 'inherit' })
    .on('close', code => process.exit(code))
    .on('error', spawnError => console.error(spawnError));
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  devMiddleware.close();
  server.close(() => {
    process.exit(0);
  });
});
