const PARAMS = {
  show_bob: true,
  bob_color: "#009dff",
  show_arm: false,
  arm_color: "#004876",
  rand_mass: true,
  mass: 400,
  mass_range: 400,
  rand_arm_len: true,
  arm_length: 50,
  al_range: 100,
  damping: 1,
  gravity: 0.4,
  oTrail: 25,
  pause: false,
};

let pendulums = [];
let pendulum;

const createPane = () => {
  const controlContainer = document.getElementById("controls");
  const pane = new Tweakpane.Pane({
    container: controlContainer,
  });

  const tab = pane.addTab({
    pages: [{ title: "Parameters" }, { title: "Defaults" }],
  });

  const folder1 = tab.pages[0].addFolder({
    title: "Pendulum",
  });
  const folder2 = tab.pages[0].addFolder({
    title: "System",
  });
  const folder3 = tab.pages[0].addFolder({
    title: "Environment",
  });
  const folder4 = tab.pages[0].addFolder({
    title: "General",
  });

  folder1.addInput(PARAMS, "show_bob");
  folder1.addInput(PARAMS, "show_arm");

  folder2.addInput(PARAMS, "rand_mass").on("change", (ev) => {
    if (ev.value) {
      mass_range.disabled = false;
    } else {
      mass_range.disabled = true;
    }
  });
  const mass_range = folder2.addInput(PARAMS, "mass_range", {
    min: 50,
    max: 800,
    step: 1,
  });
  folder2.addInput(PARAMS, "rand_arm_len").on("change", (ev) => {
    if (ev.value) {
      al_range.disabled = false;
    } else {
      al_range.disabled = true;
    }
  });
  const al_range = folder2.addInput(PARAMS, "al_range", {
    min: 50,
    max: 800,
    step: 1,
  });

  folder3.addInput(PARAMS, "gravity", { min: -1, max: 1, step: 0.001 });
  folder3.addInput(PARAMS, "damping", { min: 0, max: 1, step: 0.001 });

  folder4.addInput(PARAMS, "oTrail", { min: -200, max: 400, step: 1 });
  folder4.addInput(PARAMS, "pause");

  tab.pages[1].addInput(PARAMS, "bob_color");
  tab.pages[1].addInput(PARAMS, "arm_color");
  tab.pages[1].addInput(PARAMS, "mass", {
    min: 50,
    max: 800,
    step: 1,
  });
  tab.pages[1].addInput(PARAMS, "arm_length", {
    min: 50,
    max: 800,
    step: 1,
  });
};

function doubleClicked() {
  if (mouseX < width && mouseY < height) {
    createPendulum(mouseX - width / 2, mouseY, 50, 400, PI / 4);
  }
}

function mouseDragged() {
  background(0, 100);
  fill(255, 255, 255, 50);
  circle(mouseX - width / 2, mouseY, 32);
  if (mouseX < width && mouseY < height) {
    let m, al;
    if (PARAMS.rand_mass) {
      m = random(50, PARAMS.mass_range);
    } else {
      m = 400;
    }
    if (PARAMS.rand_mass) {
      al = random(50, PARAMS.al_range);
      console.log("AL : ", al);
    } else {
      al = 50;
    }
    createPendulum(mouseX - width / 2, mouseY, al, m, PI / 4);
  }
}

function createPendulum(x, y, arm_length, mass, starting_angle) {
  pendulum = new Pendulum(x, y, arm_length, mass, starting_angle);
  pendulums.push(pendulum);
}

function createRandomPendulum(n) {
  for (let i = 0; i < n; i++) {
    let x = 0,
      y = 0,
      arm_length = 100 * i,
      mass = 100 * i,
      starting_angle = random(0, PI / 4);
    pendulum = new Pendulum(x, y, arm_length, mass, starting_angle);
    pendulums.push(pendulum);
  }
}

function setup() {
  createPane();
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

  translate(width / 2, 0);
  for (let i = 0; i < pendulums.length; i++) {
    let p = pendulums[i];
    let d = {
      gravity: PARAMS.gravity,
      damping: PARAMS.damping,
    };
    p.update(d);
    let data = {
      show_bob: PARAMS.show_bob,
      bob_color: PARAMS.bob_color,
      show_arm: PARAMS.show_arm,
      arm_color: PARAMS.arm_color,
    };
    p.show(data);
  }
}
