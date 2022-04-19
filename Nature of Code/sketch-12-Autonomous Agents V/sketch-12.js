const PARAMS = {
    max_speed: 1,
    max_force: 1,
    v_color: "#ffffff",
    v_size: 8,
    trail: true,
    trail_col: "#ffffff",

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

    folder3.addInput(PARAMS, "pause");
    folder3.addInput(PARAMS, "diagram");
};

var vehicle;
var field;

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
    // line(0, 0, v.x, v.y);
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

function createFlowField(width, height, res, direction, rand_dir = false) {
    field = new FlowField(width, height, res, direction, rand_dir);
}

function createVehicle(x, y, max_speed, max_force, size, color) {
    vehicle = new Vehicle(x, y, max_speed, max_force, size, color);
}

function setup() {
    createPane();
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    createVehicle(
        width / 2,
        height / 2,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.v_color
    );
    createFlowField(width, height, 60, 0, (rand_dir = false));
    background(0);
    // noLoop();
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    field.show(PARAMS.diagram);

    vehicle.wrap();

    let force = vehicle.follow(field);
    vehicle.applyForce(force);
    // PARAMS.paths = vehicle.paths.length;

    vehicle.update(PARAMS.trail, PARAMS.optimize, PARAMS.clear_rate);
    vehicle.show(PARAMS.trail, PARAMS.trail_col);
}