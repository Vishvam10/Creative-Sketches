const PARAMS = {
    show_entity: true,
    oTrail: 100,
    pause: false,
};

// let entities = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    const folder1 = pane.addFolder({
        title: "Pendulum",
    });
    const folder2 = pane.addFolder({
        title: "General",
    });

    folder1.addInput(PARAMS, "show_entity");
    // folder1
    //     .addInput(PARAMS, "particles", { min: 2, max: 10, step: 1 })
    //     .on("change", (ev) => {
    //         particles = parseInt(ev.value);
    //         createEntities();
    //     });
    // folder1.addInput(PARAMS, "e_grav_str");

    // folder2.addInput(PARAMS, "show_attractor");

    folder2.addInput(PARAMS, "oTrail", { min: -100, max: 200, step: 1 });
    folder2.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    background(0);
    translate(width / 2, height / 2);
    pendulum = new Pendulum(width / 2, 0, 400, 400);
}

// function doubleClicked() {
//     if (mouseX < width && mouseY < height) {
//         createAttractor(500, mouseX - width / 2, mouseY - height / 2);
//         att.show();
//     }
// }

// function mouseDragged(ev) {
//     for (att of attractors) {
//         let data = {
//             x: ev.clientX - width / 2,
//             y: ev.clientY - height / 2,
//             shiftKey: ev.shiftKey,
//         };
//         att.updateProperties(data);
//     }
// }

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    pendulum.update();
    pendulum.show();
}