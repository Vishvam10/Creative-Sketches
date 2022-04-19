class FlowField {
    constructor(width, height, res, force_limit, inc = { x: 0.01, y: 0.01 }) {
        this.width = width;
        this.height = height;
        this.res = res;
        this.rows = parseInt(this.width / this.res);
        this.cols = parseInt(this.height / this.res);

        this.force_limit = force_limit;
        this.inc = inc;

        this.field = [];

        let xoff = 0;
        for (let i = 0; i < this.rows; i++) {
            let yoff = 0;
            this.field[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let theta = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
                this.field[i][j] = createVector(cos(theta), sin(theta));
                this.field[i][j].setMag(random(1, this.force_limit));
                yoff += this.inc.y;
            }
            xoff += this.inc.x;
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

    show(diagram = true, color_scheme = "R") {
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
                let color;
                if (color_scheme == "R") {
                    color = `rgb(255,${intensity},0)`;
                } else if (color_scheme == "G") {
                    color = `rgb(${intensity},255,0)`;
                } else if (color_scheme == "B") {
                    color = `rgb(0,${intensity},255)`;
                }
                drawForce(base, this.field[i][j], color, this.res / 10, diagram);
            }
        }
    }
}