// Tetris构造函数
function Tetris(options) {
    this.opt = {
        speed: 0.5,    // 方块下落速度
        blockSize: 40, // 网格宽高
        blockNum: 20,  // 网格数量
        span: 2,       // 网格边框
        colories:      // 颜色列表
            [
                "#000000",
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FFFFFF",
                "#00FFFF",
                "#FF00FF"
            ],
        boxShapes:  // 方块类型
            [
                // 土字型方块
                [
                    [0, 1, 0],
                    [1, 1, 1],
                ],
                // 条形方块
                [[1, 1, 1, 1]],
                // 左折型方块
                [
                    [1, 1, 0],
                    [0, 1, 1],
                ],
                // 右折型方块
                [
                    [0, 1, 1],
                    [1, 1, 0],
                ],
                // 倒左勾型方块
                [
                    [1, 0, 0],
                    [1, 1, 1],
                ],
                // 正左勾型方块
                [
                    [1, 1, 1],
                    [1, 0, 0],
                ],
                // 倒右勾型方块
                [
                    [0, 0, 1],
                    [1, 1, 1],
                ],
                // 正右勾型方块
                [
                    [1, 1, 1],
                    [0, 0, 1],
                ],
            ],
    };
    // 用户传入的参数覆盖默认参数
    for (let k in options) {
        this.opt[k] = options[k];
    }

    if(!this.opt.container){
        console.log(`container is required`);
        return;
    }

    this.endTime = 0;      // 动画上次播放结束时间
    this.canves = null;    // 画板
    this.ctx = null;       // 画笔
    this.gurid = [];       // 网格数组（数组元素的值代表绘制的网格颜色）
    this.finishBlock = []; // 记录完成的网格位置
    this.curBlock = null;  // 当前移动的滑块
    this.init();           // 初始化
}

// Tetris状态初始化函数
Tetris.prototype.init = function () {
    let parent=document.getElementById(this.opt.container);
    let maxHeight=parent.clientHeight;
    this.opt.blockNum=Math.floor((maxHeight - this.opt.span) / (this.opt.blockSize + this.opt.span));  // 计算方格数量
    
    this.canves = document.createElement("canvas");  // 创建画板
    this.canves.width =
        this.opt.blockSize * this.opt.blockNum +
        this.opt.span * (this.opt.blockNum + 1);     // 设置画板宽度
    this.canves.height =
        this.opt.blockSize * this.opt.blockNum +     // 设置画板高度
        this.opt.span * (this.opt.blockNum + 1);
    parent.appendChild(this.canves);
    
    this.ctx = this.canves.getContext("2d");         // 创建画笔

    // 初始化网格
    for (let i = 0; i < this.opt.blockNum; i++) {
        this.gurid[i] = [];
        for (let j = 0; j < this.opt.blockNum; j++) {
            this.gurid[i][j] = 0;                    // 网格默认颜色为0
        }
    }
    this.render();                                   // 开始渲染
};

// Tetris渲染函数
Tetris.prototype.render = function () {

    requestAnimationFrame(this.render.bind(this));   // 执行渲染

    // 记录当前时间
    let curTime = new Date().getTime();

    // 通过判断两次动画的时间间隔来控制播放速度
    if (curTime - this.endTime > this.opt.speed * 1000) {
        // 更新方块运动位置
        this.unpdate();

        // 绘制表格
        this.draw();

        // 记录本次动画结束的时间
        this.endTime = new Date().getTime();
    }
};

// Tetris表格绘制函数
Tetris.prototype.draw = function () {
    if(this.gurid){
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
    }
    // 判断是否碰到网格底部或者碰到已经停止运动的方块
    if (this.judgeFinish()) {
        //碰到底部，停止运动，并记录停止的方块
        this.recordFinished();
    }
}

// Tetris状态更新函数（移动方块）
Tetris.prototype.unpdate = function () {
    if (this.curBlock) {
        this.clearBeforeBlock();
        // 存在下落的方块，就更新方块位置
        if (this.curBlock.data && this.curBlock.data.length > 0) {
            let arr = this.curBlock.data;
            for (let r = 0; r < arr.length; r++) {
                if (arr[r] != null && arr[r].length) {
                    for (let c = 0; c < arr[r].length; c++) {
                        if (arr[r][c]) {
                            // 移动方块
                            this.gurid[this.curBlock.y + r][
                                this.curBlock.x + c
                            ] = this.curBlock.colorIndex;
                        }
                    }
                } else {
                    // 清空上一行的颜色
                    if (arr[r]) {
                        // 移动方块
                        this.gurid[this.curBlock.y + r][
                            this.curBlock.x + c
                        ] = this.curBlock.colorIndex;
                    }
                }
            }
            // 下落前记录下落前的位置
            this.curBlock.oldy = this.curBlock.y;
            this.curBlock.oldx = this.curBlock.x;
            // 下落一行
            this.curBlock.y++;
        }
    } else {
        // 不存在下落的方块，就创建下落的方块
        this.createBlock();
    }
};

// Tetris创建下落方块
Tetris.prototype.createBlock = function () {
    this.curBlock = {
        data: null,    // 运动方块的形状
        x: 0,          // 运动方块的当前位置的横向位置
        y: 0,          // 运动方块的当前位置的纵向位置
        oldx: 0,        // 运动方块的前一个位置的横向坐标
        oldy: 0,        // 运动方块的前一个位置的纵向坐标
        colorIndex: 0, // 运动方块的颜色
    };

    // 获取方块的随机颜色
    this.curBlock.colorIndex = Math.floor(
        Math.random() * this.opt.colories.length
    );

    // 方块不能是黑色
    this.curBlock.colorIndex =
        this.curBlock.colorIndex === 0
            ? this.curBlock.colorIndex + 1
            : this.curBlock.colorIndex;

    // 设置方块的形状
    this.curBlock.data = this.opt.boxShapes[
        Math.floor(Math.random() * this.opt.boxShapes.length)
    ];

    // 设置方块的左上角横坐标
    this.curBlock.x = Math.floor(
        (this.opt.blockNum - this.curBlock.data[0].length) / 2
    );

    // 设置方块的左上角的纵坐标
    this.curBlock.y = 0;
};

// 清除移动之前位置的方块
Tetris.prototype.clearBeforeBlock = function () {
    if (this.curBlock) {
        if (this.curBlock.data && this.curBlock.data.length > 0) {
            let arr = this.curBlock.data;
            for (let r = 0; r < arr.length; r++) {
                if (arr[r] != null && arr[r].length) {
                    for (let c = 0; c < arr[r].length; c++) {
                        if (arr[r][c]) {
                            this.gurid[this.curBlock.oldy + r][
                                this.curBlock.oldx + c
                            ] = 0;
                        }
                    }
                } else {
                    if (arr[r]) {
                        this.gurid[this.curBlock.oldy + r][
                            this.curBlock.oldx + c
                        ] = 0;
                    }
                }
            }
        }
    }
}

// Tetris判断方块到底底部
Tetris.prototype.judgeFinish = function () {
    if (this.curBlock) {
        if (this.curBlock.data && this.curBlock.data.length > 0) {
            let arr = this.curBlock.data;
            for (let r = 0; r < arr.length; r++) {
                if (arr[r] != null && arr[r].length) {
                    for (let c = 0; c < arr[r].length; c++) {
                        if (arr[r][c]) {
                            // 方块到底底部
                            if (this.curBlock.y + r + 1 > this.opt.blockNum) {
                                return true;
                            }

                            // 方块碰到已经停止的方块
                            let guid = this.curBlock.y + r + 1 + "" + (this.curBlock.x + c);
                            if (this.finishBlock.indexOf(guid) > -1) {
                                return true;
                            }
                        }
                    }
                } else {
                    if (arr[r]) {
                        // 方块到底底部
                        if (this.curBlock.y + r + 1 > this.opt.blockNum) {
                            return true;
                        }
                        // 方块碰到已经停止的方块
                        let guid = this.curBlock.y + r + 1 + "" + (this.curBlock.x + c);
                        if (this.finishBlock.indexOf(guid) > -1) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

// Tetris记录已经到达底部完成移动的方块（记录编号（x+y））
Tetris.prototype.recordFinished = function () {
    if (this.curBlock) {
        if (this.curBlock.data && this.curBlock.data.length > 0) {
            let arr = this.curBlock.data;
            for (let r = 0; r < arr.length; r++) {
                if (arr[r] != null && arr[r].length) {
                    for (let c = 0; c < arr[r].length; c++) {
                        if (arr[r][c]) {
                            this.finishBlock.push(
                                this.curBlock.y + r + "" + (this.curBlock.x + c)
                            );
                        }
                    }
                } else {
                    if (arr[r]) {
                        this.finishBlock.push(
                            this.curBlock.y + r + "" + (this.curBlock.x + c)
                        );
                    }
                }
            }
        }
        // 置空当前方块
        this.curBlock = null;
    }
}

// Tetris运动方块向左移动n格(默认移动一格)
Tetris.prototype.moveLeft = function (n) {
    let step = Number(n) || 1;
    if (this.curBlock) {
        if ((this.curBlock.x - step) < 0) {
            console.log(`方块已经无法向左移动${step}格`);
            return;
        }
        this.curBlock.oldx = this.curBlock.x;
        this.curBlock.x = this.curBlock.x - step;
        // 判断是否碰撞
        if(this.judgeFinish()){
            this.curBlock.x=this.curBlock.oldx;
            return;
        }
        // 立刻更新网格
        this.unpdate();
        this.draw();
    }
}

// Tetris运动方块向右移动n格(默认移动一格)
Tetris.prototype.moveRight = function (n) {
    let step = Number(n) || 1;
    if (this.curBlock) {
        if ((this.curBlock.x + (this.curBlock.data[0].length - 1) + step) > (this.opt.blockNum - 1)) {
            console.log(`方块已经无法向右移动${step}格`);
            return;
        }
        this.curBlock.oldx = this.curBlock.x;
        this.curBlock.x = this.curBlock.x + step;

        // 判断是否碰撞
        if(this.judgeFinish()){
            this.curBlock.x=this.curBlock.oldx;
            return;
        }
        // 立刻更新网格
        this.unpdate();
        this.draw();
    }
}

// Tetris运行方块减速
Tetris.prototype.raiseUp = function (speed) {
    this.opt.speed = this.opt.speed - (speed || 0.5);
    this.opt.speed = (this.opt.speed < 0 ? 0 : this.opt.speed);
}

// Tetris运动方块加速
Tetris.prototype.slowDown = function (speed) {
    this.opt.speed = this.opt.speed + (speed || 0.5);
}