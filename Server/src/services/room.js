'use strict';

const logger = $.utils.createLogger('service:room');
const mime = require('./mime');

const room = {};

room.createRoom = function (data, callback) {
  
  logger.debug('createRoom');
  logger.trace('input data: \n', data);

  let roomNo;
  if (data) {
    roomNo = data.no;
  }
  const sid = data.sid;
  const key = $.utils.getRedisKey(roomNo);
  logger.trace('roomNo: %s , sid: %s , key: %s ', roomNo, sid, key);
  $.redis.hgetall(key, (err, room) => {
    if(err) return callback(err);

    if (room && room.cnt) { // 房间已经开了
      logger.debug('has room');
      let userCnt = parseInt(room.cnt, 10);
      const mimeData = room.data;
      logger.trace(' userCnt : %s \n mimeData: \n %s', userCnt, mimeData);
      if (userCnt < $.config.maxUserCount) {
        userCnt += 1; // TODO: 这里可以记录另一个玩家的信息
        $.redis.hset(key, 'cnt', userCnt, (err) => {
          if(err) return callback(err);

          const lefts = room.lefts[0];
          const result = {
            'map': mimeData,
            'count': lefts,
          };
          logger.trace(' lefts: %s \n result: \n %s', lefts, result);

          return callback(null, result);
        });

      } else {
        logger.trace('room %s is full', roomNo);
        return callback(new Error(`房间${ roomNo }已经满员`));
      }

    } else { // 新房间

      logger.debug('new room');
      const mimeData = mime.genMimeArr();
      const initData = mime.getInitArr(9);

      const room = { // TODO: 这里可以记录用户的信息
        'createTime': parseInt(new Date() * 1000, 10),
        'cnt': 1,
        'online': true,
        'lefts': $.config.maxUserCount,
        'answer': JSON.stringify(mimeData),
        'data': JSON.stringify(initData),
        'curId': sid,
        'lastId': 0,
      };

      logger.trace('room info: \n key: %s \n room: \n %s', key, room);
      $.redis.hmset(key, room, 60 * 60 * 12, (err) => { // 12小时
        if(err) return callback(err);
        
        const rspData = {
          'map': initData,
          'count': mime.mimeCnt, // mimeCnt
        };
        logger.trace('room number: ', roomNo);
        return callback(null, rspData);
      });

    }
  });

};

module.exports = room;
