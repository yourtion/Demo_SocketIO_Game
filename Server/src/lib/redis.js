'use strict';

const Redis = require('ioredis');
const redis = new Redis($.config.redis);

module.exports = redis;
