const PARAMS = {
    order: 7,
    line_wt: 1,
    color: "#ffffff",
    rainbow: false,
    animate: true,
    speed: 1,
    frameRate: 0,
    pause: false,
};

var n = Math.pow(2, PARAMS.order)
var total = n * n

var paths = []

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    })

    folder1.addInput(PARAMS, "order", {
        min: 1,
        max: 10,
        step: 1,
    }).on("change", (ev) => {
        n = Math.pow(2, PARAMS.order);
        total = n * n
        paths = []
        clear();
        background(0);
        initalize();
    });;
    folder1.addInput(PARAMS, "line_wt", {
        min: 1,
        max: 10,
        step: 0.1,
    });
    folder1.addInput(PARAMS, "color")
    folder1.addInput(PARAMS, "rainbow")
    folder1.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder1.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder1.addInput(PARAMS, "animate").on("change", (ev) => {
        clear();
        background(0);
    });
    folder1.addInput(PARAMS, "speed", {
        min: 1,
        max: 50,
        step: 1,
    });
    folder1.addInput(PARAMS, "pause");
};


/*
    .
    .       0(0,0)                   3(1,0)
    .       |                       |
    .       |                       |
    .       |                       |
    .       |                       |
    .       |                       |
    .       |                       |
    .       |                       |
    .       _ __ __ __ __ __ __ __ _
    .       1(0,1)                  2(1,1)
    
*/

function hilbert(i) {
    let points = [];
    let len = PARAMS.order
    points.push(new createVector(0, 0));
    points.push(new createVector(0, 1));
    points.push(new createVector(1, 1));
    points.push(new createVector(1, 0));


    let index = i & 3;
    let v = points[index];

    for (let j = 1; j < PARAMS.order; j++) {
        i = i >>> 2;
        index = i & 3;
        len = Math.pow(2, j)
        if (index == 0) {
            let temp = v.x;
            v.x = v.y;
            v.y = temp;
        } else if (index == 1) {
            v.y += len;
        } else if (index == 2) {
            v.x += len;
            v.y += len;
        } else if (index == 3) {
            let temp = len - 1 - v.x;
            v.x = len - 1 - v.y;
            v.y = temp;
            v.x += len;
        }
    }

    return v;
}

function initalize() {
    paths = []
    for (let i = 0; i < total; i++) {
        paths[i] = hilbert(i);
        let len = width / n;
        paths[i].mult(len);
        paths[i].add(len / 2, len / 2)
    }
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    initalize();
}

let counter = 0

function draw() {
    if (PARAMS.pause) {
        return;
    }
    console.log(paths);
    background(0);
    noFill();
    stroke(PARAMS.color);
    strokeWeight(PARAMS.line_wt);
    if (PARAMS.animate) {
        for (let i = 1; i < counter; i++) {
            if (PARAMS.rainbow) {
                colorMode(HSB, 360, 255, 255);
                let h = map(i, 0, paths.length, 0, 360);
                stroke(h, 255, 255);
            }
            line(paths[i].x, paths[i].y, paths[i - 1].x, paths[i - 1].y)
        }
        counter += PARAMS.speed;
        if (counter >= paths.length) {
            counter = 0
        }
    } else {
        beginShape();
        for (let i = 0; i < paths.length; i++) {
            if (PARAMS.rainbow) {
                colorMode(HSB, 360, 255, 255);
                let h = map(i, 0, paths.length, 0, 360);
                stroke(h, 255, 255);
            }
            vertex(paths[i].x, paths[i].y)
        }
        endShape();
    }
    PARAMS.frameRate = floor(frameRate())
}