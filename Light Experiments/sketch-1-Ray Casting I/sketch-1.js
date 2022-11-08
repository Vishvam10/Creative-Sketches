const PARAMS = {
  ang_inc: 20,
  color: "#ffdd0020",
  pause: false,
};

var walls = [];
var particle;
var particle_pos_x, particle_pos_y, particle_pos_lock=false;
var temp_wall_x, temp_wall_y;

function getBoundaries(w, h, offset=2) {
  const top = [0, offset, w, offset];
  const right = [w - offset, 0, w - offset, h];
  const bottom = [0, h - offset, w, h - offset];
  const left = [offset, 0, offset, h]; 
  return {
    top, right, bottom, left
  }
}

function addWall(x1, y1, x2, y2, thickness=1) {
  walls.push(new Boundary(x1, y1, x2, y2, thickness));
}

function addRandomWalls(n) {
  walls = []
  for(let i=0; i<n; i++) {
    let x1 = random(width);
    let x2 = random(width);
    let y1 = random(height);
    let y2 = random(height);
    addWall(x1, y1, x2, y2)
  }
}

function addBoundaryWalls(w, h) {
  const {top, right, bottom, left} = getBoundaries(w, h);
  addWall(...top, 1);
  addWall(...right, 1);
  addWall(...bottom, 1);
  addWall(...left, 1);
}

function updateRaysPerAngle(ang) {
  particle.updateRaysPerAngle(ang);
}

function updateParticleColor(col) {
  particle.updateParticleColor(col);
  particle.updateRayColor(col);
}

function setup() {
  const width = windowWidth - 400;
  const height = windowHeight - 50;
  createCanvas(width, height);
  frameRate(120);
  background(0);
  const controlContainer = document.getElementById("controls");
  const pane = new Tweakpane.Pane({
    container: controlContainer,
  });
  const folder1 = pane.addFolder({
    title: "Ray Properties",
  });
  const folder2 = pane.addFolder({
    title: "General",
  });
  folder1.addInput(PARAMS, "ang_inc", { min: 1, max: 100, step: 0.1 }).on("change", (ev) => {
    updateRaysPerAngle(
      parseInt(ev.value)
    );
  });;

  folder1.addInput(PARAMS, "color", {
    view: 'color',
    color: {
      alpha: true
    },
    picker: 'inline',
    expanded: true,
  }).on("change", (ev) => {
    updateParticleColor(ev.value)
  });
  folder2.addInput(PARAMS, "pause");

  addBoundaryWalls(width, height);

  particle = new Particle(width/2, height/2);
}

function doubleClicked() {
  if (mouseX < width && mouseY < height) {
    temp_wall_x = mouseX;
    temp_wall_y = mouseY;
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    temp_wall_x = mouseX;
    temp_wall_y = mouseY
  }
}

function mouseReleased() {
  if (mouseX < width && mouseY < height) {
    addWall(temp_wall_x, temp_wall_y, mouseX, mouseY);    
  }

}

function keyPressed() {
  if(key == "x") {
    if(particle_pos_lock) {
      particle_pos_lock = false;
    } else {
      particle_pos_lock = true;
    }
  } 
}

function draw() {
  if (PARAMS.pause) {
    return;
  }
  background(0);
  for(let wall of walls) {
    wall.show();
  }
  if(!particle_pos_lock) {
    ang_scale = map(PARAMS.ang_inc, 1, 100, 20, 1);
    if (keyIsDown(LEFT_ARROW)) {
      particle.move(-1 * ang_scale, 0)
    } 
    if (keyIsDown(RIGHT_ARROW)) {
      particle.move(1 * ang_scale, 0)
    }
    if (keyIsDown(UP_ARROW)) {
      particle.move(0, -1 * ang_scale)
    }
    if (keyIsDown(DOWN_ARROW)) {
      particle.move(0, 1 * ang_scale)
    }
  }
  particle.wrap();
  particle.show();
  particle.look(walls);
}