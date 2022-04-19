class Vehicle {
    constructor(x, y, max_speed, max_force, size, color = "#ffffff") {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = max_speed;
        this.maxForce = max_force;
        this.size = size;
        this.color = color;

        this.cur_path = [];
        this.paths = [this.cur_path];
    }

    follow(field) {
        let desired = field.lookup(this.pos);
        desired.mult(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.vel);
        // steer.limit(this.maxForce);
        return steer;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(trail = false, optimize = false, lim = 1000) {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        if (trail) {
            this.cur_path.push(this.pos.copy());
            if (optimize && frameCount % lim == 0) {
                this.paths.shift();
            }
        }
    }

    show(trail = false, trail_col) {
        fill(this.color);
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
            for (let path of this.paths) {
                beginShape();
                pop();
                // setLineDash([5, 5]);
                for (let v of path) {
                    strokeWeight(1);
                    noFill();
                    stroke(trail_col);
                    vertex(v.x, v.y);
                }
                push();
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