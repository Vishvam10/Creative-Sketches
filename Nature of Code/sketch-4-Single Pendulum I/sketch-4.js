const PARAMS = {
    show_bob: true,
    bob_color: "#009dff",
    show_arm: true,
    arm_color: "#ffffff",
    damping: 1,
    gravity: 0.4,
    oTrail: 250,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    const folder1 = pane.addFolder({
        title: "Pendulum",
    });
    const folder2 = pane.addFolder({
        title: "Environment",
    });
    const folder3 = pane.addFolder({
        title: "General",
    });

    folder1.addInput(PARAMS, "show_bob");
    folder1.addInput(PARAMS, "bob_color");
    folder1.addInput(PARAMS, "show_arm");
    folder1.addInput(PARAMS, "arm_color");

    folder2.addInput(PARAMS, "gravity", { min: -1, max: 1, step: 0.001 });
    folder2.addInput(PARAMS, "damping", { min: 0, max: 1, step: 0.001 });

    folder3.addInput(PARAMS, "oTrail", { min: -200, max: 400, step: 1 });
    folder3.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    background(0);
    pendulum = new Pendulum(0, 0, 200, 400, PI / 4);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    translate(width / 2, height / 3);
    noStroke();
    fill(255);
    circle(0, 0, 32);
    let d = {
        gravity: PARAMS.gravity,
        damping: PARAMS.damping,
    };
    pendulum.update(d);
    let data = {
        show_bob: PARAMS.show_bob,
        bob_color: PARAMS.bob_color,
        show_arm: PARAMS.show_arm,
        arm_color: PARAMS.arm_color,
    };
    pendulum.show(data);
}