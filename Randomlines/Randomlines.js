function Randomlines(options) {
    this.opt = {
        pointColor: 'rgb(255,0,0)',
        lineColor: 'rgb(255,255,0)',
        maxParticleNum: 1000,
        maxDistance: 1000,
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
    this.ParticleList = [];
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
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    parent.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // 创建粒子
    for (let i = 0; i < this.opt.maxParticleNum; i++) {
        this.ParticleList.push({
            x: Math.random() * width,
            y: Math.random() * height
        });
    }

    this.ctx.beginPath();//开始绘制线条，若不使用beginPath，则不能绘制多条线条
    this.ctx.moveTo(100, 100);//线条开始位置
    this.ctx.lineTo(700, 700);//线条经过点
    this.ctx.lineTo(100, 700);
    this.ctx.lineTo(100, 100);
    this.ctx.closePath();//结束绘制线条，不是必须的
    // this.render();
}

Randomlines.prototype.render = function () {

    requestAnimationFrame(this.render.bind(this));   // 执行渲染

    for (let i = 0; i < this.opt.maxParticleNum; i++) {
        this.ctx.fillStyle = this.opt.pointColor;
        let x = this.ParticleList[i].x;
        let y = this.ParticleList[i].y;
        let w = this.opt.pointSize;
        let h = this.opt.pointSize;
        this.ctx.fillRect(x, y, w, h);
        for (let j = 0; j < this.opt.maxParticleNum; j++) {
            let d = Math.sqrt(this.ParticleList[i].x * this.ParticleList[j].x + this.ParticleList[i].y * this.ParticleList[j].y);
            if (d < this.opt.maxDistance) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 10;//设置线条宽度
                this.ctx.strokeStyle = "red";//设置线条颜色
                this.ctx.moveTo(this.ParticleList[i].x, this.ParticleList[i].x)
                this.ctx.lineTo(this.ParticleList[j].x, this.ParticleList[j].x);//线条经过点
                this.ctx.closePath();
            }
        }
        this.ctx.lineWidth = 1;
    }
    this.update();
}

Randomlines.prototype.update = function () {

}