const PARAMS = {
    init_len: 200,
    ang_fact: -0.16,
    line_wt: 0.6,
    branches: 6,
    cutoff: 8.72,
    dec_fact: 0.48,
    show_branch: true,
    show_tip: true,
    tip_fact: 0.01,
    br_color: "rgb(0, 255, 97)",
    tip_color: "rgb(255, 255, 255)",
    pause: false,
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
        title: "Tree Properties",
    });
    const folder2 = pane.addFolder({
        title: "Branch Properties",
    });
    const folder3 = pane.addFolder({
        title: "General",
    });
    folder1.addInput(PARAMS, "init_len", { min: 5, max: 400, step: 1 });
    folder1.addInput(PARAMS, "line_wt", { min: 0.1, max: 4, step: 0.01 });
    folder1.addInput(PARAMS, "ang_fact", { min: -2, max: 2, step: 0.01 });

    folder2.addInput(PARAMS, "branches", { min: 1, max: 10, step: 1 });
    folder2.addInput(PARAMS, "cutoff", { min: 1, max: 10, step: 0.01 });
    folder2.addInput(PARAMS, "dec_fact", { min: 0.1, max: 0.7, step: 0.01 });
    folder2.addInput(PARAMS, "show_branch");
    folder2.addInput(PARAMS, "show_tip");
    folder2.addInput(PARAMS, "tip_fact", { min: 0.01, max: 1, step: 0.001 });

    folder2.addInput(PARAMS, "br_color");
    folder2.addInput(PARAMS, "tip_color");

    folder3.addInput(PARAMS, "pause");

    background(0);
}

function branch(len) {
    if (len > PARAMS.cutoff) {
        for (let i = 1; i <= PARAMS.branches; i++) {
            push();
            let sw = (PARAMS.line_wt * len) / 400;
            if (!PARAMS.show_branch) {
                sw = 0;
            }
            stroke(PARAMS.br_color);
            strokeWeight(sw);
            line(0, 0, 0, -len);
            translate(0, -len);
            let a = (360 / PARAMS.branches) * i;
            if (i % 2 == 0) {
                a = -a;
            }
            a = constrain(a * PARAMS.ang_fact, -90, 90);
            rotate(a);
            branch(len * PARAMS.dec_fact);
            pop();
        }
    } else {
        if (PARAMS.show_tip) {
            fill(PARAMS.tip_color);
            circle(len, len, len * PARAMS.tip_fact);
        }
    }
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    angleMode(DEGREES);
    stroke(255);
    translate(width / 2, height);
    branch(PARAMS.init_len);
}