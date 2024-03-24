const PARAMS = {
    max_speed: 5,
    max_force: 0.1,
    v_color: "#ffffff",
    v_size: 4,

    paths: 0,
    path_radius: 50,
    trail: true,
    trail_col: "#f3ff00",

    optimize: false,
    freq: 100,
    clear_rate: 100,

    diagram: true,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const tab = pane.addTab({
        pages: [{ title: "Parameters" }, { title: "Optimization" }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Vehicle",
    });
    const folder2 = tab.pages[0].addFolder({
        title: "Path",
    });
    const folder3 = tab.pages[0].addFolder({
        title: "General",
    });

    folder1
        .addInput(PARAMS, "max_speed", {
            min: 1,
            max: 20,
        })
        .on("change", (ev) => {
            // data["max_speed"] = ev.value;
            // let d = { ...data };
            // console.log(d);
            createVehicle(
                vehicle.pos.x,
                vehicle.pos.y,
                parseInt(ev.value),
                PARAMS.max_force,
                PARAMS.v_size,
                PARAMS.v_color
            );
        });
    folder1
        .addInput(PARAMS, "max_force", {
            min: 0.1,
            max: 5,
        })
        .on("change", (ev) => {
            createVehicle(
                vehicle.pos.x,
                vehicle.pos.y,
                PARAMS.max_speed,
                parseInt(ev.value),
                PARAMS.v_size,
                PARAMS.v_color
            );
        });
    folder1
        .addInput(PARAMS, "v_size", {
            min: 2,
            max: 10,
            step: 1,
        })
        .on("change", (ev) => {
            createVehicle(
                vehicle.pos.x,
                vehicle.pos.y,
                PARAMS.max_speed,
                PARAMS.max_force,
                parseInt(ev.value),
                PARAMS.v_color
            );
        });
    folder1.addInput(PARAMS, "v_color").on("change", (ev) => {
        createVehicle(
            vehicle.pos.x,
            vehicle.pos.y,
            PARAMS.max_speed,
            PARAMS.max_force,
            PARAMS.v_size,
            ev.value
        );
    });

    folder2
        .addInput(PARAMS, "path_radius", {
            min: 10,
            max: 150,
            step: 1,
        })
        .on("change", (ev) => {
            console.log(path.begin);
            createPath(
                path.begin.x,
                path.begin.y,
                path.end.x,
                path.end.y,
                (radius = ev.value)
            );
        });

    folder2.addInput(PARAMS, "trail");
    folder2.addInput(PARAMS, "trail_col");

    folder3.addInput(PARAMS, "pause");
    folder3.addInput(PARAMS, "diagram");

    tab.pages[1].addInput(PARAMS, "optimize").on("change", (ev) => {
        if (ev.value) {
            clear_rate.disabled = false;
            freq.disabled = false;
        } else {
            clear_rate.disabled = true;
            freq.disabled = true;
        }
    });
    const freq = tab.pages[1].addInput(PARAMS, "freq", {
        disabled: true,
        min: 1,
        max: 100,
        step: 1,
    });
    const clear_rate = tab.pages[1].addInput(PARAMS, "clear_rate", {
        disabled: true,
        min: 1,
        max: 100,
        step: 1,
    });
    tab.pages[1].addMonitor(PARAMS, "paths", {
        view: "graph",
        min: 0,
        max: 500,
    });
};

var vehicle;
var path;
var fix = false;

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function mousePressed() {
    if (mouseX < width && mouseY < height) {
        if (fix) {
            fix = false;
        } else {
            fix = true;
        }
    }
}

function createVehicle(x, y, max_speed, max_force, size, color) {
    vehicle = new Vehicle(x, y, max_speed, max_force, size, color);
}

function createPath(x1, y1, x2, y2, radius, color = "#ffffff") {
    path = new Path(x1, y1, x2, y2, radius, color);
}

function setup() {
    createPane();
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    createVehicle(
        200,
        200,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.v_color
    );
    createPath(0, height / 2, width, height / 4, (radius = PARAMS.path_radius));
    background(0);
    // noLoop();
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    if (!fix) {
        path.end.y = mouseY;
    }
    path.show();
    let force = vehicle.follow(path, (diagram = PARAMS.diagram));

    PARAMS.paths = vehicle.path.length;

    vehicle.applyForce(force);
    vehicle.update(
        (trail = PARAMS.trail),
        (optimize = PARAMS.optimize),
        (freq = PARAMS.freq),
        (clear_rate = PARAMS.clear_rate)
    );
    vehicle.show((trail = PARAMS.trail), (trail_col = PARAMS.trail_col));
}