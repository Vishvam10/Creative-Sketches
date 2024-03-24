class CA {
    constructor(rules, width, wc) {
        this.cells = [];
        this.rules = rules;
        this.width = width;
        this.wc = wc;
        let n = parseInt(this.width / wc);

        for (let i = 0; i < n; i++) {
            this.cells[i] = 0;
        }
        this.cells[parseInt(n / 2)] = 1;
        this.gen = 0;
    }
    show() {
        for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i] == 0) {
                fill(255, 0, 0);
            } else {
                fill(255);
            }
            noStroke();
            rect(i * this.wc, -this.gen * this.wc, this.wc, this.wc);
        }
    }
    update() {
        let next_gen = [];
        for (let i = 1; i < this.cells.length - 1; i++) {
            let left = this.cells[i - 1];
            let middle = this.cells[i - 1];
            let right = this.cells[i + 1];
            next_gen[i] = this.rule_lookup(left, middle, right);
        }
        this.cells = next_gen;
        this.gen++;
    }

    rule_lookup(left, middle, right) {
        let s = `${left}${middle}${right}`;
        let num = parseInt(s, 2);
        return this.rules[num];
    }
}