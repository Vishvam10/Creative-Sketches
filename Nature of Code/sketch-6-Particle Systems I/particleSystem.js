class ParticleSystem {
    constructor(x, y, g, c) {
        this.pos = createVector(x, y);
        this.particles = [];
        this.gravity = createVector(g.x, g.y);
        this.color = c;
    }
    addParticles(n, lifespan, radius, mass, decay_rate, gravity) {
        for (let i = 0; i < n; i++) {
            this.particles.push(
                new Particle(
                    this.pos.x,
                    this.pos.y,
                    this.gravity,
                    lifespan,
                    radius,
                    mass,
                    this.color,
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