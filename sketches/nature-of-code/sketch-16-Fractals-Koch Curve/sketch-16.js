const PARAMS = {
    pause: false,
    generation: 0,
};

let segments = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder = pane.addFolder({
        title: "Grid",
    });
    folder
        .addButton({
            title: "Next",
            label: "Generation", // optional
        })
        .on("click", () => {
            PARAMS.generation += 1;
            updateGeneration();
        });
    folder.addMonitor(PARAMS, "generation");
    folder.addInput(PARAMS, "pause");
};

function addAll(arr, list) {
    for (let s of arr) {
        list.push(s);
    }
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    let a = createVector(0, height / 2);
    let b = createVector(width, height / 2);
    let s1 = new Koch(a, b);

    let len = p5.Vector.dist(a, b);
    let h = (len * sqrt(3)) / 2;
    let c = createVector(width / 2, h / 2);

    let s2 = new Koch(b, c);
    let s3 = new Koch(c, a);
    segments.push(s1);
    segments.push(s2);
    segments.push(s3);
}

function updateGeneration() {
    let nextGeneration = [];

    for (let s of segments) {
        let children = s.generate();
        addAll(children, nextGeneration);
    }
    segments = nextGeneration;
}

function draw() {
    translate(0, -height / 4);
    background(0);

    stroke(255);
    for (let s of segments) {
        s.show();
    }
}