class Vehicle {
    constructor(x, y, max_speed, max_force, size, color = "#ffffff") {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = max_speed;
        this.maxForce = max_force;
        this.dna = []
        this.dna[0] = random(-5, 5);
        this.dna[1] = random(-5, 5);
        this.health = 1;
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

    seek(target) {
        var desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxspeed);

        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);

        return steer;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show() {

        var angle = this.vel.heading() + PI / 2;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);

        strokeWeight(3);
        stroke(0, 255, 0);
        noFill();
        line(0, 0, 0, -this.dna[0] * 10);
        strokeWeight(2);
        ellipse(0, 0, this.dna[2] * 2);
        stroke(255, 0, 0);
        line(0, 0, 0, -this.dna[1] * 10);
        ellipse(0, 0, this.dna[3] * 2);

        fill(255);
        noStroke();

        let green = color(0, 255, 0);
        let red = color(255, 0, 0);
        let col = lerpColor(red, green, this.health);

        fill(col);
        stroke(col)

        beginShape();
        vertex(0, -this.size * 2);
        vertex(-this.size, this.size * 2);
        vertex(this.size, this.size * 2);
        endShape(CLOSE);

        pop();
    }

    dead() {
        return (this.health < 0)
    }

    behaviours(good, bad) {
        let steerG = this.eat(good, 0.1);
        let steerB = this.eat(bad, -0.2);

        steerG.mult(this.dna[0])
        steerB.mult(this.dna[1])

        this.applyForce(steerG);
        this.applyForce(steerB);

    }

    eat(arr, nutrition) {
        let minDist = Infinity;
        let closestIndex = -1;
        for (let i = arr.length - 1; i >= 0; i--) {
            let d = this.pos.dist(arr[i]);
            if (d < minDist) {
                minDist = d;
                closestIndex = i;
            }
        }

        // Eat and delete OR seek it
        if (minDist < 10) {
            arr.splice(closestIndex, 1);
            this.health += nutrition;
        } else if (closestIndex > -1) {
            return this.seek(arr[closestIndex])
        }

        return createVector(0, 0);

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