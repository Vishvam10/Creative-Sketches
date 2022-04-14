class Pendulum {
  constructor(ox, oy, al, m, ang) {
    this.origin = createVector(ox, oy);
    this.pos = createVector();
    this.angle = ang;
    this.aVel = 0.0;
    this.aAcc = 0.0;
    this.mass = m;
    this.r = sqrt(this.mass) / 5;
    this.arm_length = al;
  }

  update(data) {
    this.aAcc = (-1 * data.gravity * sin(this.angle)) / this.arm_length;
    this.aVel += this.aAcc;
    this.aVel *= data.damping;
    this.angle += this.aVel;
  }

  show(data) {
    this.pos.set(
      this.arm_length * sin(this.angle),
      this.arm_length * cos(this.angle),
      0
    );
    this.pos.add(this.origin);
    if (data.show_arm) {
      let ac = data.arm_color ? data.arm_color : "#ffffff";
      stroke(ac);
      strokeWeight(0.5);
      line(this.origin.x, this.origin.y, this.pos.x, this.pos.y);
    }
    if (data.show_bob) {
      let bc = data.bob_color ? data.bob_color : "#df8d00";
      ellipseMode(CENTER);
      noStroke();
      fill(bc);
      ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
  }
}
