const PARAMS = {
    angle1: 0,
    angle2: 0,
    angleV1: 0.01,
    angleV2: 0.1,
    ampx: 200,
    ampy: 100,
};

function setup() {
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    const controlContainer = document.getElementById("controls");
    createCanvas(width, height);
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    const folder1 = pane.addFolder({
        title: "1",
    });
    const folder2 = pane.addFolder({
        title: "2",
    });
    folder1.addInput(PARAMS, "angle1", { min: 0, max: 1, step: 0.01 });
    folder1.addInput(PARAMS, "angle2", { min: 0, max: 1, step: 0.01 });
    folder1.addInput(PARAMS, "angleV1", { min: 0, max: 1, step: 0.01 });
    folder2.addInput(PARAMS, "angleV2", { min: 0, max: 1, step: 0.01 });
    folder2.addInput(PARAMS, "ampx", { min: 0, max: width / 2, step: 1 });

    background(0);
}

function draw() {
    background(0, PARAMS.oTrail);
    translate(width / 2, height / 2);
}