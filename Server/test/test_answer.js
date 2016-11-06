'use strict';

require('../src');
const assert = require('assert');

const ROOM_NO = parseInt(Math.random() * 100000, 10);
const ROOM_KEY = $.utils.getRedisKey(ROOM_NO);
const USER_1 = 1;
const USER_2 = 2;

describe('Answer', function () {

  let share;

  it('createRoom success', function (next) {
    $.room.createRoom({
      no: ROOM_NO,
      sid: USER_1,
    }, (err, data) => {
      assert.equal(err, null);
      assert.ok(data);
      next();
    });
  });

  it('add person success', function (next) {
    $.room.createRoom({
      no: ROOM_NO,
      sid: USER_2,
    }, (err, data) => {
      assert.equal(err, null);
      assert.ok(data);
      next();
    });
  });

  it('get Data from Redis', function (next) {
    $.redis.hgetall(ROOM_KEY, (err, room) => {
      assert.equal(err, null);
      assert.ok(room);
      share = room;
      share.room = JSON.parse(room.data);
      share.answer = JSON.parse(room.answer);
      assert.equal(share.cnt, 2);
      assert.equal(share.lastId, 0);
      next();
    });
  });

  it('dig mime err#1', function (next) {
    $.answer.digMime({}, null, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  it('dig mime err#2', function (next) {
    $.answer.digMime({}, USER_1, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  it('dig mime err#3', function (next) {
    $.answer.digMime({
      x: -10,
      y: 0,
    }, USER_1, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  it('dig mime#1', function (next) {
    $.answer.digMime({
      x: 0,
      y: 0,
      no: ROOM_NO,
    }, USER_1, (err, data) => {
      const res = share.answer[0][0];
      assert.equal(err, null);
      assert.equal(data, res);
      next();
    });
  });

  it('dig mime#1 error', function (next) {
    $.answer.digMime({
      x: 0,
      y: 0,
      no: ROOM_NO,
    }, USER_1, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  for (let x = 0; x < 9; x++) {
    const odd = x % 2 === 0;
    for (let y = 0; y < 9; y++) {
      const tmp = odd ? y : y + 1;
      it(`dig mime # ${ x }-${ y }`, function (next) {
        const user = tmp % 2 === 0 ? USER_2 : USER_1;
        $.answer.digMime({
          x,
          y,
          no: ROOM_NO,
        }, user, (err, data) => {
          const res = share.answer[y][x];
          assert.equal(err, null);
          assert.equal(data, res);
          next();
        });
      });
    }
  }

});
