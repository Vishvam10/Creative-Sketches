const PARAMS = {
    lifespan: 255,
    decay_rate: 1,

    rand_mass: false,
    mass: 400,
    mass_range: 400,

    rand_radius: false,
    radius: 4,
    radius_range: 100,

    gravity: {
        x: 0,
        y: 0.4,
    },

    oTrail: 24,
    pause: false,
    color: "#ff0023",
};

let ps = [];
let ax = 0,
    ay = 0;
const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const tab = pane.addTab({
        pages: [{ title: "Parameters" }, { title: "Others" }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Particle",
    });
    const folder2 = tab.pages[0].addFolder({
        title: "Particle System",
    });

    const folder3 = tab.pages[0].addFolder({
        title: "General",
    });
    const folder4 = tab.pages[1].addFolder({
        title: "Defaults",
    });
    const folder5 = tab.pages[1].addFolder({
        title: "Preferences",
    });

    folder1.addInput(PARAMS, "lifespan", { min: 50, max: 1000, step: 1 });
    folder1.addInput(PARAMS, "decay_rate", { min: 0.01, max: 10, step: 0.001 });
    folder2.addInput(PARAMS, "gravity", {
        x: { min: -1, max: 1 },
        y: { min: -1, max: 1 },
    });
    folder2.addInput(PARAMS, "rand_mass").on("change", (ev) => {
        if (ev.value) {
            mass_range.disabled = false;
        } else {
            mass_range.disabled = true;
        }
    });
    const mass_range = folder2.addInput(PARAMS, "mass_range", {
        min: 50,
        max: 800,
        step: 1,
    });
    folder2.addInput(PARAMS, "rand_radius").on("change", (ev) => {
        if (ev.value) {
            radius_range.disabled = false;
        } else {
            radius_range.disabled = true;
        }
    });
    const radius_range = folder2.addInput(PARAMS, "radius_range", {
        min: 1,
        max: 16,
        step: 0.1,
    });

    folder3.addInput(PARAMS, "oTrail", { min: -200, max: 400, step: 1 });
    folder3.addInput(PARAMS, "pause");

    folder4.addInput(PARAMS, "mass", {
        min: 50,
        max: 800,
        step: 1,
    });
    folder4.addInput(PARAMS, "radius", {
        min: 1,
        max: 16,
        step: 0.1,
    });
    folder5.addInput(PARAMS, "color");
};

function doubleClicked() {
    if (mouseX < width && mouseY < height) {
        ps.push(new ParticleSystem(mouseX, mouseY, PARAMS.gravity));
    }
}

function setup() {
    createPane();
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    background(0);
    ps.push(new ParticleSystem(width / 2, 100, PARAMS.gravity));
    // noLoop();
}

function draw() {
    console.log("2 : ", PARAMS.lifespan);
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    for (p of ps) {
        let m, r;
        if (PARAMS.rand_mass) {
            m = random(50, PARAMS.mass_range);
        } else {
            m = PARAMS.mass;
        }
        p.addParticles(
            1,
            PARAMS.lifespan,
            PARAMS.radius,
            m,
            PARAMS.color,
            PARAMS.decay_rate,
            PARAMS.gravity
        );
        p.update();
        p.show();
    }
}