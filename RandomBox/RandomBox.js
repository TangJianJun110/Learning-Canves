// 随机方块


/**
 * 构造函数
 * @author 九门唐大佛爷
 * @date 2020-08-18
 * @param {any} options
 * @returns {any}
 */
function RandomBox(options) {
  this.opt = options;
  this.endTime=new Date().getTime();
  this.init();
}

/**
 * 初始化函数
 * @author 九门唐大佛爷
 * @date 2020-08-18
 * @returns {any}
 */
RandomBox.prototype.init = function () {
  let parentDom = document.getElementById(this.opt.container);
  this.canvas = document.createElement('canvas');
  this.canvas.width = parentDom.clientWidth;
  this.canvas.height = parentDom.clientHeight;
  parentDom.appendChild(this.canvas);

  this.ctx = this.canvas.getContext('2d');

  this.targetBoxs=[];
  for(let i=0;i<this.opt.maxNum;i++){
    let x=Math.random() * this.canvas.width;
  x=(x+100)<this.canvas.width?x:(this.canvas.width-100);

  let y=Math.random() * this.canvas.height;
  y=(y+100)<this.canvas.height?y:(this.canvas.height-100);
    this.targetBoxs.push(
      {
        color: "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")",
        position: {
          x: x,
          y: y,
          w: 100,
          h: 100
        },
        radius:100-Math.random()*50,
        vec2:[Math.random()*this.opt.step,Math.random()*this.opt.step]
      });
  }
  this.render();
}

/**
 * 创建方块函数
 * @author 九门唐大佛爷
 * @date 2020-08-18
 * @returns {any}
 */
RandomBox.prototype.render = function () {
  this.update();
  requestAnimationFrame(this.render.bind(this));
  // this.ctx.fillStyle = this.targetBox.color;  // 填充颜色
  // this.ctx.fillRect(this.targetBox.position.x, this.targetBox.position.y, this.targetBox.position.w, this.targetBox.position.h); // 绘制矩形
  let t=new Date().getTime();
  if((t-this.endTime)>0.05*100){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    for(let i=0;i<this.opt.maxNum;i++){
      this.ctx.beginPath();
      this.ctx.lineWidth=0.5;
      this.ctx.strokeStyle=this.targetBoxs[i].color;
      this.ctx.arc(this.targetBoxs[i].position.x, this.targetBoxs[i].position.y,this.targetBoxs[i].radius,0,2*Math.PI,false);
      this.ctx.stroke();//画空心圆
      this.ctx.closePath();
    }
    this.endTime=t;
  }
}

RandomBox.prototype.update=function(){
  for(let i=0;i<this.opt.maxNum;i++){
    this.targetBoxs[i].position.x+=this.targetBoxs[i].vec2[0];
    this.targetBoxs[i].position.y+=this.targetBoxs[i].vec2[1];
  
    if((this.targetBoxs[i].position.x+this.targetBoxs[i].radius)>=this.canvas.width){
      this.targetBoxs[i].position.x=this.canvas.width-this.targetBoxs[i].radius;
      this.targetBoxs[i].vec2[0]=-this.targetBoxs[i].vec2[0];
    }
  
    if(this.targetBoxs[i].position.x<=0){
      this.targetBoxs[i].position.x=this.targetBoxs[i].radius;
      this.targetBoxs[i].vec2[0]=-this.targetBoxs[i].vec2[0];
    }
  
    if((this.targetBoxs[i].position.y+this.targetBoxs[i].radius)>=this.canvas.height){
      this.targetBoxs[i].position.y=this.canvas.height-this.targetBoxs[i].radius;
      this.targetBoxs[i].vec2[1]=-this.targetBoxs[i].vec2[1];
    }
    if(this.targetBoxs[i].position.y<=0){
      this.targetBoxs[i].position.y=this.targetBoxs[i].radius;
      this.targetBoxs[i].vec2[1]=-this.targetBoxs[i].vec2[1];
    }
  }
}