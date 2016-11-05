'use strict';

const logger = $.utils.createLogger('service:answer');
const answer = {};

answer.digMime = function (data, sid, callback) {
  logger.debug('digMime');
  logger.trace('input: \n', data);

  let x = -1;
  let y = -1;
  let roomNo = 0;
  if (data) {
    x = parseInt(data.x, 10);
    y = parseInt(data.y, 10);
    roomNo = parseInt(data.no, 10);
  } else {
    return callback(new Error('x or y or roomNo is invalid'));
  }
  if (isNaN(x) || isNaN(y) || isNaN(roomNo) || x < 0 || y < 0 || x > 8 || y > 8 || !roomNo) {
    return callback(new Error('x or y or roomNo is invalid'));
  }

  const key = $.utils.getRedisKey(roomNo);
  logger.trace('x: %s, y:%s, roomNo: %s, key: %s', x, y, roomNo, key);

  $.redis.hgetall(key, (err, room) => {
    if (err) return callback(err);

    const lastPlayer = room.lastId ? parseInt(room.lastId, 10) : undefined;
    let isValid = true;
    if (lastPlayer) {
      if (sid === lastPlayer) {
        isValid = false;
      }
      logger.trace('lastPlayer: %s, sid: %s, isValid: %s', lastPlayer, sid, isValid);
    } else {
      const curPlayer = room.curId ? parseInt(room.curId, 10) : undefined;
      logger.trace(lastPlayer, sid);
      if (sid !== curPlayer) {
        // 不用管curId不存在的bug，随便谁点谁开始
        isValid = false;
      }
      logger.trace('curPlayer: %s, sid: %s, isValid: %s', curPlayer, sid, isValid);
    }
    if (!isValid) {
      return callback(new Error('请等待下轮再操作'));
    }

    const answer = JSON.parse(room.answer);
    const data = JSON.parse(room.data);
    const result = answer[y][x];
    data[y][x] = result;
    // update redis
    const updateData = {
      'data': JSON.stringify(data),
      'lastId': sid,
    };
    logger.trace(' result: %s \n updateData:\n %j', result, updateData);

    $.redis.hmset(key, updateData, (err) => {
      if (err) return callback(err);
      
      if (result < 0) { // 挖到金子了，要把剩余的个数减1
        logger.trace('dig gold!');
        $.redis.hincrby(key, 'lefts', -1, (err) => {
          if (err) return callback(err);
          const info = $.infos[roomNo][sid];
          info['score'] += 1;
          logger.trace('infos: ', info);
          return callback(null, result);
        });
      } else {
        return callback(null, result);
      }

    });

  });

};

module.exports = answer;
