class Koch {
    constructor(a, b) {
        this.a = a.copy();
        this.b = b.copy();
    }

    generate() {
        let children = [];

        let v = p5.Vector.sub(this.b, this.a);
        v.div(3);

        // Segment 0
        let b1 = p5.Vector.add(this.a, v);
        children[0] = new Koch(this.a, b1);

        // Segment 3
        let a1 = p5.Vector.sub(this.b, v);
        children[3] = new Koch(a1, this.b);

        v.rotate(-PI / 3);
        let c = p5.Vector.add(b1, v);

        // Segment 1
        children[1] = new Koch(b1, c);

        // Segment 3
        children[2] = new Koch(c, a1);
        return children;
    }

    show() {
        stroke(255);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}