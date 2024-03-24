class Path {
    constructor(x1, y1, x2, y2, radius, color = "#ffffff") {
        this.begin = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.color = color;
        this.radius = radius;
    }
    show() {
        strokeWeight(1);
        stroke(this.color);
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);

        strokeWeight(this.radius * 2);
        stroke(255, 255, 255, 50);
        line(this.begin.x, this.begin.y, this.end.x, this.end.y);
    }
}