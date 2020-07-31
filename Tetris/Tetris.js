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
            "#FFFF00",
            "#FFFFFF",
            "#0000FF",
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
    this.canves = document.createElement("canvas");  // 创建画板
    this.canves.width =
        this.opt.blockSize * this.opt.blockNum +
        this.opt.span * (this.opt.blockNum + 1);     // 设置画板宽度
    this.canves.height =
        this.opt.blockSize * this.opt.blockNum +     // 设置画板高度
        this.opt.span * (this.opt.blockNum + 1);
    document.body.appendChild(this.canves);
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
        // 判断是否碰到网格底部或者碰到已经停止运动的方块
        if (this.judgeFinish()) {
            //碰到底部，停止运动，并记录停止的方块
            this.recordFinished();
        }
        // 记录本次动画结束的时间
        this.endTime = new Date().getTime();
    }
};

// Tetris状态更新函数（移动方块）
Tetris.prototype.unpdate = function () {
    if (this.curBlock) {
        // 存在下落的方块，就更新方块位置
        if (this.curBlock.data && this.curBlock.data.length > 0) {
            let arr = this.curBlock.data;
            for (let r = 0; r < arr.length; r++) {
                if (arr[r] != null && arr[r].length) {
                    for (let c = 0; c < arr[r].length; c++) {
                        // 清空上一行的颜色
                        if (arr[r][c]&&r===0) {
                            if (this.curBlock.y - 1 > -1) {
                                this.gurid[this.curBlock.y - 1][this.curBlock.x + c] = 0;
                            }
                        }
                        // 移动方块
                        this.gurid[this.curBlock.y + r][
                            this.curBlock.x + c
                        ] =(arr[r][c]===1?this.curBlock.colorIndex:0);
                    }
                } else {
                    // 清空上一行的颜色
                    if (arr[r]&&r===0) {
                        if (this.curBlock.y  - 1 > -1) {
                            this.gurid[this.curBlock.y - 1][this.curBlock.x + c] = 0;
                        }
                    }
                     // 移动方块
                    this.gurid[this.curBlock.y + r][
                        this.curBlock.x + c
                    ] =(arr[r][c]===1?this.curBlock.colorIndex:0);
                }
            }
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
        data: null, // 下落方块的形状
        x: 0, // 下落方块的横向位置
        y: 0, // 下落方块的纵向位置
        colorIndex: 0, // 下落方块的颜色
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