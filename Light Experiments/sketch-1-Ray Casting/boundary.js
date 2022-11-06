class Boundary {
    constructor(x1, y1, x2, y2, thickness=1, brightness=255) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
        this.thickness = thickness;
        this.brightness = 255;
    }

    show() {
        stroke(255, 255, 255, this.brightness);
        strokeWeight(this.thickness);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

}