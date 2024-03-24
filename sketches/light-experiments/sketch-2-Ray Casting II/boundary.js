class Boundary {
    constructor(x1, y1, x2, y2, thickness=1) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
        this.dir = p5.Vector.sub(this.b, this.a).normalize();
        this.thickness = thickness;
        this.brightness = 150;
        this.gray_value = 100;
    }

    illuminate(x, y, col) {
        push();
        blendMode(ADD)
        fill(col);
        noStroke();
        circle(x, y, 16);
        pop();
    }

    show() {
        stroke(this.gray_value, this.gray_value, this.gray_value, this.brightness);
        strokeWeight(this.thickness);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }

}