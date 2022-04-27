const PARAMS = {
    radius: 1,
    angle: 137.5,
    scale: 3,
    dots: 0,
    frameRate: 0,
    pause: false,
};

let segments = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    });
    const folder2 = pane.addFolder({
        title: "General",
    });

    folder1.addInput(PARAMS, "radius", {
        min: 1,
        max: 40,
        step: 0.1,
    });
    folder1.addInput(PARAMS, "angle", {
        min: -180,
        max: 180,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "scale", {
        min: 1,
        max: 10,
        step: 0.01,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    angleMode(DEGREES);
    createCanvas(width, height);
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    translate(width / 2, height / 2);
    let theta = PARAMS.dots * PARAMS.angle;
    let radius = PARAMS.scale * sqrt(PARAMS.dots);

    let x = radius * cos(theta);
    let y = radius * sin(theta);

    noStroke();
    let r = (abs(map(y, 0, height, 0, 255)) * 20) % 255;
    let b = (abs(map(x, 0, width, 0, 255)) * 20) % 255;
    fill(r, 255, b);
    circle(x, y, 2 * PARAMS.radius);

    PARAMS.frameRate = floor(frameRate());
    PARAMS.dots++;
}