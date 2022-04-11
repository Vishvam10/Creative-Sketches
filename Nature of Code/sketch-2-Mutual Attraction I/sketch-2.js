const PARAMS = {
    particles: 4,
    show_entity: true,
    e_grav_str: 0.01,
    show_attractor: true,
    a_grav_str: 0.01,
    line: true,
    att_mass: 500,
    oTrail: 100,
    pause: false,
};

let entities = [];
let att;
var particles = 4;

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
    folder2
        .addInput(PARAMS, "att_mass", { min: 100, max: 5000, step: 10 })
        .on("change", (ev) => {
            createAttractor(parseInt(ev.value));
        });
    folder2.addInput(PARAMS, "a_grav_str");

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

const createAttractor = (mass) => {
    att = new Entity(0, 0, 0, 0, mass);
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

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0, PARAMS.oTrail);
    translate(width / 2, height / 2);
    for (let entity of entities) {
        att.attract(entity, PARAMS.a_grav_str);
        if (PARAMS.show_attractor) {
            att.show();
        }
        for (let other of entities) {
            if (entity !== other) {
                entity.attract(other, PARAMS.e_grav_str);
                let col = constrain(entity.vel.mag() + 100, 0, 255);
                // console.log(col)
                if (PARAMS.line) {
                    stroke(255, 25, col, 100);
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