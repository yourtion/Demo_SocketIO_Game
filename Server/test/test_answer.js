'use strict';

require('../src');
const coroutine = require('lei-coroutine');
const assert = require('assert');

const ROOM_NO = parseInt(Math.random() * 100000, 10);
const ROOM_INFO = { no: ROOM_NO };
const ROOM_KEY = $.utils.getRedisKey(ROOM_NO);
const USER_1 = 1;
const USER_2 = 2;

describe('Answer', function () {

  let share;

  it('createRoom success', coroutine.wrap(function* () {
    ROOM_INFO.sid = USER_1;
    const data = yield $.room.createRoom(ROOM_INFO);
    assert.ok(data);
  }));

  it('add person success', coroutine.wrap(function* () {
    ROOM_INFO.sid = USER_2;
    const data = yield $.room.createRoom(ROOM_INFO);
    assert.ok(data);
  }));

  it('get Data from Redis', coroutine.wrap(function* () {
    const room = yield $.redis.hgetall(ROOM_KEY);
    assert.ok(room);
    share = room;
    share.room = JSON.parse(room.data);
    share.answer = JSON.parse(room.answer);
    assert.equal(share.cnt, 2);
    assert.equal(share.lastId, 0);
  }));

  it('dig mime err#1', coroutine.wrap(function* () {
    try {
      const data = yield $.answer.digMime({}, null);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));

  it('dig mime err#2', coroutine.wrap(function* () {
    try {
      const data = yield $.answer.digMime({}, USER_1);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));

  it('dig mime err#3', coroutine.wrap(function* () {
    try {
      const data = yield $.answer.digMime({
        x: -10,
        y: 0,
      }, USER_1);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));

  it('dig mime#1', coroutine.wrap(function* () {
    const data = yield $.answer.digMime({ x: 0, y: 0, no: ROOM_NO }, USER_1);
    const res = share.answer[0][0];
    assert.equal(data, res);
  }));

  it('dig mime#1 error', coroutine.wrap(function* () {
    try {
      const data = yield $.answer.digMime({ x: 0, y: 0, no: ROOM_NO }, USER_1);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));

  for (let x = 0; x < 9; x++) {
    const odd = x % 2 === 0;
    for (let y = 0; y < 9; y++) {
      const tmp = odd ? y : y + 1;
      it(`dig mime # ${ x }-${ y }`, coroutine.wrap(function* () {
        const user = tmp % 2 === 0 ? USER_2 : USER_1;
        const data = yield $.answer.digMime({ x, y, no: ROOM_NO }, user);
        const res = share.answer[y][x];
        assert.equal(data, res);
      }));
    }
  }

});
