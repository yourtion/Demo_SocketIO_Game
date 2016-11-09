'use strict';

const coroutine = require('lei-coroutine');
const logger = $.utils.createLogger('service:room');
const mime = require('./mime');

const room = {};

room.createRoom = coroutine.wrap(function* (data) {

  logger.debug('createRoom');
  logger.trace('input data: \n', data);

  if (!data) throw new Error(`missing data`);
  if (!data.no) throw new Error(`missing room no`);
  if (!data.sid) throw new Error(`missing sid`);

  const roomNo = data.no;
  const sid = data.sid;
  const key = $.utils.getRedisKey(roomNo);
  logger.trace('roomNo: %s , sid: %s , key: %s ', roomNo, sid, key);
  const room = yield $.redis.hgetall(key);

  if (room && room.cnt) { // 房间已经开了
    logger.debug('has room');
    let userCnt = parseInt(room.cnt, 10);
    const mimeData = JSON.parse(room.data);
    logger.trace(' userCnt : %s \n mimeData: \n %s', userCnt, mimeData);
    if (userCnt < $.config.maxUserCount) {
      userCnt += 1; // TODO: 这里可以记录另一个玩家的信息
      yield $.redis.hset(key, 'cnt', userCnt);

      $.infos[roomNo][sid] = {
        score: 0,
      };
      const lefts = room.lefts;
      const result = {
        'map': mimeData,
        'count': lefts,
      };
      logger.trace(' lefts: %s \n result: \n %s', lefts, result);
      return result;
    }
    logger.trace('room %s is full', roomNo);
    throw new Error(`房间${ roomNo }已经满员`);

  } else { // 新房间

    logger.debug('new room');
    const mimeData = mime.genMimeArr();
    const initData = mime.getInitArr(9);
    const left = $.config.mimeCnt;

    const room = { // TODO: 这里可以记录用户的信息
      'createTime': parseInt(new Date() * 1000, 10),
      'cnt': 1,
      'online': true,
      'lefts': left,
      'answer': JSON.stringify(mimeData),
      'data': JSON.stringify(initData),
      'curId': sid,
      'lastId': 0,
    };

    logger.trace('room info: \n key: %s \n room: \n %s', key, room);
    yield $.redis.hmset(key, room);
    yield $.redis.expire(key, $.config.roomExpire);

    $.infos[roomNo] = {};
    $.infos[roomNo][sid] = {
      score: 0,
    };
    const rspData = {
      'map': initData,
      'count': left, // mimeCnt
    };
    logger.trace('room number: ', roomNo);
    return rspData;
  }
});

module.exports = room;
