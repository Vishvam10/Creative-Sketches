class Leaf {
    constructor() {
        this.pos = createVector(random(width), random(height - 200));
        this.reached = false;
    }
    show(color) {
        fill(color);
        noStroke();
        circle(this.pos.x, this.pos.y, 4);
    }
}