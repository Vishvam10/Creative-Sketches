class Vehicle {
  constructor(x, y, max_speed, max_force, size, color = "#ffffff") {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = max_speed;
    this.maxForce = max_force;
    this.size = size;
    this.color = color;

    this.theta = PI / 3 + this.vel.heading();

    this.cur_path = [];
    this.paths = [this.cur_path];
  }

  wander(wp_mag, wp_sur_rad, diagram) {
    let dir = this.vel.copy();
    dir.setMag(wp_mag);
    dir.add(this.pos);

    if (diagram) {
      // Centre of wandering circle
      noStroke();
      fill(255, 0, 0);
      circle(dir.x, dir.y, 8);

      // Vehicle position to circle's centre
      push();
      stroke(255);
      strokeWeight(0.5);
      setLineDash([5, 5]);
      line(this.pos.x, this.pos.y, dir.x, dir.y);
      pop();

      // Wandering circle
      noFill();
      stroke(255);
      strokeWeight(1);
      circle(dir.x, dir.y, wp_sur_rad);
    }

    // Controlling Point
    let x = (wp_sur_rad / 2) * cos(this.theta);
    let y = (wp_sur_rad / 2) * sin(this.theta);
    dir.add(x, y);
    if (diagram) {
      noStroke();
      fill(0, 255, 0);
      circle(dir.x, dir.y, 8);

      stroke(255);
      strokeWeight(0.5);
      line(this.pos.x, this.pos.y, dir.x, dir.y);
    }

    // Steering force
    let steering_force = dir.sub(this.pos);
    steering_force.setMag(this.maxForce);
    this.applyForce(steering_force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(jitter = 0.1, trail = false, optimize = false, lim = 1000) {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.theta += random(-jitter, jitter);
    this.theta = constrain(this.theta, 0, PI);
    if (trail) {
      this.cur_path.push(this.pos.copy());
      if (optimize && frameCount % lim == 0) {
        this.paths.shift();
      }
    }
    console.log("LEN : ", this.paths.length);
  }

  show(trail = false, trail_col) {
    stroke(this.color);
    strokeWeight(2);
    noFill();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(
      -this.size,
      -this.size / 2,
      -this.size,
      this.size / 2,
      this.size,
      0
    );
    pop();
    if (trail) {
      for (let path of this.paths) {
        beginShape();
        for (let v of path) {
          strokeWeight(0.5);
          stroke(trail_col);
          vertex(v.x, v.y);
        }
        endShape();
      }
    }
  }

  wrap() {
    let hit = false;
    if (this.pos.x > width + this.size) {
      this.pos.x = -this.size;
      hit = true;
    } else if (this.pos.x < -this.size) {
      this.pos.x = width + this.size;
      hit = true;
    }
    if (this.pos.y > height + this.size) {
      this.pos.y = -this.size;
      hit = true;
    } else if (this.pos.y < -this.size) {
      this.pos.y = height + this.size;
      hit = true;
    }
    if (hit) {
      this.cur_path = [];
      this.paths.push(this.cur_path);
    }
  }
}
