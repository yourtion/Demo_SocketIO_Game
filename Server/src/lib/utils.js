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

exports.createLogger = function (name) {
  return require('bunyan').createLogger({ name, level: env.level });
};

exports.getRedisKey = function (name) {
  return 'room#' + name;
};

exports.apiSucceed = function (ret) {
  const result = {
    data: ret,
    errCode: 0,
  };
  return JSON.stringify(result);
};

exports.apiFail = function (err) {
  const result = {
    errCode: err.code || -1,
    errMsg: err.message || '',
  };
  return JSON.stringify(result);
};
