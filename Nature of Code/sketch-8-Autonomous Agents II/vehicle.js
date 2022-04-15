class Vehicle {
    constructor(x, y, max_speed, max_force, size, color = "#ffffff") {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = max_speed;
        this.maxForce = max_force;
        this.size = size;
        this.color = color;
    }

    pursue(vehicle, trail) {
        let target = vehicle.pos.copy();
        let prediction = vehicle.vel.copy().mult(10);
        target.add(prediction);
        if (trail) {
            push();
            stroke(255);
            strokeWeight(0.5);
            noFill();
            line(this.pos.x, this.pos.y, target.x, target.y);
            pop();
        }
        push();
        noStroke();
        fill(0, 255, 0);
        circle(target.x, target.y, 16);
        pop();
        return this.seek(target);
    }

    evade(vehicle) {
        let pursuit = this.pursue(vehicle);
        pursuit.mult(-1);
        return pursuit;
    }

    flee(target) {
        return this.seek(target).mult(-1);
    }

    seek(target, arrive = true) {
        let desired = p5.Vector.sub(target, this.pos);
        let mag = this.maxSpeed;
        if (arrive) {
            if (desired.mag() < 100) {
                mag = map(desired.mag(), 0, 200, 0, this.maxSpeed);
            }
        }
        desired.setMag(mag);
        let steering = p5.Vector.sub(desired, this.vel);
        return steering;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show() {
        stroke(this.color);
        strokeWeight(2);
        noFill();
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        triangle(-this.size, -this.size / 2, -this.size,
            this.size / 2,
            this.size,
            0
        );
        pop();
    }

    bounce() {
        if (this.pos.x > width + this.size || this.pos.x < -this.size) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height + this.size || this.pos.y < -this.size) {
            this.vel.y *= -1;
        }
    }

    wrap() {
        if (this.pos.x > width + this.size) {
            this.pos.x = -this.size;
        } else if (this.pos.x < -this.size) {
            this.pos.x = width + this.size;
        }
        if (this.pos.y > height + this.size) {
            this.pos.y = -this.size;
        } else if (this.pos.y < -this.size) {
            this.pos.y = height + this.size;
        }
    }
}