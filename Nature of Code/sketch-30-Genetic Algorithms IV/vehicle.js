class Vehicle {
    constructor(x, y, color = "#ffffff", dna = [1, 1, random(1, 100), random(1, 100)], mutationRate = 0.1) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = random(0, 10);
        this.maxForce = random(0, 10);
        this.mutationRate = mutationRate;
        this.dna = dna

        for (let i = 0; i < dna.length; i++) {
            if (random(1) < this.mutationRate) {
                if (i > 1) {
                    this.dna[i] += random(-10, 10)
                } else {
                    this.dna[i] += random(-0.1, 0.1)
                }
            }
        }
        // this.dna[0] = random(-2, 2); // Food Weight
        // this.dna[1] = random(-2, 2); // Poision Weight
        // this.dna[2] = random(1, 100); // Food Perception : like a radius
        // this.dna[3] = random(1, 100); // Poision Perception : like a radius
        this.health = 1;

        this.size = 4;
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
        this.health -= 0.0001;
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    show(show_perc) {

        var angle = this.vel.heading() + PI / 2;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(angle);

        if (show_perc) {

            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[0] * 20);
            strokeWeight(0.5);
            ellipse(0, 0, this.dna[2] * 2);

            strokeWeight(2);
            strokeWeight(0.5);
            ellipse(0, 0, this.dna[2] * 2);

            stroke(255, 0, 0);
            noFill();
            ellipse(0, 0, this.dna[3] * 2);
            noFill();

            strokeWeight(3);
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -this.dna[1] * 20);
        }

        fill(255);
        noStroke();

        let green = color(255, 255, 255);
        let red = color(255, 0, 0);
        let col = lerpColor(red, green, this.health);
        // let col = color(255, 255, 255)
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
        let steerG = this.eat(good, 0.1, this.dna[2]);
        let steerB = this.eat(bad, -0.2, this.dna[3]);

        steerG.mult(this.dna[0])
        steerB.mult(this.dna[1])

        this.applyForce(steerG);
        this.applyForce(steerB);

    }

    eat(arr, nutrition, perception) {
        let minDist = Infinity;
        let closest = null;
        for (let i = arr.length - 1; i >= 0; i--) {
            let d = this.pos.dist(arr[i]);

            // EAT and DELETER OR SEEK it
            if (d < this.maxSpeed) {
                arr.splice(i, 1);
                this.health += nutrition;
            } else {
                // Can not EAT and be ATTRACTED to it at the same time
                if (d < minDist && d < perception) {
                    minDist = d;
                    closest = arr[i];
                }

            }
        }

        if (closest != null) {
            return this.seek(closest);
        }

        return createVector(0, 0);

    }

    clone(repr_rate = 0.001) {
        if (random(1) < repr_rate) {
            let n = new Vehicle(this.pos.x, this.pos.y, this.size, "#ffffff", this.dna, mutationRate = this.mutationRate);
            return n;

        }
    }

    boundaries() {
        let d = 25;
        let desired = null;

        if (this.pos.x < d) {
            desired = createVector(this.maxSpeed, this.vel.y);
        } else if (this.pos.x > width - d) {
            desired = createVector(-this.maxSpeed, this.vel.y);
        }

        if (this.pos.y < d) {
            desired = createVector(this.vel.x, this.maxSpeed);
        } else if (this.pos.y > height - d) {
            desired = createVector(this.vel.x, -this.maxSpeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxSpeed);
            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
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