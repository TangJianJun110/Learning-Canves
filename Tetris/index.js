var tetris = null;

window.addEventListener("load", function () {
  let maxHeight = document.body.clientHeight;
  let size = 15; // 方格大小
  let span = 1;    // 边框大小
  let num = Math.floor((maxHeight - span) / (size + span));  // 计算方格数量
  tetris = new Tetris({
    blockSize: size,
    blockNum: num,
    span: 1,
  });
});

window.addEventListener('keydown', function (evet) {
  let keyCode = event.keyCode;
  if (tetris) {
    switch (keyCode) {
      case 37:
      case 65:  // 左
        tetris.moveLeft();
        break;
      case 39:
      case 68:  // 右
        tetris.moveRight();
        break;
      case 187:  // 加速
        tetris.raiseUp();
        break;
      case 189:  // 减速
        tetris.slowDown();
        break;
    }
  }
})