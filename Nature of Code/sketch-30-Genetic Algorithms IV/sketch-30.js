const PARAMS = {
    ref_rate: 3,
    max_pop: 200,
    mut_rate: 0.01,
    avg_fitness: 0,
    limit: 20,
    frameRate: 0,
    pause: false,
};

var foods = [];
var poisons = []
var vehicles = []
var vehicle;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    })
    const folder2 = pane.addFolder({
        title: "General",
    })
    folder1.addBlade({
        view: 'list',
        label: 'fit_func',
        options: [
            { text: 'linear', value: 'linear' },
            { text: 'quadratic', value: 'quad' },
            { text: 'cubic', value: 'cubic' },
            { text: 'bi-quadratic', value: 'biquad' },
            { text: 'exponential', value: 'exp' },
        ],
        value: 'linear',
    }).on("change", (ev) => {
        clear();
        fitness_function = ev.value;
        intialize();
    })
    folder1.addInput(PARAMS, "ref_rate", {
        min: 1,
        max: 100,
        step: 1
    })
    folder1.addBlade({
        view: 'text',
        label: 'name',
        parse: (v) => String(v),
        value: 'To be or not to be',
    }).on("change", (ev) => {
        clear();
        target = str(ev.value)
        intialize()
    })
    folder1.addInput(PARAMS, "max_pop", {
        min: 20,
        max: 1000,
        step: 1
    }).on("change", (ev) => {
        popmax = ev.value
        intialize()
    })
    folder1.addInput(PARAMS, "mut_rate", {
        min: 0.001,
        max: 1,
        step: 0.001
    }).on("change", (ev) => {
        mutationRate = ev.value
        intialize()
    })
    folder1.addInput(PARAMS, "limit", {
        min: 2,
        max: 100,
        step: 1
    })
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addMonitor(PARAMS, "avg_fitness", {
        view: "graph",
        min: 0,
        max: 1,
    });
    folder2.addMonitor(PARAMS, "avg_fitness", {
        label: "",
    });
    folder2.addInput(PARAMS, "pause");

}

const intialize = () => {
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        vehicle = new Vehicle(x, y, random(0, 10), random(0, 10), 4);
        vehicles.push(vehicle);
    }
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        foods.push(createVector(x, y));
    }
    for (let i = 0; i < 10; i++) {
        let x = random(width);
        let y = random(height);
        poisons.push(createVector(x, y));
    }
}

function setup() {
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    createPane();
    intialize();
}

function draw() {
    if (PARAMS.pause) {
        return
    }
    background(44)
    if (random(1) < 0.2) {
        let x = random(width);
        let y = random(height);
        foods.push(createVector(x, y));
    }
    if (random(1) < 0.1) {
        let x = random(width);
        let y = random(height);
        poisons.push(createVector(x, y));
    }
    for (f of foods) {
        noStroke();
        fill(0, 255, 0);
        circle(f.x, f.y, 8);
    }
    for (p of poisons) {
        noStroke();
        fill(255, 0, 255);
        circle(p.x, p.y, 8);
    }
    for (let i = vehicles.length - 1; i >= 0; i--) {
        vehicle = vehicles[i]
        vehicle.boundaries();
        vehicle.behaviours(foods, poisons);
        vehicle.update();
        vehicle.show();
        if (vehicle.dead()) {
            vehicles.splice(i, 1)
        }
    }

    PARAMS.frameRate = floor(frameRate())
}