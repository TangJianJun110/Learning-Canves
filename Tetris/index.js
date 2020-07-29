var Tetris = {
    gurid: [],
    canves: null,
    ctx: null,
    size: 40,  // 网格大小px
    num: 20,   // 网格个数
    span: 2,   // 网格边框大小px
    colories: ["#000000", "#FFFFFF", "#FF0000", "#FFFF00", "#00FF00", "#0000FF", "#00FFFF"],
    defaultBlock: [
        [
            [0, 1, 0],
            [1, 1, 1]
        ],
        [
            [0, 0, 0],
            [1, 1, 1]
        ],
        [
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 1]
        ]
    ],
    curBlock: null,
    init(id) {
        // this.canves=document.getElementById(id);
        // this.ctx=this.canves.getContext('2d');
        this.createMap();
    },
    // 创建网格
    createMap() {
        this.canves = document.createElement('canvas');
        this.canves.width = this.size * this.num + this.span * (this.num + 1);
        this.canves.height = this.size * this.num + this.span * (this.num + 1);
        document.body.appendChild(this.canves);
        this.ctx = this.canves.getContext('2d');
        for (let i = 0; i < this.num; i++) {
            this.gurid[i] = [];
            for (let j = 0; j < this.num; j++) {
                this.gurid[i][j] = 0;
            }
        }
        this.render();
    },
    drawBlock() {
        // 创建Block
        this.curBlock = {};
        this.curBlock.color = this.colories[Math.random() * this.colories.length];
        this.curBlock.data = this.defaultBlock[Math.random() * this.defaultBlock.length];
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
                debugger;
                this.ctx.fillRect(x, y, w, h);
            }
        }
    }
};


window.addEventListener('load', function () {
    Tetris.init('ctx');
})
