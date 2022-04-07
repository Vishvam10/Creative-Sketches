const params = {
    leftProb: 0.5,
    upProb: 0.5,
    radius: 4,
};

const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;

    folder = pane.addFolder({ title: "Grid" });
    folder.addInput(params, "leftProb", { min: 0, max: 1, step: 0.01 });
    folder.addInput(params, "upProb", { min: 0, max: 1, step: 0.01 });
    folder.addInput(params, "radius", { min: 1, max: 32 });
};

class Vector {
    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    norm() {
        this.x = this.x / this.mag();
        this.y = this.y / this.mag();
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    mult(value) {
        this.x *= value;
        this.y *= value;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    div(value) {
        this.x /= value;
        this.y /= value;
    }
    dist(v) {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y)
        );
    }
}

let pause;

function checkLoop() {
    if (!this.checked()) {
        loop();
    } else {
        noLoop();
    }
}

function setup() {
    createPane();
    createCanvas(400, 400);
    pause = createCheckbox("Pause", false);
    pause.changed(checkLoop);
    background(220);
}

function draw() {
    console.log("Drawing . . .");
}