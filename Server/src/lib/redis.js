'use strict';

const Redis = require('ioredis');
$.redis = new Redis($.config.redis);

Redis.Command.setReplyTransformer('hgetall', function (result) {
  if (Array.isArray(result)) {
    const obj = {};
    for (let i = 0; i < result.length; i += 2) {
      obj[result[i]] = result[i + 1];
    }
    return obj;
  }
  return result;
});
