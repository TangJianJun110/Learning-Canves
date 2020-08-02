var list = [];

window.addEventListener("load", function () {
  let size = 15; // 方格大小
  let span = 1;    // 边框大小
  ['onemap', 'twomap', 'threemap', 'fourmap'].forEach(id => {
    list.push(new Tetris({
      container: id,
      blockSize: size,
      span: 1,
    }))
  })
});

window.addEventListener('keydown', function (evet) {
  let keyCode = event.keyCode;
  if (list.length>0) {
    switch (keyCode) {
      case 37:
      case 65:  // 左
        list.forEach(tetris => {
          tetris.moveLeft();
        })

        break;
      case 39:
      case 68:  // 右
        list.forEach(tetris => {
          tetris.moveRight();
        })

        break;
      case 187:  // 加速
        list.forEach(tetris => {
          tetris.raiseUp();
        })

        break;
      case 189:  // 减速
        list.forEach(tetris => {
          tetris.slowDown();
        })

        break;
    }
  }
})