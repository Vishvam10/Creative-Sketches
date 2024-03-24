class Branch {
    constructor(parent, pos, dir) {
        this.parent = parent;
        this.pos = pos;
        this.dir = dir;
        this.originalDir = this.dir.copy();
        this.count = 0;
    }
    next(len) {
        let nextDir = p5.Vector.mult(this.dir, len);
        let nextPos = p5.Vector.add(this.pos, nextDir);
        let nextBranch = new Branch(this, nextPos, this.dir.copy());
        return nextBranch;
    }
    reset() {
        this.dir = this.originalDir.copy();
    }
    show(color, line_wt = 2) {
        if (this.parent != null) {
            stroke(color);
            strokeWeight(line_wt);
            line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
        }
    }
}