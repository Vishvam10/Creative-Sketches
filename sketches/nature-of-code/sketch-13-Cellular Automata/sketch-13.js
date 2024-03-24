const PARAMS = {
    pause: false,
};

var ca;
var width, height;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder = pane.addFolder({
        title: "Flow Field",
    });

    folder.addInput(PARAMS, "pause");
};

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function doubleClicked() {
    if (mouseX < width && mouseY < height) {}
}

function createCA(n, rules, width) {
    ca = new CA(n, rules, width);
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    let rules = [0, 1, 0, 1, 1, 0, 1, 0];
    let wc = 1;
    createCA(rules, width, wc);
    // noLoop();
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    translate(0, height);
    ca.show();
    if (ca.gen < height / ca.wc) {
        console.log(height / ca.wc);
        ca.update();
    }
}