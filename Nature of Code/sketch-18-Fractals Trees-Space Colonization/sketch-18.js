const PARAMS = {
    minVal: -2.5,
    maxVal: 2.5,
    max_iter: 100,
    frameRate: 0,
    branches: 1,
    pause: false,
    generation: 0,
};

var tree;

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
    folder1.addInput(PARAMS, "minVal", {
        min: -10,
        max: 10,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "maxVal", {
        min: -10,
        max: 10,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "max_iter", {
        min: 1,
        max: 300,
        step: 1,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addMonitor(PARAMS, "branches", {
        view: "graph",
        min: 10,
        max: 1000,
    });
    folder2.addMonitor(PARAMS, "branches", {
        label: "",
    });
    folder2.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    tree = new Tree();
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    tree.show();
    tree.grow();
    PARAMS.frameRate = floor(frameRate());
    PARAMS.branches = floor(tree.branches.length / 100);
}