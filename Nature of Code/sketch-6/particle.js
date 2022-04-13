class Particle {
    constructor(x, y, g, lifespan, radius, mass, color, decay_rate) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), 0);
        this.acc = createVector(0, 0);
        this.radius = radius;
        this.mass = mass;
        this.lifespan = lifespan;
        this.decay_rate = decay_rate;
        this.gravity = createVector(0, g);
        this.color = color;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    done() {
        return this.lifespan <= 0;
    }

    update() {
        this.applyForce(this.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.lifespan -= this.decay_rate;
    }

    show() {
        if (this.done()) {
            this.hide();
        }
        noStroke();
        fill(this.color);
        circle(this.pos.x, this.pos.y, this.radius);
    }
    hide() {
        noStroke();
        noFill();
    }
}