var Tetris = {
  gurid: [], //记录整个网格
  canves: null,
  ctx: null,
  size: 28, // 网格大小px
  num: 20, // 网格个数
  span: 2, // 网格边框大小px
  finishBlockPos: [], // 记录停止在底部的色块的位置
  curBlock: null, // 记录当前运动的色块的状态属性
  colories: [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#00FFFF",
  ],
  defaultBlock: [
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
  ],
  init(id) {
    // this.canves=document.getElementById(id);
    // this.ctx=this.canves.getContext('2d');
    this.createMap();
  },
  // 创建网格
  createMap() {
    this.canves = document.createElement("canvas");
    this.canves.width = this.size * this.num + this.span * (this.num + 1);
    this.canves.height = this.size * this.num + this.span * (this.num + 1);
    document.body.appendChild(this.canves);
    this.ctx = this.canves.getContext("2d");
    for (let i = 0; i < this.num; i++) {
      this.gurid[i] = [];
      for (let j = 0; j < this.num; j++) {
        this.gurid[i][j] = 0;
      }
    }
    this.createBlock();
    setInterval(() => {
      this.render();
      this.updateBlock();
    }, 1000);
  },
  createBlock() {
    // 创建Block
    this.curBlock = {};
    this.curBlock.colorIndex = Math.floor(Math.random() * this.colories.length);
    this.curBlock.colorIndex =
      this.curBlock.colorIndex === 0
        ? this.curBlock.colorIndex + 1
        : this.curBlock.colorIndex;
    this.curBlock.data = this.defaultBlock[
      Math.floor(Math.random() * this.defaultBlock.length)
    ];
    let ox = Math.floor((this.num - this.curBlock.data[0].length) / 2);
    let oy = 0;
    this.curBlock.origin = [ox, oy];
    // [[ox,oy],[ox+1,oy],[ox+2,oy]],
    //     [[ox,oy+1],[ox+1,oy+1],[ox+2,oy+1]]
  },
  updateBlock() {
    if (this.curBlock) {
      this.curBlock.origin[1]++;
      let origin = this.curBlock.origin;
      let gg = this.curBlock.data;
      for (let i = 0; i < gg.length; i++) {
        for (let j = 0; j < gg[i].length; j++) {
          if (gg[i][j]) {
            if (this.gurid[origin[0] + j][origin[1] + i - 1]) {
              this.gurid[origin[0] + j][origin[1] + i - 1] = 0;
            }
            this.gurid[origin[0] + j][origin[1] + i] = this.curBlock.colorIndex;
          }
        }
      }
    } else {
      this.createBlock();
    }
    // console.table(this.gurid);
  },
  // 动画渲染函数
  render() {
    // this.ctx.fillStyle='#000000';
    // this.ctx.fillRect(20,20,40,40);
    for (let r = 0; r < this.gurid.length; r++) {
      for (let c = 0; c < this.gurid[r].length; c++) {
        this.ctx.fillStyle = this.colories[this.gurid[r][c]];
        let x = this.size * r + this.span * (r + 1);
        let y = this.size * c + this.span * (c + 1);
        let w = this.size;
        let h = this.size;
        this.ctx.fillRect(x, y, w, h);
      }
    }
    this.judgeFinish();
  },
  judgeFinish() {
    let origin = this.curBlock.origin;
    let gg = this.curBlock.data;
    for (let i = 0; i < gg.length; i++) {
      for (let j = 0; j < gg[i].length; j++) {
        if (gg[i][j]) {
          let target = origin[0] + j + "" + (origin[1] + i + 1);
          if (this.finishBlockPos.indexOf(target) > -1) {
            this.recordFinishBlockPos();
            this.curBlock = null;
            return;
          }
          if ([origin[1] + i + 1] == this.num) {
            this.recordFinishBlockPos();
            this.curBlock = null;
            return;
          }
        }
      }
    }
  },
  recordFinishBlockPos() {
    let origin = this.curBlock.origin;
    let gg = this.curBlock.data;
    for (let i = 0; i < gg.length; i++) {
      for (let j = 0; j < gg[i].length; j++) {
        if (gg[i][j]) {
          this.finishBlockPos.push(origin[0] + j + "" + (origin[1] + i));
        }
      }
    }
  },
};

window.addEventListener("load", function () {
  Tetris.init("ctx");
});
