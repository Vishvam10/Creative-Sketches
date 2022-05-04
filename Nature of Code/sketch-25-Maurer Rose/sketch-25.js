const PARAMS = {
    n: 2,
    d: 29,
    m_line_wt: 0.02,
    s_line_wt: 0.2,
    m_color: "#ff7c66",
    s_color: "#ffffff",
    frameRate: 0,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    })
    folder1.addInput(PARAMS, "n", {
        min: 0,
        max: 20,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0)
    })
    folder1.addInput(PARAMS, "d", {
        min: -360,
        max: 360,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })

    folder1.addInput(PARAMS, "m_line_wt", {
        min: 0.01,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })
    folder1.addInput(PARAMS, "s_line_wt", {
        min: 0.1,
        max: 8,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })

    folder1.addInput(PARAMS, "m_color")
    folder1.addInput(PARAMS, "s_color")
    folder1.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder1.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder1.addInput(PARAMS, "pause");
};

function initalize() {}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    angleMode(DEGREES)
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return
    }
    translate(width / 2, height / 2);
    strokeWeight(PARAMS.m_line_wt);
    stroke(PARAMS.m_color);
    noFill();
    beginShape();
    for (let i = 0; i < 361; i++) {
        let k = i * PARAMS.d;
        let r = 100 * sin(PARAMS.n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);
    }
    endShape();
    strokeWeight(PARAMS.s_line_wt);
    stroke(PARAMS.s_color)
    noFill();
    beginShape();
    for (let i = 0; i < 361; i++) {
        let k = i;
        let r = 100 * sin(PARAMS.n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);
    }
    endShape();
}