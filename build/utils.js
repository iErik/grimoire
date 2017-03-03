import path from 'path';
import validate, { Joi } from 'webpack-validator';

import config from '../config';

const validatorSchema = Joi.object({
  sassLoader: Joi.any()
});

export function assetsPath(_path) {
  let assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path);
}

export function validateConf(webpackConfig) {
  return validate(webpackConfig, { schemaExtension: validatorSchema });
}
