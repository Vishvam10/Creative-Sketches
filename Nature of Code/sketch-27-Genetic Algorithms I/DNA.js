const newChar = () => {
    let c = floor(random(63, 122));
    if (c === 63) c = 32;
    if (c === 64) c = 46;
    return String.fromCharCode(c);
}

class DNA {
    constructor(n) {
        this.genes = [];
        this.fitness = 0;
        for (let i = 0; i < n; i++) {
            let c = newChar()
            this.genes.push(c)
        }
    }
    calcFitness(target) {
        let score = 0;
        for (let i = 0; i < this.genes.length; i++) {
            if (this.genes[i] == target.charAt(i)) {
                score++;
            }
        }
        this.fitness = score / target.length;
    }

    crossover(partner) {
        let child = new DNA(this.genes.length);
        let midpoint = floor(random(this.genes.length));

        // Half from one, half from the other
        for (let i = 0; i < this.genes.length; i++) {
            if (i > midpoint) {
                child.genes[i] = this.genes[i];
            } else {
                child.genes[i] = partner.genes[i];
            }
        }
        return child;
    }
    mutate(mutationRate) {
        for (let i = 0; i < this.genes.length; i++) {
            if (random(1) < mutationRate) {
                this.genes[i] = newChar();
            }
        }
    }
    getPhrase() {
        return this.genes.join("");
    }
}