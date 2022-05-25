const PARAMS = {
    particles: 4,
    show_entity: true,
    e_grav_str: 0.01,
    show_attractor: true,
    a_grav_str: 0.01,
    line: true,
    oTrail: 100,
    pause: false,
};

let entities = [];
let attractors = [];
let att;
var particles = 4;
let temp_mass = 500;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    const folder1 = pane.addFolder({
        title: "Entity",
    });
    const folder2 = pane.addFolder({
        title: "Attractor",
    });
    const folder3 = pane.addFolder({
        title: "General",
    });

    folder1.addInput(PARAMS, "show_entity");
    folder1.addInput(PARAMS, "line");
    folder1
        .addInput(PARAMS, "particles", { min: 2, max: 10, step: 1 })
        .on("change", (ev) => {
            particles = parseInt(ev.value);
            createEntities();
        });
    folder1.addInput(PARAMS, "e_grav_str");

    folder2.addInput(PARAMS, "show_attractor");

    folder3.addInput(PARAMS, "oTrail", { min: -100, max: 200, step: 1 });
    folder3.addInput(PARAMS, "pause");
};

const createEntities = () => {
    clear();
    background(0);
    entities.length = 0;
    for (let i = 0; i < particles; i++) {
        let pos = p5.Vector.random2D();
        let vel = pos.copy();
        vel.setMag(random(10, 15));
        pos.setMag(random(100, 150));
        vel.rotate();
        let m = random(10, 100);
        entities[i] = new Entity(pos.x, pos.y, vel.x, vel.y, m);
    }
};
const createAttractor = (mass, x = 0, y = 0) => {
    att = new Entity(x, y, 0, 0, mass);
    attractors.push(att);
};

function setup() {
    createPane();
    createEntities();
    createAttractor(500);
    const width = windowWidth - 400;
    const height = windowHeight - 50;
    createCanvas(width, height);
    background(0);
}

function doubleClicked() {
    if (mouseX < width && mouseY < height) {
        createAttractor(500, mouseX - width / 2, mouseY - height / 2);
        att.show();
    }
}

function mouseDragged(ev) {
    for (att of attractors) {
        let data = {
            x: ev.clientX - width / 2,
            y: ev.clientY - height / 2,
            shiftKey: ev.shiftKey,
        };
        att.updateProperties(data);
    }
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    translate(width / 2, height / 2);
    for (let entity of entities) {
        for (let att of attractors) {
            att.attract(entity);
            if (PARAMS.show_attractor) {
                att.show();
            }
        }
        for (let other of entities) {
            if (entity !== other) {
                entity.attract(other, PARAMS.e_grav_str);
                let col = constrain(entity.vel.mag() + 45, 0, 255);
                if (PARAMS.line) {
                    stroke(255, col, 75, 100);
                    line(entity.pos.x, entity.pos.y, other.pos.x, other.pos.y);
                }
            }
        }
    }
    for (let entity of entities) {
        entity.update();
        if (PARAMS.show_entity) {
            entity.show();
        }
    }
}