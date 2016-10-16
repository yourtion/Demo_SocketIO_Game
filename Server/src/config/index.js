'use strict';
const path = require('path');
const logger = $.utils.createLogger('Config');
const env = process.env.APP_VERSION || 'default';
const file = path.resolve(__dirname, './' + env);

try {
  module.exports = require(file);
  logger.info('Load config: [%s] %s', env, file);
} catch (err) {
  logger.error('Cannot load config: [%s] %s', env, file);
  throw err;
}
