class Branch {
    constructor(parent, pos, dir) {
        this.parent = parent;
        this.pos = pos;
        this.dir = dir;
        this.originalDir = this.dir.copy();
        this.count = 0;
        this.len = 10;
    }
    next() {
        let nextDir = p5.Vector.mult(this.dir, this.len);
        let nextPos = p5.Vector.add(this.pos, nextDir);
        let nextBranch = new Branch(this, nextPos, this.dir.copy());
        return nextBranch;
    }
    reset() {
        this.dir = this.originalDir.copy();
    }
    show() {
        if (this.parent != null) {
            stroke(255);
            strokeWeight(1);
            line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
        }
    }
}