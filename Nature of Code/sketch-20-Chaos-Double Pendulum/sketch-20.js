const PARAMS = {
    length1: 100,
    length2: 50,
    angle1: 1.57,
    angle2: 1.57,
    mass1: 50,
    mass2: 10,
    g: 1,
    v_damping: 0.3,
    a_damping: 0.3,

    frameRate: 0,
    points1: 0,
    points2: 0,

    color1: "#215dff",
    color2: "#00aaff",
    show_rod: true,
    show_b1: true,
    show_b2: true,
    b1_trail: false,
    b2_trail: true,
    gen_trail: 400,
    pause: false,
};

let a1_v = 0,
    a2_v = 0;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    pane.registerPlugin(TweakpaneEssentialsPlugin);

    const tab = pane.addTab({
        pages: [{ title: "System" }, { title: "Optim." }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Parameters",
    });
    const folder2 = tab.pages[1].addFolder({
        title: "General",
    });

    folder1.addInput(PARAMS, "length1", {
        min: 1,
        max: 1200,
        step: 1,
    });
    folder1.addInput(PARAMS, "length2", {
        min: 1,
        max: 1200,
        step: 1,
    });

    folder1.addInput(PARAMS, "angle1", {
        min: -180,
        max: 180,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "angle2", {
        min: -180,
        max: 180,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "mass1", {
        min: 1,
        max: 500,
        step: 0.1,
    });
    folder1.addInput(PARAMS, "mass2", {
        min: 1,
        max: 500,
        step: 0.1,
    });

    folder1.addInput(PARAMS, "g", {
        min: 1,
        max: 10,
        step: 0.1,
    });
    folder1.addInput(PARAMS, "v_damping", {
        min: 0,
        max: 1,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "a_damping", {
        min: 0,
        max: 1,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "show_rod");
    folder1.addInput(PARAMS, "show_b1");
    folder1.addInput(PARAMS, "show_b2");
    folder2.addInput(PARAMS, "color1");
    folder2.addInput(PARAMS, "color2");

    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addMonitor(PARAMS, "points1", {
        view: "graph",
        min: 1,
        max: 500,
    });
    folder2.addMonitor(PARAMS, "points1", {
        label: "",
    });
    folder2.addMonitor(PARAMS, "points2", {
        view: "graph",
        min: 1,
        max: 500,
    });
    folder2.addMonitor(PARAMS, "points2", {
        label: "",
    });
    folder2.addInput(PARAMS, "gen_trail", {
        min: -200,
        max: 400,
        step: 1,
    });
    folder2.addInput(PARAMS, "b1_trail");
    folder2.addInput(PARAMS, "b2_trail");
    folder1.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    pixelDensity(1);
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);

    PARAMS.angle1 = PI / 2;
    PARAMS.angle2 = PI / 2;
    background(0);
}

let pos1 = [];
let pos2 = [];

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.gen_trail);
    translate(width / 2, height / 2);

    let n1 = -PARAMS.g * (2 * PARAMS.mass1 + PARAMS.mass2) * sin(PARAMS.angle1);
    let n2 = -PARAMS.mass2 * PARAMS.g * sin(PARAMS.angle1 - 2 * PARAMS.angle2);
    let n3 = -2 * sin(PARAMS.angle1 - PARAMS.angle2) * PARAMS.mass2;
    let n4 =
        a2_v * a2_v * PARAMS.length2 +
        a1_v * a1_v * PARAMS.length1 * cos(PARAMS.angle1 - PARAMS.angle2);
    let denominator =
        PARAMS.length1 *
        (2 * PARAMS.mass1 +
            PARAMS.mass2 -
            PARAMS.mass2 * cos(2 * PARAMS.angle1 - 2 * PARAMS.angle2));

    let a1_a = (n1 + n2 + n3 * n4) / denominator;

    n1 = 2 * sin(PARAMS.angle1 - PARAMS.angle2);
    n2 = a1_v * a1_v * PARAMS.length1 * (PARAMS.mass1 + PARAMS.mass2);
    n3 = PARAMS.g * (PARAMS.mass1 + PARAMS.mass2) * cos(PARAMS.angle1);
    n4 =
        a2_v *
        a2_v *
        PARAMS.length2 *
        PARAMS.mass2 *
        cos(PARAMS.angle1 - PARAMS.angle2);

    denominator =
        PARAMS.length2 *
        (2 * PARAMS.mass1 +
            PARAMS.mass2 -
            PARAMS.mass2 * cos(2 * PARAMS.angle1 - 2 * PARAMS.angle2));

    let a2_a = (n1 * (n2 + n3 + n4)) / denominator;

    let x1 = round(PARAMS.length1 * sin(PARAMS.angle1), 5);
    let y1 = round(PARAMS.length1 * cos(PARAMS.angle1), 5);

    let x2 = round(x1 + PARAMS.length2 * sin(PARAMS.angle2), 5);
    let y2 = round(y1 + PARAMS.length2 * cos(PARAMS.angle2), 5);

    if (PARAMS.b1_trail) {
        let p1 = createVector(x1, y1);
        pos1.push(p1);
        noFill();
        beginShape();
        PARAMS.points1 = pos1.length;
        for (let p of pos1) {
            stroke(PARAMS.color1);
            vertex(p.x, p.y);
        }
        endShape();
    }
    if (PARAMS.b2_trail) {
        let p2 = createVector(x2, y2);
        pos2.push(p2);
        PARAMS.points2 = pos2.length;
        noFill();
        beginShape();
        for (let p of pos2) {
            stroke(PARAMS.color2);
            vertex(p.x, p.y);
        }
        endShape();
    }

    noFill();
    if (PARAMS.show_rod) {
        stroke("#ffffff");
        strokeWeight(2);
        line(0, 0, x1, y1);
    }
    if (PARAMS.show_b1) {
        noStroke();
        fill(PARAMS.color1);
        circle(x1, y1, sqrt(PARAMS.mass1) * 2);
    }

    if (PARAMS.show_rod) {
        stroke("#ffffff");
        strokeWeight(2);
        line(x1, y1, x2, y2);
    }

    if (PARAMS.show_b2) {
        noStroke();
        fill(PARAMS.color2);
        circle(x2, y2, sqrt(PARAMS.mass2) * 2);
    }

    a1_v += a1_a * PARAMS.a_damping;
    a2_v += a2_a * PARAMS.a_damping;
    PARAMS.angle1 += a1_v * PARAMS.v_damping;
    PARAMS.angle2 += a2_v * PARAMS.v_damping;

    PARAMS.frameRate = floor(frameRate());
}