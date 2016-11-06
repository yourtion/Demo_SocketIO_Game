'use strict';

require('../src');
const assert = require('assert');

const ROOM_NO = parseInt(Math.random() * 100000, 10);

describe('Room', function () {

  it('createRoom not no', function (next) {
    $.room.createRoom({}, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  it('createRoom not sid', function (next) {
    $.room.createRoom({
      no: ROOM_NO,
    }, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      next();
    });
  });

  it('createRoom success', function (next) {
    $.room.createRoom({
      no: ROOM_NO,
      sid: 1,
    }, (err, data) => {
      assert.equal(err, null);
      assert.ok(data);
      assert.ok(data.count);
      assert.equal(data.count, 10);
      assert.ok(data.map);
      assert.equal(data.map.length, 9);
      assert.equal(data.map[0].length, 9);
      assert.equal(data.map[8].length, 9);
      next();
    });
  });

  it('add person success', function (done) {
    $.room.createRoom({
      no: ROOM_NO,
      sid: 2,
    }, (err, data) => {
      assert.equal(err, null);
      assert.ok(data);
      assert.ok(data.count);
      assert.equal(data.count, 10);
      assert.ok(data.map);
      assert.equal(data.map.length, 9);
      assert.equal(data.map[0].length, 9);
      assert.equal(data.map[8].length, 9);
      done();
    });
  });

  it('add person full', function (done) {
    $.room.createRoom({
      no: ROOM_NO,
      sid: 3,
    }, (err, data) => {
      assert.ok(err);
      assert.equal(data, null);
      done();
    });
  });
  
});
