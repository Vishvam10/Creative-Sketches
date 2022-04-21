const PARAMS = {
    pause: false,
};

var ca;
var width, height;
var res = 10;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder = pane.addFolder({
        title: "Grid",
    });

    folder.addInput(PARAMS, "pause");
};

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function createGrid(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function createCA(width, height, res) {
    console.log(height);
    ca = new CA(width, height, res);
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    // noLoop();
    background(0);
    createCA(windowHeight, height, res);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    let next = createGrid(width, height, res);

    ca.show();
    ca.update(next);
}