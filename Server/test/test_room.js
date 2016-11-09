'use strict';

require('../src');
const coroutine = require('lei-coroutine');
const assert = require('assert');

const ROOM_NO = parseInt(Math.random() * 100000, 10);
const ROOM_INFO = { no: ROOM_NO };

describe('Room', function () {

  it('createRoom not no', coroutine.wrap(function* () {
    try {
      const data = yield $.room.createRoom({});
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));

  it('createRoom not sid', coroutine.wrap(function* () {
    try {
      const data = yield $.room.createRoom(ROOM_INFO);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));
  

  it('createRoom success', coroutine.wrap(function* () {
    ROOM_INFO.sid = 1;
    const data = yield $.room.createRoom(ROOM_INFO);
    assert.ok(data);
    assert.ok(data.count);
    assert.equal(data.count, 10);
    assert.ok(data.map);
    assert.equal(data.map.length, 9);
    assert.equal(data.map[0].length, 9);
    assert.equal(data.map[8].length, 9);
  }));

  it('add person success', coroutine.wrap(function* () {
    ROOM_INFO.sid = 2;
    const data = yield $.room.createRoom(ROOM_INFO);
    assert.ok(data);
    assert.ok(data.count);
    assert.equal(data.count, 10);
    assert.ok(data.map);
    assert.equal(data.map.length, 9);
    assert.equal(data.map[0].length, 9);
    assert.equal(data.map[8].length, 9);
  }));

  it('add person full', coroutine.wrap(function* () {
    ROOM_INFO.sid = 3 ;
    try {
      const data = yield $.room.createRoom(ROOM_INFO);
      assert.equal(data, null);
    } catch (err) {
      assert.ok(err);
    }
  }));
  
});
