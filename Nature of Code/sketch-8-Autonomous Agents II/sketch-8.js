const PARAMS = {
    max_speed: 4,
    max_force: 0.25,
    v_color: "#ffffff",
    v_size: 4,
    t_vel: {
        x: 0.2,
        y: 0.4,
    },
    t_acc: {
        x: 0.2,
        y: 0.4,
    },
    t_color: "#ff0023",
    pursue_line: false,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Vehicle",
    });
    const folder2 = pane.addFolder({
        title: "Target",
    });

    const folder3 = pane.addFolder({
        title: "General",
    });
    folder1
        .addInput(PARAMS, "max_speed", {
            min: 1,
            max: 50,
        })
        .on("change", (ev) => {
            createVehicle(
                200,
                200,
                parseInt(ev.value),
                PARAMS.max_force,
                PARAMS.v_size,
                PARAMS.color
            );
        });
    folder1
        .addInput(PARAMS, "max_force", {
            min: 0.1,
            max: 5,
        })
        .on("change", (ev) => {
            createVehicle(
                200,
                200,
                PARAMS.max_speed,
                parseInt(ev.value),
                PARAMS.v_size,
                PARAMS.color
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
                200,
                200,
                PARAMS.max_speed,
                PARAMS.max_force,
                parseInt(ev.value),
                PARAMS.color
            );
        });
    folder1.addInput(PARAMS, "v_color").on("change", (ev) => {
        createVehicle(
            200,
            200,
            PARAMS.max_speed,
            PARAMS.max_force,
            PARAMS.v_size,
            ev.value
        );
    });

    folder2
        .addInput(PARAMS, "t_vel", {
            x: { min: -10, max: 10 },
            y: { min: -10, max: 10 },
        })
        .on("change", (ev) => {
            createTarget(
                target.pos.x,
                target.pos.y,
                true,
                PARAMS.t_color,
                ev.value.x,
                ev.value.y,
                PARAMS.t_acc.x,
                PARAMS.t_acc.y
            );
        });
    folder2
        .addInput(PARAMS, "t_acc", {
            x: { min: -10, max: 10 },
            y: { min: -10, max: 10 },
        })
        .on("change", (ev) => {
            createTarget(
                target.pos.x,
                target.pos.y,
                true,
                PARAMS.t_color,
                PARAMS.t_vel.x,
                PARAMS.t_vel.y,
                ev.value.x,
                ev.value.y
            );
        });
    folder2.addInput(PARAMS, "t_color").on("change", (ev) => {
        createTarget(
            target.pos.x,
            target.pos.y,
            true,
            ev.value,
            PARAMS.t_vel.x,
            PARAMS.t_vel.y,
            PARAMS.t_acc.x,
            PARAMS.t_acc.y
        );
    });

    folder3.addInput(PARAMS, "pause");
    folder3.addInput(PARAMS, "pursue_line");
};

var vehicle;
var target;

function mouseClicked() {
    if (mouseX < width && mouseY < height) {
        createTarget(mouseX, mouseY, false, PARAMS.t_color);
    }
}

function doubleClicked() {
    if (mouseX < width && mouseY < height) {
        createTarget(
            mouseX,
            mouseY,
            true,
            PARAMS.t_color,
            PARAMS.t_vel.x,
            PARAMS.t_vel.y,
            PARAMS.t_acc.x,
            PARAMS.t_acc.y
        );
    }
}

function createTarget(x, y, motion, color, vx = 0, vy = 0, ax = 0, ay = 0) {
    target = new Target(x, y, motion, color, vx, vy, ax, ay);
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
        200,
        200,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.v_color
    );
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    if (target) {
        target.wrap();
        target.update();
        target.show();

        let steering_force = vehicle.pursue(target, PARAMS.pursue_line);
        vehicle.applyForce(steering_force);

        vehicle.wrap();
        vehicle.update();
        vehicle.show();
    }
}