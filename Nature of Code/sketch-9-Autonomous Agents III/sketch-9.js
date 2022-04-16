const PARAMS = {
  max_speed: 1,
  max_force: 0.1,
  v_color: "#ffffff",
  v_size: 4,

  mag: 200,
  sur_radius: 200,
  trail: true,
  trail_col: "#00baff",

  diagram: false,
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
    title: "Wander Behaviour",
  });
  const folder3 = pane.addFolder({
    title: "General",
  });

  folder1
    .addInput(PARAMS, "max_speed", {
      min: 1,
      max: 25,
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
        PARAMS.color,
        PARAMS.mag,
        PARAMS.sur_radius
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
        PARAMS.color,
        PARAMS.mag,
        PARAMS.sur_radius
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
        PARAMS.color,
        PARAMS.mag,
        PARAMS.sur_radius
      );
    });
  folder1.addInput(PARAMS, "v_color").on("change", (ev) => {
    createVehicle(
      vehicle.pos.x,
      vehicle.pos.y,
      PARAMS.max_speed,
      PARAMS.max_force,
      PARAMS.v_size,
      ev.value,
      PARAMS.mag,
      PARAMS.sur_radius
    );
  });

  folder2
    .addInput(PARAMS, "mag", {
      min: 50,
      max: 500,
      step: 1,
    })
    .on("change", (ev) => {
      createVehicle(
        vehicle.pos.x,
        vehicle.pos.y,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.color,
        ev.value,
        PARAMS.sur_radius
      );
    });
  folder2
    .addInput(PARAMS, "sur_radius", {
      min: 50,
      max: 500,
      step: 1,
    })
    .on("change", (ev) => {
      createVehicle(
        vehicle.pos.x,
        vehicle.pos.y,
        PARAMS.max_speed,
        PARAMS.max_force,
        PARAMS.v_size,
        PARAMS.color,
        PARAMS.mag,
        ev.value
      );
    });
  folder2.addInput(PARAMS, "trail");
  folder2.addInput(PARAMS, "trail_col");

  folder3.addInput(PARAMS, "pause");
  folder3.addInput(PARAMS, "diagram");
};

var vehicle;

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function mouseClicked() {
  if (mouseX < width && mouseY < height) {
  }
}

function doubleClicked() {
  if (mouseX < width && mouseY < height) {
  }
}

function createVehicle(
  x,
  y,
  max_speed,
  max_force,
  size,
  color,
  wp_mag,
  sur_radius
) {
  vehicle = new Vehicle(
    x,
    y,
    max_speed,
    max_force,
    size,
    color,
    wp_mag,
    sur_radius
  );
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
    PARAMS.v_color,
    100,
    PARAMS.sur_radius
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
  vehicle.wander(PARAMS.diagram);
  vehicle.update(PARAMS.trail);
  vehicle.show(PARAMS.trail, PARAMS.trail_col);
}
