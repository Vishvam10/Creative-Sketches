class Entity {
    constructor(x, y, vx=0, vy=0, radius=2, m=10, color="rgba(255, 255, 255, 1)") {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.color = color;
        this.r = radius;
    }

    applyForce(force) {
      let f = p5.Vector.div(force, this.mass);
      this.acc.add(f);
    }

    applyVelocity(velocity, dir) {
        if(dir == 1) {
            this.pos.add(velocity);
        } else {
            this.pos.sub(velocity);
        }
    }

    // attract(obj) {
    //   let force = p5.Vector.sub(this.pos, obj.pos);
    //   let distanceSq = constrain(force.magSq(), 10, 100);
    //   let strength = (this.G * (this.mass * obj.mass)) / distanceSq;
    //   force.setMag(strength);
    //   obj.applyForce(force);
    // }

    wrap() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }
    update() {
        this.vel.add(this.acc);
        // this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show(col=this.color) {
        // stroke(255, 255, 255, 50);
        noStroke();
        fill(col);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}