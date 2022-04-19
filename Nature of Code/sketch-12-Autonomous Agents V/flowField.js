class FlowField {
    constructor(width, height, res, dir, rand_dir) {
        this.width = width;
        this.height = height;
        this.res = res;
        this.rows = parseInt(this.width / this.res);
        this.cols = parseInt(this.height / this.res);
        this.dir = dir;
        this.rand_dir = rand_dir;

        this.field = [];
        let xoff = 0;
        for (let i = 0; i < this.rows; i++) {
            let yoff = 0;
            this.field[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let theta = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
                this.field[i][j] = createVector(cos(theta), sin(theta));
                this.field[i][j].setMag(random(1, 40));
                console.log("MAG : ", this.field[i][j].mag());
                yoff += 0.1;
            }
            xoff += 0.1;
        }
    }

    lookup(pos) {
        let column = parseInt(constrain(pos.y / this.res, 0, this.cols - 1));
        let row = parseInt(constrain(pos.x / this.res, 0, this.rows - 1));

        // For wrapping
        row = (row + 1) % this.rows;
        column = (column + 1) % this.cols;

        return this.field[row][column].copy();
    }

    show(diagram = true) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let x = i * this.res;
                let y = j * this.res;
                stroke(255, 255, 255, 50);
                noFill();
                rect(x, y, this.res, this.res);
                fill(255, 255, 255, 50);

                let base = createVector(x + this.res / 2, y + this.res / 2);
                let mag = this.field[i][j].mag();

                let intensity = round(map(mag, 0, 40, 255, 0), 0);
                let color = `rgb(255,${intensity},0)`;
                drawForce(base, this.field[i][j], color, 3, diagram);
            }
        }
    }
}