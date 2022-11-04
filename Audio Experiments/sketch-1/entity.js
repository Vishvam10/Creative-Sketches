class Entity {
    constructor(x, y, vx=0, vy=0, radius=8, m=10, color="rgba(255, 255, 255, 1)") {
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

    // attract(obj) {
    //   let force = p5.Vector.sub(this.pos, obj.pos);
    //   let distanceSq = constrain(force.magSq(), 10, 100);
    //   let strength = (this.G * (this.mass * obj.mass)) / distanceSq;
    //   force.setMag(strength);
    //   obj.applyForce(force);
    // }

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

    update() {
        this.vel.add(this.acc);
        // this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show() {
        stroke(255, 255, 255, 50);
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.r * 2);
    }
}