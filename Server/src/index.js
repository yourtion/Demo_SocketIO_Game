'use strict';

global.$ = {};
$.utils = require('./lib/utils');
$.config = require('./config/index');
$.redis = require('./lib/redis');
$.answer = require('./services/answer');
$.room = require('./services/room');
$.infos = {};

const express = require('express');
const app = $.app = express();
const server = require('http').Server(app);
const logger = $.utils.createLogger('index');
const path = require('path');


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

server.listen(process.env.PORT || 8080, () => {
  logger.warn('Example app listening on port %s!', process.env.PORT || 8080);
});

process.on('uncaughtException', (err) => {
  logger.error(err.stack);
  process.exit(1);
});
