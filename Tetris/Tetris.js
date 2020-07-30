// Tetris构造函数
function Tetris(options) {
    this.opt = {
        speed: 10,
        blockSize: 40,
        blockNum: 20,
        span: 2,
        colories: ["#000000", "#FFFFFF", "#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#00FFFF"],
        boxShapes: [
            // 土字型方块
            [
                [0,1,0],
                [1,1,1]
            ],
            // 条形方块
            [
                [1,1,1,1]
            ],
            // 左折型方块
            [
                [1,1,0],
                [0,1,1]
            ],
            // 右折型方块
            [
                [0,1,1],
                [1,1,0]
            ],
            // 倒左勾型方块
            [
                [1,0,0],
                [1,1,1]
            ],
            // 正左勾型方块
            [
                [1,1,1],
                [1,0,0]
            ],
            // 倒右勾型方块
            [
                [0,0,1],
                [1,1,1]
            ],
            // 正右勾型方块
            [
                [1,1,1],
                [0,0,1]
            ]
        ]
    }
    for (let k in options) {
        this.opt[key] = options[key]
    }

    this.endTime=0;
    this.canves = null;
    this.ctx = null;
    this.gurid = [];
    this.curBlock = null;
    this.init();
}

// 初始化函数
Tetris.prototype.init = function () {
    this.canves = document.createElement("canvas");
    this.canves.width = this.opt.blockSize * this.opt.blockNum + this.opt.span * (this.opt.blockNum + 1);
    this.canves.height = this.opt.blockSize * this.opt.blockNum + this.opt.span * (this.opt.blockNum + 1);
    document.body.appendChild(this.canves);
    this.ctx = this.canves.getContext("2d");
    for (let i = 0; i < this.opt.blockNum; i++) {
        this.gurid[i] = [];
        for (let j = 0; j < this.opt.blockNum; j++) {
            this.gurid[i][j] = 0;
        }
    }
    this.render();
}

// 渲染函数
Tetris.prototype.render = function () {

    requestAnimationFrame(this.render.bind(this));

    let curTime=new Date().getTime();
    if(curTime-this.endTime>this.opt.speed*500){
        this.unpdate();

        for (let r = 0; r < this.gurid.length; r++) {
            for (let c = 0; c < this.gurid[r].length; c++) {
                this.ctx.fillStyle = this.opt.colories[this.gurid[r][c]];
                let x = this.opt.blockSize * c + this.opt.span * (c + 1);
                let y = this.opt.blockSize * r + this.opt.span * (r + 1);
                let w = this.opt.blockSize;
                let h = this.opt.blockSize;
                this.ctx.fillRect(x, y, w, h);
            }
        }
        this.judgeFinish();
        this.endTime=new Date().getTime(); 
    }
}

// 更新状态函数
Tetris.prototype.unpdate = function () {
    if (this.curBlock) {
        this.curBlock.y++;
        // 存在下落的方块，就更新方块位置
        if(this.curBlock.data&&this.curBlock.data.length>0){
            let arr=this.curBlock.data;
            for(let r=0;r<arr.length;r++){
                if(arr[r]!=null&&arr[r].length){
                    for(let c=0;c<arr[r].length;c++){
                        if(arr[r][c]){
                            this.gurid[this.curBlock.y+c-1][this.curBlock.x+r]=0;
                            this.gurid[this.curBlock.y+c][this.curBlock.x+r]=this.curBlock.colorIndex;
                        }
                    }
                }else{
                    if(arr[r]){
                        this.gurid[this.curBlock.y+c-1][this.curBlock.x+r]=0;
                        this.gurid[this.curBlock.y+c][this.curBlock.x+r]=this.curBlock.colorIndex;
                    }
                }
            }
        }
    } else {
        // 不存在下落的方块，就创建下落的方块
        this.createBlock();
    }
}

// 创建下落方块
Tetris.prototype.createBlock = function () {
    this.curBlock = {
        data: null,  // 下落方块的形状
        x: 0,        // 下落方块的横向位置
        y: 0,        // 下落方块的纵向位置
        colorIndex: 0// 下落方块的颜色
    };

        this.curBlock.colorIndex = Math.floor(Math.random() * this.opt.colories.length);
        this.curBlock.colorIndex =
          this.curBlock.colorIndex === 0
            ? this.curBlock.colorIndex + 1
            : this.curBlock.colorIndex;
        this.curBlock.data = this.opt.boxShapes[
          Math.floor(Math.random() * this.opt.boxShapes.length)
        ];
        this.curBlock.x = Math.floor((this.opt.blockNum - this.curBlock.data[0].length) / 2);
        this.curBlock.y = 0;
}

// 判断方块到底底部
Tetris.prototype.judgeFinish=function(){
    if(this.curBlock){
        if(this.curBlock.data&&this.curBlock.data.length>0){
            let arr=this.curBlock.data;
            for(let r=0;r<arr.length;r++){
                if(arr[r]!=null&&arr[r].length){
                    for(let c=0;c<arr[r].length;c++){
                        if(arr[r][c]){
                            if((this.curBlock.y+c+1)==this.blockNum){
                                this.curBlock=null;
                            }
                            this.finishBlock.push((this.curBlock.y+c)+""+(this.curBlock.x+r));
                        }
                    }
                }else{
                    if(arr[r]){
                        if((this.curBlock.y+c+1)==this.blockNum){
                            this.curBlock=null;
                        }
                        this.finishBlock.push((this.curBlock.y+c)+""+(this.curBlock.x+r))
                    }
                }
            }
        }
    }
}