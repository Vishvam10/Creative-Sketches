const PARAMS = {
  max_speed: 1,
  max_force: 0.1,
  v_color: "#ffffff",
  v_size: 4,

  paths: 0,
  mag: 100,
  sur_radius: 100,
  jitter: 0.2,
  trail: true,
  trail_col: "#00baff",

  optimize: false,
  clear_rate: 1000,

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
    title: "Wander Behaviour",
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
      // data["max_speed"] = ev.value;
      // let d = { ...data };
      // console.log(d);
      createVehicle(
        vehicle.pos.x,
        vehicle.pos.y,
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
        vehicle.pos.x,
        vehicle.pos.y,
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
        vehicle.pos.x,
        vehicle.pos.y,
        PARAMS.max_speed,
        PARAMS.max_force,
        parseInt(ev.value),
        PARAMS.color
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

  folder2.addInput(PARAMS, "mag", {
    min: 50,
    max: 500,
    step: 1,
  });

  folder2.addInput(PARAMS, "sur_radius", {
    min: 50,
    max: 500,
    step: 1,
  });

  folder2.addInput(PARAMS, "jitter", {
    min: 0.01,
    max: 4,
    step: 0.001,
  });
  folder2.addInput(PARAMS, "trail");
  folder2.addInput(PARAMS, "trail_col");

  folder3.addInput(PARAMS, "pause");
  folder3.addInput(PARAMS, "diagram");

  tab.pages[1].addInput(PARAMS, "optimize").on("change", (ev) => {
    if (ev.value) {
      clear_rate.disabled = false;
    } else {
      clear_rate.disabled = true;
    }
  });
  const clear_rate = tab.pages[1].addInput(PARAMS, "clear_rate", {
    disabled: true,
    min: 100,
    max: 5000,
    step: 1,
  });
  tab.pages[1].addMonitor(PARAMS, "paths", {
    view: "graph",
    min: 0,
    max: 50,
  });
};

var vehicle;

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
  // noLoop();
}

function draw() {
  if (PARAMS.pause) {
    return;
  }
  background(0);
  vehicle.wrap();
  vehicle.wander(PARAMS.mag, PARAMS.sur_radius, PARAMS.diagram);
  PARAMS.paths = vehicle.paths.length;
  vehicle.update(
    PARAMS.jitter,
    PARAMS.trail,
    PARAMS.optimize,
    PARAMS.clear_rate
  );
  vehicle.show(PARAMS.trail, PARAMS.trail_col);
}
