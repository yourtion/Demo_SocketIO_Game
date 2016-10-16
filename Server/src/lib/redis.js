'use strict';

const Redis = require('ioredis');
$.redis = new Redis($.config.redis);
