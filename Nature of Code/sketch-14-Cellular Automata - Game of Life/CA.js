class CA {
    constructor(width, height, res) {
        this.grid = [];
        this.width = width;
        this.height = height;
        this.res = res;
        this.rows = parseInt(this.width / this.res);
        this.cols = parseInt(this.height / this.res);

        for (let i = 0; i < this.cols; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = floor(random(2));
            }
        }
    }
    show() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let x = i * this.res;
                let y = j * this.res;
                if (this.grid[i][j] == 0) {
                    fill(0, 0, 255);
                } else {
                    fill(255);
                }
                stroke(0);
                strokeWeight(0.5);
                rect(x, y, this.res - 1, this.res - 1);
            }
        }
    }
    countNeighbours(x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let c = (x + i + this.cols) % this.cols;
                let r = (y + j + this.rows) % this.rows;
                sum += this.grid[c][r];
            }
        }
        sum -= this.grid[x][y];
        return sum;
    }
    update(next) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                let state = this.grid[i][j];
                let neighbours = this.countNeighbours(i, j);
                if (state == 0 && neighbours == 3) {
                    next[i][j] = 1;
                } else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        this.grid = next;
    }
}