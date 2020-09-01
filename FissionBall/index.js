window.addEventListener("load", function () {
  let fb = new FissionBall();
});

/************ FissionBall 类的实现*************/

// FissionBall 构造函数
function FissionBall() {
  /*******创建初始化的球*******/
  // 1.获取父级节点
  let parent = document.getElementById('map');
  // 2.创建画板
  let canvas = document.createElement('canvas');

  // 3.设置画板宽度和
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  // 4.将画板添加到网页上
  parent.appendChild(canvas);

  // 5.获取画笔
  let ctx = canvas.getContext('2d');

  // 6.绘制一个圆
  let circle={
    position:{
      x:Math.random() * canvas.width,
      y:Math.random() * canvas.height
    },
    radius:100,
    fillColor:"rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")",
    vec2:[Math.random(),Math.random()]
  };
  ctx.beginPath();
  ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = circle.fillColor;
  ctx.closePath();
  ctx.fill();

  function render(){
    // 更新圆的位置
    circle.position.x+=circle.vec2[0];
    circle.position.y+=circle.vec2[1];

    // 判断圆是不是到达边界
    let x0=circle.position.x-circle.radius;
    let y0=circle.position.y-circle.radius;
    let x1=circle.position.x+circle.radius;
    let y1=circle.position.y+circle.radius;
    if(x>canvas.width||x<0){
      circle.vec2[0]=-circle.vec2[0];
      circle.position.x<=0?(circle.position.x=circle.radius):(circle.position.x=canvas.width-circle.radius);
    }

    if(y>canvas.height||y<0){
      circle.vec2[1]=-circle.vec2[1];
      circle.position.y<=0?(circle.position.y=circle.radius):(circle.position.y=canvas.height-circle.radius);
    }

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = circle.fillColor;
    ctx.closePath();
    ctx.fill();

    requestAnimationFrame(render);
  }

  render();
}