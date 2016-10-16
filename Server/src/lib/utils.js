'use strict';

const env = {
  level: 'info',
};
// const utils = exports;

if (process.env.NODE_ENV === 'production') {
  env.level = 'warn';
} else if (process.env.NODE_ENV === 'development') {
  env.level = 'trace';
}

exports.createLogger = (name) => {
  return require('bunyan').createLogger({ name, level: env.level });
};
