const PARAMS = {
    angle1: 0,
    angle2: 0,
    angleV1: 0.01,
    angleV2: 0.1,
    ampx: 200,
    ampy: 100,
    oTrail: 100,
};

function setup() {
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    const controlContainer = document.getElementById("controls");
    createCanvas(width, height);
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    pane.addInput(PARAMS, "angle1", { min: 0, max: 1, step: 0.01 });
    pane.addInput(PARAMS, "angle2", { min: 0, max: 1, step: 0.01 });
    pane.addInput(PARAMS, "angleV1", { min: 0, max: 1, step: 0.01 });
    pane.addInput(PARAMS, "angleV2", { min: 0, max: 1, step: 0.01 });
    pane.addInput(PARAMS, "ampx", { min: 0, max: width / 2, step: 1 });
    pane.addInput(PARAMS, "ampy", { min: 0, max: height / 2, step: 1 });
    pane.addInput(PARAMS, "oTrail", { min: 0, max: 200, step: 1 });

    background(0);
}

function draw() {
    background(0, PARAMS.oTrail);
    translate(width / 2, height / 2);
    fill("rgb(0,255,255)");
    stroke("rgb(0,255,255)");
    let x = map(sin(PARAMS.angle1), -1, 1, -PARAMS.ampx, PARAMS.ampx);
    let y = map(sin(PARAMS.angle2), -1, 1, -PARAMS.ampy, PARAMS.ampy);
    strokeWeight(2);
    line(0, 0, x, y);
    circle(x, y, 16);
    PARAMS.angle1 += PARAMS.angleV1;
    PARAMS.angle2 += PARAMS.angleV2;
}