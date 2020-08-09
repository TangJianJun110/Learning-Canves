function LinesBox(options) {
  this.opt = {
    step: 40,
    lineColor: "rgb(255,0,0)",
    speed: 0.01,
  };

  // 用户传入的参数覆盖默认参数
  for (let k in options) {
    this.opt[k] = options[k];
  }

  if (!this.opt.container) {
    console.log(`container is required`);
    return;
  }

  this.canvas = null;
  this.ctx = null;
  this.keyPoints = [];
  this.drawPoints = [];
  this.endTime = new Date().getTime();
  this.finish = false;
  this.init();
}

LinesBox.prototype.init = function () {
  let parent = document.getElementById(this.opt.container);
  if (!parent) {
    console.log(`container is not find`);
    return;
  }
  let width = parent.clientWidth;
  let height = parent.clientHeight;
  this.canvas = document.createElement("canvas");
  this.canvas.width = width;
  this.canvas.height = height;

  parent.appendChild(this.canvas);

  this.ctx = this.canvas.getContext("2d");

  // 初始化位置
  let x0 = Math.floor(width / 2);
  let y0 = Math.floor(height / 2);
  this.curIndex = 0;
  this.drawIndex = 0;
  this.curSign = 1;
  this.keyPoints.push({
    x: x0,
    y: y0,
  });
  this.drawPoints.push({
    x: x0,
    y: y0,
  });
  this.ctx.beginPath();
  this.ctx.lineWidth = 1; //设置线条宽度
  this.ctx.strokeStyle = this.opt.lineColor; //设置线条颜色
  // this.ctx.moveTo(this.keyPoints[0].x, this.keyPoints[0].x);
  this.render();
};

LinesBox.prototype.render = function () {
  requestAnimationFrame(this.render.bind(this)); // 执行渲染
  let t = new Date().getTime();
  if (t - this.endTime > this.opt.speed * 1000) {
    if (
      this.drawPoints[this.drawIndex].x >= this.canvas.width ||
      this.drawPoints[this.drawIndex].y >= this.canvas.height
    ) {
      this.finish = true;
    }
    if (this.finish) return;
    this.ctx.lineTo(
      this.drawPoints[this.drawIndex].x,
      this.drawPoints[this.drawIndex].y
    ); 
    this.ctx.stroke();
    if (
      this.keyPoints[this.curIndex].x === this.drawPoints[this.drawIndex].x &&
      this.keyPoints[this.curIndex].y === this.drawPoints[this.drawIndex].y
    ) {
      this.update();
    }
    this.drawIndex++;
    this.endTime = t;
  }
};

LinesBox.prototype.update = function () {
  this.curIndex = this.curIndex + 1;

  let xn = Math.ceil(this.curIndex / 2);
  xn = xn % 2 == 0 ? 1 : 0;
  let xm = Math.ceil(this.curIndex / 4);
  let xsign = Math.pow(-1, xn);
  let xsp = xm * this.opt.step;

  let x = this.keyPoints[0].x + xsign * xsp;

  let y = 0,yn=0,ym=0,ysign=0,ysp=0;
  if (this.curIndex > 1) {
    yn = Math.ceil((this.curIndex - 1) / 2);
    ym = Math.ceil((this.curIndex - 1) / 4);
    yn = yn % 2 == 0 ? 1 : 0;
    ysign = Math.pow(-1, yn);
    ysp = ym * this.opt.step;
    y = this.keyPoints[0].y + ysign * ysp;
    // console.log("ysp："+ysp);
  } else {
    y = this.keyPoints[0].y;
  }

  if (x === this.keyPoints[this.keyPoints.length - 1].x) {
    let num=Math.abs((y-this.keyPoints[this.keyPoints.length - 1].y)/this.opt.step);
    for (i = 1; i <= num; i++) {
      this.drawPoints.push({
        x: x,
        y: this.keyPoints[this.keyPoints.length - 1].y + ysign *i* this.opt.step
      });
    }
  } else if (y === this.keyPoints[this.keyPoints.length - 1].y) {
    let num=Math.abs((x-this.keyPoints[this.keyPoints.length - 1].x)/this.opt.step);
    for (i = 1; i <= num; i++) {
      this.drawPoints.push({
        x: this.keyPoints[this.keyPoints.length - 1].x + xsign *i* this.opt.step,
        y: y
      });
    }
  } else {
    this.drawPoints.push({
      x: x,
      y: y,
    });
  }
  this.keyPoints.push({
    x: x,
    y: y,
  });
};
