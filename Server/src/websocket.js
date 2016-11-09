'use strict';

const logger = $.utils.createLogger('service:socket');
const url = require('url');

module.exports = function (server) {
  const WebSocketServer = require('ws').Server;
  const wss = new WebSocketServer({ server });
 
  wss.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true);
    logger.trace(location);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  
    ws.on('message', function incoming(message) {
      logger.trace('received: %s', message);
    });
  
    ws.send('something');
  });
};
