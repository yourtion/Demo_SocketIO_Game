'use strict';

const logger = $.utils.createLogger('service:answer');
const answer = {};

answer.digMime = function (data, sid, callback) {
  let x = -1;
  let y = -1;
  let roomNo = 0;
  if (data) {
    // data = JSON.loads(data)
    x = parseInt(data.x, 10);
    y = parseInt(data.y, 10);
    roomNo = parseInt(data.no, 10);
  }
  if (x < 0 || y < 0 || !roomNo) {
    return callback(new Error('x or y or roomNo is invalid'));
  }
  const key = $.utils.getRedisKey(roomNo);
  $.redis.hgetall(key, (err, room) => {
    if (err) return callback(err);
    const lastPlayer = parseInt(room.lastId, 10);
    let isValid = true;
    if (lastPlayer) {
      logger.tracer(lastPlayer, sid);
      if (sid === lastPlayer) {
        isValid = false;
      }
    } else {
      const curPlayer = parseInt(room.curId, 10);
      logger.tracer(curPlayer, sid);
      if (sid !== curPlayer) {
        // 不用管curId不存在的bug，随便谁点谁开始
        isValid = false;
      }
    }
    if (!isValid) {
      return callback(new Error('请等待下轮再操作'));
    }
    const answer = JSON.parse(room.get('answer'));
    const data = JSON.parse(room.get('data'));
    logger.tracer(answer, data);
    const result = answer[y][x];
    data[y][x] = result;
    // update redis
    const updateData = {
      'data': JSON.stringify(data),
      'lastId': sid,
    };
    $.redis.hmset(key, updateData, (err) => {
      if (err) return callback(err);
      if (result < 0) { // 挖到金子了，要把剩余的个数减1
        $.redis.hincrby(key, 'lefts', -1, (err) => {
          if (err) return callback(err);
          const info = $.infos.roomNo.sid;
          info['score'] += 1;
          return callback(null, result);
        });
      }

    });

  });

};

module.exports = answer;
