class Target {
    constructor(x, y, motion, color, vx = 0, vy = 0, ax = 0, ay = 0) {
        this.pos = createVector(x, y);
        this.color = color;
        this.motion = motion;
        this.vel = createVector(vx, vy);
        this.acc = createVector(ax, ay);
        this.size = 32;
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
    update() {
        if (this.motion) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.set(0, 0);
        }
    }
    show() {
        strokeWeight(2);
        stroke(this.color);
        noFill();
        circle(this.pos.x, this.pos.y, 32);
    }
}