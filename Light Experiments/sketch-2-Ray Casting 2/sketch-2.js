const PARAMS = {
  ang_inc: 2,
  color1: "#fc033520",
  color2: "#ffdd0020",
  show_rays: true,
  pause: false,
};

var walls = [];
var particles = [];
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
  for(let particle of particles) {
    particle.updateRaysPerAngle(ang);
  }
}

function updateParticleColor(ind, col) {
  particles[ind].updateParticleColor(col);
  particles[ind].updateRayColor(col);
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
  folder1.addInput(PARAMS, "ang_inc", { min: 1, max: 100, step: 0.01 }).on("change", (ev) => {
    updateRaysPerAngle(
      parseInt(ev.value)
    );
  });;

  folder1.addInput(PARAMS, "color1", {
    view: 'color',
    color: {
      alpha: true
    },
    picker: 'inline',
  }).on("change", (ev) => {
    updateParticleColor(0, ev.value)
  });
  folder1.addInput(PARAMS, "color2", {
    view: 'color',
    color: {
      alpha: true
    },
    picker: 'inline',
  }).on("change", (ev) => {
    updateParticleColor(1, ev.value)
  });
  folder1.addInput(PARAMS, "show_rays");
  folder2.addInput(PARAMS, "pause");

  addBoundaryWalls(width, height);

  particles.push(new Particle(width/2-100, height/2, 10, "#fc023536", 16));
  particles.push(new Particle(width/2+100, height/2, 10, "#ffdd0020", 16));
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
    if(keyIsDown(LEFT_ARROW)) {
      particles[0].move(-1 * ang_scale, 0)
    } 
    if(keyIsDown(65)) {
      particles[1].move(-1 * ang_scale, 0)
    } 
    if(keyIsDown(RIGHT_ARROW)) {
      particles[0].move(1 * ang_scale, 0)
    }
    if(keyIsDown(68)) {
      particles[1].move(1 * ang_scale, 0)
    }
    if(keyIsDown(UP_ARROW)) {
      particles[0].move(0, -1 * ang_scale)
    }
    if(keyIsDown(87)) {
      particles[1].move(0, -1 * ang_scale)
    }
    if(keyIsDown(DOWN_ARROW)) {
      particles[0].move(0, 1 * ang_scale)
    }
    if(keyIsDown(83)) {
      particles[1].move(0, 1 * ang_scale)
    }
  }

  for(let particle of particles) {
    particle.wrap();
    particle.show(PARAMS.show_rays);
    particle.look(walls, PARAMS.show_rays);
  }
}