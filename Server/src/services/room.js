'use strict';

const logger = $.utils.createLogger('service:room');
const room = {};

room.createRoom = function (data, callback) {
  // data = self.request.body
  let roomNo;
  if (data) {
    // data = JSON.loads(data)
    roomNo = data.no;
  }

  const sid = data.sid;
  const key = $.utils.getRedisKey(roomNo);
  $.redis.hgetall(key, (err, room) => {
    if (room && room.cnt) { // 房间已经开了
      let userCnt = parseInt(room.cnt, 10);
      const mimeData = room.data;
      if (userCnt < $.config.maxUserCount) {
        userCnt += 1; // TODO: 这里可以记录另一个玩家的信息
        $.redis.hset(key, 'cnt', userCnt, (_err) => {
          const lefts = room.lefts[0];
          const rspData = {
            'map': mimeData,
            'count': lefts,
          };
          // self.write(rspSuccess(rspData))
          callback(null, rspData);
        });

      } else {
        // self.write(rspError(u'房间%s已经满员' % roomNo))
        return callback(new Error(`房间{$roomNo}已经满员`));
        // self.finish()
        // return
      }

    } else { // 新房间
      const mimeData = $.mime.genMimeArr();
      const initData = $.mime.getInitArr(9);
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
      // logger.trace(key ,room);
      $.redis.hmset(key, room, (err, ret) => {
        logger.trace(err, ret);
        const rspData = {
          'map': initData,
          'count': 10, // mimeCnt
        };
        logger.trace('room number: ', roomNo);
        // self.write(rspSuccess(rspData))
       return callback(null, rspData);
      }); // 12小时

    }
  });

};

module.exports = room;
