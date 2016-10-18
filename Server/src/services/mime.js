'use strict';

const logger = $.utils.createLogger('service:mime');

const mime = {};

const mimeCnt = mime.mimeCnt = 10;
const col = mime.col = 9;
const row = mime.row = 9;

function getRandPos(max) {
  return parseInt(Math.random() * (max), 10);
}

function increaseArround(data, r, c) {
  // upper row, current row, and the lower row
  for (let k = -1; k < 2; k++) { // -1, 0, 1
    const rr = r - k; // tmp row
    for (let i = c - 1; i < c + 2; i++) {
      const cc = i;  // tmp col
      if (cc >= 0 && cc < col     // 约束列
        && rr >= 0 && rr < row  // 约束行
        && !(rr === r && cc === c)    // 不是当前这一格
        && data[rr][cc] >= 0) { // 且不是雷
        data[rr][cc] += 1;
      }
    }
  }
}

mime.getInitArr = function (initValue) {
  logger.debug('getInitArr');
  // 地图场景数据
  const data = [];
  // 初始化数据
  for (let r = 0; r < row; r++) {
    const tmpArr = [];
    for (let c = 0; c < col; c++) {
      tmpArr.push(initValue);
    }
    data.push(tmpArr);
  }
  logger.trace('getInitArr: \n', data);
  return data;
};

mime.genMimeArr = function () {
  logger.debug('genMimeArr');
  let tmpCnt = mimeCnt;
  const mimeMap = {}; // 辅助判断各格子的状态
  // 地图场景数据
  const data = mime.getInitArr(0);
  // 生成雷
  while (tmpCnt > 0) {
    const randX = getRandPos(col); // x => col
    const randY = getRandPos(row); // y => row
    const key = randY + '-' + randX;
    if (!(key in mimeMap)) {
      mimeMap[key] = 1;
      data[randY][randX] = -1; // 用负数来表示这里是雷
      tmpCnt -= 1;
    }
  }

  // 扫描雷附近的格子
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      if (data[r][c] < 0) {
        increaseArround(data, r, c);
      }
    }
  }
  // 打印结果
  logger.trace('genMimeArr: \n', data);
  return data;
};

// mime.genMimeArr();
module.exports = mime;
