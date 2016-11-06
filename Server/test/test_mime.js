'use strict';

require('../src');
const mime = require('../src/services/mime');
const assert = require('assert');


describe('Mime', function () {

  it('genMimeArr', function () {
    const data = mime.genMimeArr();
    assert.ok(data);
    assert.equal(data.length, 9);
    let mimeCount = 0;
    for (const row of data) {
      assert.equal(row.length, 9);
      for (const col of row) {
        if(col === -1) mimeCount += 1;
      }
    }
    assert.equal(mimeCount, $.config.mimeCnt);
  });
  

  it('getInitArr', function () {
    const data = mime.getInitArr(9);
    for (const row of data) {
      assert.equal(row.length, 9);
      for (const col of row) {
        assert.equal(col, 9);
      }
    }
  });

});
