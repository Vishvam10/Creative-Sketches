const PARAMS = {
    x: 0.1,
    y: 0,
    z: 0,
    dt: 0.01,
    sigma: 10,
    rho: 28,
    beta: 8.0 / 3.0,
    damping: 2,

    frameRate: 0,
    optimize: true,
    freq: 2,

    color: "#6200ff",
    rainbow: true,
    show_p: true,
    p_trail: true,
    p_t_wt: 1,
    gen_trail: 400,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    pane.registerPlugin(TweakpaneEssentialsPlugin);

    const tab = pane.addTab({
        pages: [{ title: "System" }, { title: "Appear." }, { title: "Opt." }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Parameters",
    });
    const folder2 = tab.pages[1].addFolder({
        title: "General",
    });
    const folder3 = tab.pages[2].addFolder({
        title: "Optimization",
    });

    folder1.addInput(PARAMS, "dt", {
        min: 0.001,
        max: 0.5,
        step: 0.0001,
    });
    folder1.addInput(PARAMS, "x", {
        min: 0,
        max: 50,
        step: 0.001,
    });
    folder1.addInput(PARAMS, "y", {
        min: 0,
        max: 50,
        step: 0.001,
    });

    folder1.addInput(PARAMS, "z", {
        min: 0,
        max: 50,
        step: 0.001,
    });
    folder1.addInput(PARAMS, "sigma", {
        min: 0,
        max: 50,
        step: 0.001,
    });
    folder1.addInput(PARAMS, "rho", {
        min: 0,
        max: 50,
        step: 0.001,
    });
    folder1.addInput(PARAMS, "beta", {
        min: 0,
        max: 50,
        step: 0.001,
    });

    folder1.addInput(PARAMS, "damping", {
        min: 1,
        max: 10,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "show_p");
    folder1.addInput(PARAMS, "pause");

    folder2.addInput(PARAMS, "color");
    folder2.addInput(PARAMS, "rainbow");

    folder3.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder3.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder3.addInput(PARAMS, "optimize");
    folder3.addInput(PARAMS, "freq", {
        min: 2,
        max: 10,
        step: 1,
    });

    folder2
        .addBlade({
            view: "list",
            label: "trail_ch",
            options: [
                { text: "line", value: "line" },
                { text: "points", value: "points" },
            ],
            value: "line",
        })
        .on("change", (ev) => {
            trail_type = ev.value;
        });
    folder2.addInput(PARAMS, "p_trail");
    folder2.addInput(PARAMS, "p_t_wt", {
        min: 0.1,
        max: 20,
        step: 0.01,
    });
    folder2
        .addButton({
            title: "clear",
            label: "p_trail",
        })
        .on("click", () => {
            clear();
            background(0);
            pos = [];
        });
};

function setup() {
    createPane();
    pixelDensity(1);
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height, WEBGL);
    background(0);
}

var pos = [];
var trail_type = "line";

function mousePressed() {
    console.log("PRESSED : ", mouseX, mouseY);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    scale(5);

    let dt = PARAMS.dt;
    let dx = PARAMS.sigma * (PARAMS.y - PARAMS.x) * dt;
    let dy = (PARAMS.x * (PARAMS.rho - PARAMS.z) - PARAMS.y) * dt;
    let dz = (PARAMS.x * PARAMS.y - PARAMS.beta * PARAMS.z) * dt;

    PARAMS.x = PARAMS.x + dx;
    PARAMS.y = PARAMS.y + dy;
    PARAMS.z = PARAMS.z + dz;

    let hue = 0;

    if (PARAMS.p_trail) {
        if (PARAMS.optimize) {
            if (frameCount % PARAMS.freq == 0) {
                let p1 = new p5.Vector(PARAMS.x, PARAMS.y, PARAMS.z);
                pos.push(p1);
            }
        } else {
            let p1 = new p5.Vector(PARAMS.x, PARAMS.y, PARAMS.z);
            pos.push(p1);
        }
        noFill();
        if (trail_type == "line") {
            beginShape();
            for (let p of pos) {
                console.log(hue);
                if (PARAMS.rainbow) {
                    colorMode(HSB);
                    stroke(hue, 255, 255);
                    strokeWeight(PARAMS.p_t_wt);
                    vertex(p.x, p.y, p.z);
                } else {
                    stroke(PARAMS.color);
                    strokeWeight(PARAMS.p_t_wt);
                    vertex(p.x, p.y, p.z);
                }
                hue += 1;
                if (hue > 255) {
                    hue = 0;
                }
            }
            endShape();
        } else {
            for (let p of pos) {
                if (PARAMS.rainbow) {
                    colorMode(HSB);
                    stroke(hue, 255, 255);
                    strokeWeight(PARAMS.p_t_wt);
                    point(p.x, p.y, p.z);
                } else {
                    stroke(PARAMS.color);
                    strokeWeight(PARAMS.p_t_wt);
                    point(p.x, p.y, p.z);
                }
                hue += 1;
                if (hue > 255) {
                    hue = 0;
                }
            }
        }
    }

    PARAMS.frameRate = floor(frameRate());
}