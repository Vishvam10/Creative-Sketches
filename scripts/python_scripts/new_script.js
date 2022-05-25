var sketch = function(p) {

 class Entity {
    constructor(x, y, vx, vy, m) {
        this.pos = p.createVector(x, y);
        this.vel = p.createVector(vx, vy);
        this.acc = p.createVector(0, 0);
        this.mass = m;
        this.r = p.sqrt(this.mass);
        this.G = 0.005;
    }

    applyForce(force) {
        let f = p.p.p5.Vector.div(force, this.mass);
        this.acc.add(f);
    }

    attract(obj) {
        let force = p.p.p5.Vector.sub(this.pos, obj.pos);
        let distanceSq = p.constrain(force.magSq(), 10, 100);
        let strength = (this.G * (this.mass * obj.mass)) / distanceSq;
        force.setMag(strength);
        obj.applyForce(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.p.set(0, 0);
    }

    show() {
        p.stroke(255, 255, 255, 50);
        p.fill("black");
        p.ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
    updateProperties(data) {
        let d = p.dist(
            p.mouseX - p.width / 2,
            p.mouseY - p.height / 2,
            this.pos.x,
            this.pos.y
        );
        console.log("DISTANCE : ", d < this.r);
        if (d < this.r) {
            if (data.shiftKey) {
                let new_G = data.y / 500;
                console.log("G : ", new_G);
                this.G = p.constrain(new_G, -0.02, 0.02);
            } else {
                this.mass = p.abs(data.y * 50);
                this.r = p.sqrt(this.mass);
            }
        }
    }
} 
}

var sketch = new p5(sketch, 'div1');