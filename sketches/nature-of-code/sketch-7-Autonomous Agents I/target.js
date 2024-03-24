class Target {
    constructor(x, y, motion, color, vx = 0, vy = 0, ax = 0, ay = 0) {
        this.pos = createVector(x, y);
        this.color = color;
        this.motion = motion;
        this.vel = createVector(vx, vy);
        this.acc = createVector(ax, ay);
    }
    update() {
        if (this.motion) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.set(0, 0);
        }
        // console.log(this.acc);
    }
    show() {
        strokeWeight(2);
        stroke(this.color);
        noFill();
        circle(this.pos.x, this.pos.y, 32);
    }
}