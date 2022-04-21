const PARAMS = {
    pause: false,
    width: 1200,
    height: 1200,
    resolution: 16,
    color1: "#004e53",
    color2: "#ffffff",
    spacing: 1,
    stroke: true,
};

var ca;
var width, height;
var res = 10;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Grid",
    });
    const folder2 = pane.addFolder({
        title: "General",
    });

    folder1
        .addInput(PARAMS, "height", {
            min: 200,
            max: 1200,
            step: 1,
        })
        .on("change", (ev) => {
            clear();
            background(0);
            createCA(ev.value, PARAMS.height, PARAMS.resolution);
        });
    folder1
        .addInput(PARAMS, "width", {
            min: 200,
            max: 1200,
            step: 1,
        })
        .on("change", (ev) => {
            clear();
            background(0);
            createCA(PARAMS.width, ev.value, PARAMS.resolution);
        });
    folder1
        .addInput(PARAMS, "resolution", {
            min: 2,
            max: 20,
            step: 1,
        })
        .on("change", (ev) => {
            clear();
            background(0);
            createCA(PARAMS.width, PARAMS.height, ev.value);
        });
    folder1
        .addInput(PARAMS, "spacing", {
            min: 1,
            max: 16,
            step: 0.1,
        })
        .on("change", (ev) => {
            clear();
            background(0);
            createCA(PARAMS.width, PARAMS.height, PARAMS.resolution, ev.value);
        });

    folder1.addInput(PARAMS, "stroke");
    folder1.addInput(PARAMS, "color1");
    folder1.addInput(PARAMS, "color2");

    folder2.addInput(PARAMS, "pause");
};

function createGrid(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function createCA(width, height, res, spacing = 1) {
    ca = new CA(width, height, res, spacing);
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    // noLoop();
    background(0);
    createCA(PARAMS.width, PARAMS.height, PARAMS.resolution);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    let next = createGrid(width, height, res);

    ca.show(PARAMS.color1, PARAMS.color2, PARAMS.stroke);
    ca.update(next);
}