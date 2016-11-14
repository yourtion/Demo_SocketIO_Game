'use strict';

const coroutine = require('lei-coroutine');
const logger = $.utils.createLogger('service:socket');
const url = require('url');

const roomAction = coroutine.wrap(function* (no, sid){
  const data = { no, sid };
  const result = yield $.room.createRoom(data);
  result.type = 'create';
  return result;
});

const digAction = coroutine.wrap(function* (msg, sid){
  const ret = yield $.answer.digMime(msg, sid);
  const result = {
    'type': 'dig',
    'answer': ret,
    'isMe': false,
    'x': msg['x'],
    'y': msg['y'],
  };
  return result;
});

module.exports = function (server) {
  const WebSocketServer = require('ws').Server;
  const wss = new WebSocketServer({ server });
 
  wss.on('connection', function connection(ws) {
    
    const request = url.parse(ws.upgradeReq.url, true);
    const sid = parseInt(Math.random() * 1000, 10);
    logger.trace(request);

    const roomNo = parseInt(request.query.no, 10);
    if(isNaN(roomNo) || roomNo > 10) return ws.close();

    ws.on('message', coroutine.wrap(function* incoming(message) {
      logger.trace('received: %s', message);
      const msg = JSON.parse(message);
      let result;
      try {
        if(msg.type === 'dig') {
          logger.trace('dig');
          const ret = yield digAction(msg, sid);
          result = $.utils.apiSucceed(ret);
        }
        if(msg.type === 'create') {
          logger.trace('create');
          const ret = yield roomAction(roomNo, sid);
          result = $.utils.apiSucceed(ret);
        }
      } catch (err) {
        result = $.utils.apiFail(err);
      }
      ws.send(result);
    }));
  });
};
