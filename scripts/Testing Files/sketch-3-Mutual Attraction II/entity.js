class Entity {
    constructor(x, y, vx, vy, m) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
        this.acc = createVector(0, 0);
        this.mass = m;
        this.r = sqrt(this.mass);
        this.G = 0.005;
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(obj) {
        let force = p5.Vector.sub(this.pos, obj.pos);
        let distanceSq = constrain(force.magSq(), 10, 100);
        let strength = (this.G * (this.mass * obj.mass)) / distanceSq;
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
    updateProperties(data) {
        let d = dist(
            mouseX - width / 2,
            mouseY - height / 2,
            this.pos.x,
            this.pos.y
        );
        console.log("DISTANCE : ", d < this.r);
        if (d < this.r) {
            if (data.shiftKey) {
                let new_G = data.y / 500;
                console.log("G : ", new_G);
                this.G = constrain(new_G, -0.02, 0.02);
            } else {
                this.mass = abs(data.y * 50);
                this.r = sqrt(this.mass);
            }
        }
    }
}