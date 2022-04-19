const PARAMS = {
    max_speed: 1,
    max_force: 1,
    v_color: "#ffffff",
    v_size: 8,
    trail: true,
    trail_col: "#ffffff",

    color_scheme: "R",
    resolution: 60,
    force_limit: 25,
    ang_inc: {
        x: 0.1,
        y: 0.1,
    },

    diagram: true,
    pause: false,
};

var vehicle;
var field;
var width, height;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const tab = pane.addTab({
        pages: [{ title: "Vehicle" }, { title: "Flow Field " }, { title: "Opt." }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Vehicle",
    });

    const folder2 = tab.pages[1].addFolder({
        title: "Flow Field Parameters",
    });

    const folder3 = tab.pages[0].addFolder({
        title: "General",
    });

    folder1
        .addInput(PARAMS, "max_speed", {
            min: 1,
            max: 5,
        })
        .on("change", (ev) => {
            createVehicle(
                width / 2,
                height / 2,
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
    folder1.addInput(PARAMS, "trail");
    folder2
        .addBlade({
            view: "list",
            label: "color_scheme",
            options: [
                { text: "Red", value: "R" },
                { text: "Green", value: "G" },
                { text: "Blue", value: "B" },
            ],
            value: "R",
        })
        .on("change", (ev) => {
            PARAMS.color_scheme = ev.value;
        });
    folder2
        .addInput(PARAMS, "resolution", {
            min: 10,
            max: 120,
            step: 10,
        })
        .on("change", (ev) => {
            createFlowField(width, height, ev.value, PARAMS.force_limit, PARAMS.inc);
        });
    folder2
        .addInput(PARAMS, "force_limit", {
            min: 1,
            max: 40,
            step: 1,
        })
        .on("change", (ev) => {
            createFlowField(
                width,
                height,
                PARAMS.resolution,
                ev.value,
                PARAMS.ang_inc
            );
        });
    folder2
        .addInput(PARAMS, "ang_inc", {
            x: {
                min: 0.01,
                max: 4,
                step: 0.01,
            },
            y: {
                min: 0.01,
                max: 4,
                step: 0.01,
            },
        })
        .on("change", (ev) => {
            createFlowField(
                width,
                height,
                PARAMS.resolution,
                PARAMS.force_limit,
                ev.value
            );
        });

    folder2.addInput(PARAMS, "diagram");
    folder3.addInput(PARAMS, "pause");
};

function drawForce(base, vec, color, arrowSize, diagram) {
    push();
    stroke(color);
    strokeWeight(1);
    fill(color);
    let v = round(map(vec.mag(), 0, 40, 0, 1), 2);
    translate(base.x, base.y);
    if (diagram) {
        push();
        textSize(12);
        fill(255, 255, 255, 50);
        noStroke();
        text(v, 0, 20);
        pop();
    }
    rotate(vec.heading());
    translate(v, 0);
    triangle(-arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2, arrowSize, 0);
    pop();
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}

function doubleClicked() {
    if (mouseX < width && mouseY < height) {
        createVehicle(
            mouseX,
            mouseY,
            PARAMS.max_speed,
            PARAMS.max_force,
            PARAMS.v_size,
            PARAMS.v_color
        );
    }
}

function createFlowField(width, height, res, force_limit, inc) {
    field = new FlowField(width, height, res, force_limit, inc);
}

function createVehicle(x, y, max_speed, max_force, size, color) {
    vehicle = new Vehicle(x, y, max_speed, max_force, size, color);
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    createVehicle(
        width / 2,
        height / 2,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.v_color
    );
    createFlowField(
        width,
        height,
        PARAMS.resolution,
        PARAMS.force_limit,
        PARAMS.ang_inc
    );
    background(0);
    // noLoop();
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    console.log(PARAMS.color_scheme);
    field.show(PARAMS.diagram, PARAMS.color_scheme);

    vehicle.wrap();

    let force = vehicle.follow(field);
    vehicle.applyForce(force);
    // PARAMS.paths = vehicle.paths.length;

    vehicle.update(PARAMS.trail, PARAMS.optimize, PARAMS.clear_rate);
    vehicle.show(PARAMS.trail, PARAMS.trail_col);
}