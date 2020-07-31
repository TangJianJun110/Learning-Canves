var tetris = null;

window.addEventListener("load", function () {
  let maxHeight = document.body.clientHeight;
  let size = 15; // 方格大小
  let span=1;    // 边框大小
  let num = Math.floor((maxHeight-span) / (size+span));  // 计算方格数量
  tetris = new Tetris({
    blockSize: size,
    blockNum: num,
    span: 1,
  });
});
