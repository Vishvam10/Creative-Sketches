class Leaf {
    constructor() {
        this.pos = createVector(random(width), random(height - 200));
        this.reached = false;
    }
    show() {
        fill(0, 255, 0);
        noStroke();
        circle(this.pos.x, this.pos.y, 4);
    }
}