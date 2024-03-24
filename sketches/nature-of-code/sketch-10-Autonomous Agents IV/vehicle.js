function findProj(pos, a, b) {
    let v1 = p5.Vector.sub(a, pos);
    let v2 = p5.Vector.sub(b, pos);
    v2.normalize();
    let sp = v1.dot(v2);
    v2.mult(sp);
    v2.add(pos);
    return v2;
}

class Vehicle {
    constructor(x, y, max_speed, max_force, size, color = "#ffffff") {
        this.pos = createVector(x, y);
        this.vel = createVector(2, 2);
        this.acc = createVector(0, 0);
        this.maxSpeed = max_speed;
        this.maxForce = max_force;
        this.size = size;
        this.color = color;
        this.path = [];
    }

    follow(path) {
        // 1. Calculate the future position
        let future = this.vel.copy();
        future.mult(20);
        future.add(this.pos);

        if (diagram) {
            noStroke();
            fill(255, 0, 0);
            circle(future.x, future.y, 8);
        }

        // 2. Find the projection of the future position on the path
        let target = findProj(path.begin, future, path.end);

        if (diagram) {
            noStroke();
            fill(0, 255, 0);
            circle(target.x, target.y, 8);
        }

        // 3. If distance between the future point and the projection is within the radius, then seek the target
        let d = p5.Vector.dist(future, target);
        if (d > path.radius) {
            return this.seek(target);
        } else {
            return createVector(0, 0);
        }
    }

    seek(target, arrival = true) {
        let force = p5.Vector.sub(target, this.pos);
        let desiredSpeed = this.maxSpeed;
        if (arrival) {
            let slowRadius = 100;
            let distance = force.mag();
            if (distance < slowRadius) {
                desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
            }
        }
        force.setMag(desiredSpeed);
        force.sub(this.vel);
        force.limit(this.maxForce);
        return force;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(trail = false, optimize = false, freq = 100, clear_rate = 10) {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        if (trail) {
            this.path.push(this.pos.copy());
            if (optimize && frameCount % freq == 0) {
                this.path.splice(0, clear_rate);
            }
        }
    }

    show(trail = false, trail_col = "#ffffff") {
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
        if (trail) {
            beginShape();
            push();
            setLineDash([5, 5]);
            for (let p of this.path) {
                strokeWeight(0.5);
                stroke(trail_col);
                vertex(p.x, p.y);
            }
            endShape();
            pop();
        }
    }
}