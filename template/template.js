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