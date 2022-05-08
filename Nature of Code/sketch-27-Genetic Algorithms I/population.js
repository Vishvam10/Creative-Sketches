class Population {
    constructor(target, mutationRate, n) {
        this.population;
        this.matingPool;
        this.generations = 0;
        this.finished = false;
        this.target = target;
        this.mutationRate = mutationRate;
        this.perfectScore = 1;

        this.best = "";

        this.population = [];
        for (let i = 0; i < n; i++) {
            this.population[i] = new DNA(this.target.length);
        }
        this.matingPool = [];
        this.calcFitness();
    }
    calcFitness() {
        for (let i = 0; i < this.population.length; i++) {
            this.population[i].calcFitness(target);
        }
    }
    naturalSelection() {
        this.matingPool = [];
        let maxFitness = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > maxFitness) {
                maxFitness = this.population[i].fitness;
            }
        }
        // If fitness is high, then the DNA has a higher preference and if it is low, then DNA has a lower preference. We can use map() to do it easily.

        // Also, to simulate higher / lower preference, we can include that specfic element many / fewer times in the mating poo; i.e create duplicate to increase / decrease the probability of getting chosen
        for (let i = 0; i < this.population.length; i++) {
            let fitness = map(this.population[i].fitness, 0, maxFitness, 0, 1);
            let n = floor(fitness * 100);
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.population[i])
            }
        }
    }
    generate() {
        // Refill the population with children from the mating pool
        for (let i = 0; i < this.population.length; i++) {
            let a = floor(random(this.matingPool.length));
            let b = floor(random(this.matingPool.length));
            let partnerA = this.matingPool[a];
            let partnerB = this.matingPool[b];

            let child = partnerA.crossover(partnerB);
            child.mutate(this.mutationRate);

            this.population[i] = child;
        }
        this.generations++;
    }

    // Compute the current "most fit" member of the population
    evaluate() {
        let highScore = 0.0;
        let index = 0;
        for (let i = 0; i < this.population.length; i++) {
            if (this.population[i].fitness > highScore) {
                index = i;
                highScore = this.population[i].fitness;
            }
        }

        this.best = this.population[index].getPhrase();
        if (highScore === this.perfectScore) {
            this.finished = true;
        }
    }
    getBest() {
        return this.best;
    }
    isFinished() {
        return this.finished;
    }

    getGenerations() {
        return this.generations;
    }

    getAverageFitness() {
        let total = 0;
        for (let i = 0; i < this.population.length; i++) {
            total += this.population[i].fitness;
        }
        return total / this.population.length;
    }

    allPhrases() {
        let everything = "";

        let displayLimit = min(this.population.length, 20);

        for (let i = 0; i < displayLimit; i++) {
            everything += i + "  " +
                this.population[i].getPhrase() + "<br>";
        }
        return everything;
    }
}