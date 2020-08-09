function Randomlines(options) {
  this.opt = {
    pointColor: "rgb(255,0,0)",
    lineColor: "rgb(0,255,220)",
    backGroundColor:'rgb(0,0,0)',
    maxParticleNum: 100,
    maxDistance: 20000,
    speed: 0.01,
    pointSize: 2,
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
  this.mousePointIndex = null;
  this.ParticleList = [];
  this.endTime = new Date().getTime();
  this.init();
}

Randomlines.prototype.init = function () {
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
  this.canvas.style.backgroundColor = this.opt.backGroundColor;

  this.canvas.addEventListener("mousemove", (e) => {
    if (this.mousePointIndex !== null) {
      this.ParticleList[this.mousePointIndex].x = e.clientX;
      this.ParticleList[this.mousePointIndex].y = e.clientY;
    } else {
      [{
        x: e.clientX,
        y: e.clientY,
        vec2: [0, 0],
      }].concat(this.ParticleList);
      this.mousePointIndex = 0;
    }
  });
  this.canvas.addEventListener("mouseouts", (e) => {
    this.ParticleList = this.ParticleList.slice(0, this.mousePointIndex).concat(
      this.ParticleList.slice(this.mousePointIndex + 1)
    );
    this.mousePointIndex = null;
  });
  parent.appendChild(this.canvas);
  this.ctx = this.canvas.getContext("2d");

  // 创建粒子
  for (let i = 0; i < this.opt.maxParticleNum; i++) {
    this.ParticleList[i] = this.createParticle();
  }
  this.render();
};

Randomlines.prototype.createParticle = function () {
  let angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * this.canvas.width,
    y: Math.random() * this.canvas.height,
    vec2: [Math.sin(angle), Math.cos(angle)],
  };
};

Randomlines.prototype.render = function () {
  requestAnimationFrame(this.render.bind(this)); // 执行渲染
  let t = new Date().getTime();
  if (t - this.endTime > this.opt.speed * 1000) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空画布

    for (let i = 0; i < this.opt.maxParticleNum; i++) {
      this.ctx.fillStyle = this.opt.pointColor;
      let r=this.ParticleList[i];
      let x = r.x;
      let y = r.y;
      let w = this.opt.pointSize;
      let h = this.opt.pointSize;
      this.ctx.fillRect(x, y, w, h);

      for (let j = i + 1; j < this.opt.maxParticleNum; j++) {
        let e = this.ParticleList[j];
        let x_dist = x - e.x; // x轴距离 l
        let y_dist = y - e.y; // y轴距离 n
        let dist = x_dist * x_dist + y_dist * y_dist; // 总距离, m
        if (dist < this.opt.maxDistance) {
          let d = (this.opt.maxDistance - dist) / this.opt.maxDistance;
          this.ctx.beginPath();
          this.ctx.lineWidth = d / 2;
          this.ctx.strokeStyle = this.opt.lineColor;
          this.ctx.moveTo(x, y);
          this.ctx.lineTo(e.x, e.y);
          this.ctx.stroke();

        //   r.x=r.x+r.vec2[0];
        //   r.y=r.y+r.vec2[1];
        }
      }
      this.update(i);
      //   if (this.judgeFinish(i)) {
      //     this.ParticleList[i] = this.createParticle();
      //   }
    }
    // this.drawLine(Math.floor(Math.random() * this.opt.maxParticleNum));
    this.endTime = t;
  }
};

Randomlines.prototype.drawLine = function () {
  let x = this.ParticleList[index].x;
  let y = this.ParticleList[index].y;
  for (let i = 0; i < this.ParticleList.length; i++) {
    let d = Math.sqrt(
      (x - this.ParticleList[i].x) * (x - this.ParticleList[i].x) +
        (y - this.ParticleList[i].y) * (y - this.ParticleList[i].y)
    );
    if (d < this.opt.maxDistance) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(this.ParticleList[i].x, this.ParticleList[i].y);
      this.ctx.stroke();
    }
  }
};

Randomlines.prototype.update = function (index) {
  // 更新位置
  let x = this.ParticleList[index].x;
  let y = this.ParticleList[index].y;
  let xsp = this.ParticleList[index].vec2[0];
  let ysp = this.ParticleList[index].vec2[1];
  if (x + xsp < 0 || x + xsp > this.canvas.width) {
    xsp = -xsp;
  }

  if (y + ysp < 0 || y + ysp > this.canvas.height) {
    ysp = -ysp;
  }
  this.ParticleList[index] = {
    x: x + xsp,
    y: y + ysp,
    vec2: [xsp, ysp],
  };
};
