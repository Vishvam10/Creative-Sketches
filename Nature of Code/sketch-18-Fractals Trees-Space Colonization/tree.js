class Tree {
    constructor(min_dist, max_dist) {
        this.leaves = [];
        this.branches = [];
        this.min_dist = min_dist;
        this.max_dist = max_dist;

        for (let i = 0; i < 200; i++) {
            this.leaves.push(new Leaf());
        }

        let pos = createVector(width / 2, height);
        let dir = createVector(0, -1);
        let root = new Branch(null, pos, dir);
        let cur = root;
        this.branches.push(root);

        let found = false;
        while (!found) {
            for (let i = 0; i < this.leaves.length; i++) {
                let d = p5.Vector.dist(cur.pos, this.leaves[i].pos);
                if (d < this.max_dist) {
                    found = true;
                }
            }

            if (!found) {
                let branch = cur.next();
                cur = branch;
                this.branches.push(cur);
            }
        }
    }

    grow(strength = 1, min_dist, max_dist) {
        for (let i = 0; i < this.leaves.length; i++) {
            let leaf = this.leaves[i];
            let closestBranch = null;
            let md = 100000;

            for (let j = 0; j < this.branches.length; j++) {
                let branch = this.branches[j];
                let d = p5.Vector.dist(leaf.pos, branch.pos);
                if (d < min_dist) {
                    leaf.reached = true;
                    closestBranch = null;
                    break;
                } else if (d > max_dist) {
                    continue;
                } else if (closestBranch == null || d < md) {
                    closestBranch = branch;
                    md = d;
                }
            }

            if (closestBranch != null) {
                let newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
                newDir.normalize().mult(strength);
                closestBranch.dir.add(newDir);
                closestBranch.count++;
            }
        }

        // Delete the leaves that are too close to a branch
        for (let i = this.leaves.length - 1; i >= 0; i--) {
            let leaf = this.leaves[i];
            if (leaf.reached) {
                this.leaves.splice(i, 1);
            }
        }

        // Branches that are attracted by leaves
        for (let i = this.branches.length - 1; i >= 0; i--) {
            let branch = this.branches[i];
            if (branch.count > 0) {
                // Average force - Simply the magnitude of dir / no of forces acting on it. This causes the bending
                branch.dir.div(branch.count + 1);
                let newPos = p5.Vector.add(branch.pos, branch.dir);
                let newBranch = new Branch(branch, newPos, branch.dir.copy());
                this.branches.push(newBranch);
            }
            branch.reset();
        }
    }

    removeNth(arr, n) {
        for (let i = n - 1; i < arr.length; i += n) {
            arr.splice(i, 1);
        }
        return arr;
    }

    optimize(freq = 20) {
        if (this.branches.length / 100 > 50) {
            this.branches = this.removeNth(this.branches, freq);
        }
    }

    show(color = "#ffffff", line_wt) {
        for (let i = 0; i < this.leaves.length; i++) {
            this.leaves[i].show(color);
        }
        for (let i = 0; i < this.branches.length; i++) {
            this.branches[i].show(color, line_wt);
        }
    }
}