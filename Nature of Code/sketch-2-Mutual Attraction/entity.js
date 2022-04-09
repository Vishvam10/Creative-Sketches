class Entity {
    constructor(x, y, vx, vy, m) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.r = sqrt(this.mass);
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(obj, G) {
        let force = p5.Vector.sub(this.pos, obj.pos);
        let distanceSq = constrain(force.magSq(), 10, 100);
        let strength = (G * (this.mass * obj.mass)) / distanceSq;
        force.setMag(strength);
        obj.applyForce(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show() {
        stroke(255, 255, 255, 50);
        fill("black");
        ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
}