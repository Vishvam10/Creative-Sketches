const PARAMS = {
    n_vehicles: 3,
    n_food: 10,
    n_poison: 10,
    mut_rate: 0.1,
    repr_rate: 10,
    food_freq: 0.01,
    pois_freq: 0.01,
    avg_fitness: 0,
    show_perc: false,
    limit: 20,
    frameRate: 0,
    pause: false,
};

var foods = [];
var poisons = []
var vehicles = []
var vehicle;
var nv = 2,
    np = 10,
    nf = 10;


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

    folder1.addInput(PARAMS, "n_vehicles", {
        min: 1,
        max: 10,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(44);
        intialize(ev.value, PARAMS.n_food, PARAMS.n_poison);
    })
    folder1.addInput(PARAMS, "n_food", {
        min: 1,
        max: 500,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(44);
        intialize(PARAMS.n_vehicles, ev.value, PARAMS.n_poison);
    })
    folder1.addInput(PARAMS, "n_poison", {
        min: 1,
        max: 500,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(44);
        intialize(PARAMS.n_vehicles, PARAMS.n_food, ev.value);
    })

    folder1.addInput(PARAMS, "mut_rate", {
        min: 0.001,
        max: 1,
        step: 0.001
    }).on("change", (ev) => {
        intialize();
    })
    folder1.addInput(PARAMS, "repr_rate", {
        min: 0.01,
        max: 5,
        step: 0.0001
    })
    folder1.addInput(PARAMS, "food_freq", {
        min: 0.001,
        max: 1,
        step: 0.0001
    })
    folder1.addInput(PARAMS, "pois_freq", {
        min: 0.001,
        max: 1,
        step: 0.0001
    })
    folder2.addInput(PARAMS, "show_perc");

    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });

    folder2.addInput(PARAMS, "pause");

}

const intialize = (nv = 2, nf = 10, np = 10) => {
    for (let i = 0; i < nv; i++) {
        let x = random(width);
        let y = random(height);
        vehicle = new Vehicle(x, y, random(0, 10), random(0, 10), 4, mutationRate = PARAMS.mut_rate);
        vehicles.push(vehicle);
    }
    for (let i = 0; i < nf; i++) {
        let x = random(width);
        let y = random(height);
        foods.push(createVector(x, y));
    }
    for (let i = 0; i < np; i++) {
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
    if (random(1) < PARAMS.food_freq) {
        var x = random(width);
        var y = random(height);
        foods.push(createVector(x, y));
    }

    if (random(1) < PARAMS.pois_freq) {
        var x = random(width);
        var y = random(height);
        poisons.push(createVector(x, y));
    }

    for (var i = 0; i < foods.length; i++) {
        fill(0, 255, 0);
        noStroke();
        ellipse(foods[i].x, foods[i].y, 4, 4);
    }

    for (var i = 0; i < poisons.length; i++) {
        fill(255, 0, 0);
        noStroke();
        ellipse(poisons[i].x, poisons[i].y, 4, 4);
    }

    for (var i = vehicles.length - 1; i >= 0; i--) {
        vehicles[i].wrap();
        vehicles[i].behaviours(foods, poisons);
        vehicles[i].update();
        vehicles[i].show(PARAMS.show_perc);

        var newVehicle = vehicles[i].clone(PARAMS.repr_rate / 1000);
        if (newVehicle != null) {
            vehicles.push(newVehicle);
        }

        if (vehicles[i].dead()) {
            var x = vehicles[i].position.x;
            var y = vehicles[i].position.y;
            foods.push(createVector(x, y));
            vehicles.splice(i, 1);
        }
    }

    PARAMS.frameRate = floor(frameRate())
}