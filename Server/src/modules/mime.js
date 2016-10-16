'use strict';

const mime = {};

const mimeCnt = 10;
const col = 9;
const row = 9;

mime.getInitArr = function (initValue) {
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
  return data;
};

mime.getRandPos = function (max) {
  return parseInt(Math.random() * (max), 10);
};

mime.increaseArround = function (data, r, c) {
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
};

mime.genMimeArr = function () {
  let tmpCnt = mimeCnt;
  const mimeMap = {}; // 辅助判断各格子的状态
  // 地图场景数据
  const data = mime.getInitArr(0);
  // 生成雷
  while (tmpCnt > 0) {
    const randX = mime.getRandPos(col); // x => col
    const randY = mime.getRandPos(row); // y => row
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
        mime.increaseArround(data, r, c);
      }
    }
  }
  // 打印结果
  // console.log(data);
  return data;
};

// mime.genMimeArr();
