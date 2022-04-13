class ParticleSystem {
    constructor(x, y, g) {
        this.pos = createVector(x, y);
        this.particles = [];
        this.g = g;
    }
    addParticles(n, lifespan, radius, mass, color, decay_rate) {
        console.log("1 : ", lifespan);
        for (let i = 0; i < n; i++) {
            this.particles.push(
                new Particle(
                    this.pos.x,
                    this.pos.y,
                    this.g,
                    lifespan,
                    radius,
                    mass,
                    color,
                    decay_rate
                )
            );
        }
    }
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            if (p.done()) {
                this.particles.splice(i, 1);
            }
            p.update();
        }
    }
    show() {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.show();
        }
    }
}