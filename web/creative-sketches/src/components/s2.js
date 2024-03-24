
const sketch2 = ( p ) => { 

    console.log('the will of p : ', p);

    class Particle {
        constructor(x, y, g, lifespan, radius, mass, color, decay_rate, p) {
            this.p = p;
            this.pos = this.p.createVector(x, y);
            this.vel = this.p.createVector(this.p.random(-1, 1), 0);
            this.acc = this.p.createVector(0, 0);
            this.radius = radius;
            this.mass = mass;
            this.lifespan = lifespan;
            this.decay_rate = decay_rate;
            this.gravity = g;
            this.color = color;
        }
    
        applyForce(force) {
            let f = p5.Vector.div(force, this.mass);
            this.acc.add(f);
        }
    
        done() {
            return this.lifespan <= 0;
        }
    
        update() {
            this.applyForce(this.gravity);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.lifespan -= this.decay_rate;
        }
    
        show() {
            if (this.done()) {
                this.hide();
            }
            this.p.noStroke();
            this.p.fill(this.color);
            this.p.circle(this.pos.x, this.pos.y, this.radius);
        }
        hide() {
            this.p.noStroke();
            this.p.noFill();
        }
    }

    class ParticleSystem {
        constructor(x, y, g, c, p) {
            this.p = p;
            this.pos = this.p.createVector(x, y);
            this.particles = [];
            this.gravity = this.p.createVector(g.x, g.y);
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
                        decay_rate, 
                        this.p
                    )
                );
            }
        }
        update() {
            for (let i = 0; i < this.particles.length; i++) {
                let particle = this.particles[i];
                if (particle.done()) {
                    this.particles.splice(i, 1);
                }
                particle.update();
            }
        }
        show() {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].show();
            }
        }
    }

    const PARAMS = {
        lifespan: 255,
        decay_rate: 1,
    
        rand_mass: false,
        mass: 400,
        mass_range: 400,
    
        rand_radius: false,
        radius: 4,
        radius_range: 16,
    
        gravity: {
            x: 0,
            y: 0.4,
        },
    
        oTrail: 24,
        pause: false,
        color: "#ff0023",
    };
    
    let particleSystems = [];
    const width = p.windowWidth - 400;
    const height = p.windowHeight - 50;

    const createPane = () => {
        const controlContainer = document.getElementById("controls");
        const pane = new Tweakpane.Pane({
            container: controlContainer,
        });
    
        const tab = pane.addTab({
            pages: [{ title: "Parameters" }, { title: "Others" }],
        });
    
        const folder1 = tab.pages[0].addFolder({
            title: "Particle",
        });
        const folder2 = tab.pages[0].addFolder({
            title: "Particle System",
        });
    
        const folder3 = tab.pages[0].addFolder({
            title: "General",
        });
        const folder4 = tab.pages[1].addFolder({
            title: "Defaults",
        });
        const folder5 = tab.pages[1].addFolder({
            title: "Preferences",
        });
    
        folder1.addInput(PARAMS, "lifespan", { min: 50, max: 1000, step: 1 });
        folder1.addInput(PARAMS, "decay_rate", { min: 0.01, max: 10, step: 0.001 });
        folder2.addInput(PARAMS, "gravity", {
            x: { min: -1, max: 1 },
            y: { min: -1, max: 1 },
        });
        folder2.addInput(PARAMS, "rand_mass").on("change", (ev) => {
            if (ev.value) {
                mass_range.disabled = false;
            } else {
                mass_range.disabled = true;
            }
        });
        const mass_range = folder2.addInput(PARAMS, "mass_range", {
            min: 50,
            max: 800,
            step: 1,
        });
        folder2.addInput(PARAMS, "rand_radius").on("change", (ev) => {
            if (ev.value) {
                radius_range.disabled = false;
            } else {
                radius_range.disabled = true;
            }
        });
        const radius_range = folder2.addInput(PARAMS, "radius_range", {
            min: 1,
            max: 16,
            step: 0.1,
        });
    
        folder3.addInput(PARAMS, "oTrail", { min: -200, max: 400, step: 1 });
        folder3.addInput(PARAMS, "pause");
    
        folder4.addInput(PARAMS, "mass", {
            min: 50,
            max: 800,
            step: 1,
        });
        folder4.addInput(PARAMS, "radius", {
            min: 1,
            max: 16,
            step: 0.1,
        });
        folder5.addInput(PARAMS, "color");
    };
    
    p.doubleClicked = () => {
        if (p.mouseX < width && p.mouseY < height) {
            particleSystems.push(new ParticleSystem(p.mouseX, p.mouseY, PARAMS.gravity, PARAMS.color, p));
        }
    }
    

    p.setup = () => {
        createPane();
        p.createCanvas(width, height);
        p.background(0);
        particleSystems.push(new ParticleSystem(width / 2, 100, PARAMS.gravity, PARAMS.color, p));
    }

    p.draw = () => {
        if (PARAMS.pause) {
            return;
        }
        p.background(0, PARAMS.oTrail);
        for (let ps of particleSystems) {
            let m, r;
            if (PARAMS.rand_mass) {
                m = p.random(50, PARAMS.mass_range);
            } else {
                m = PARAMS.mass;
            }
            if (PARAMS.rand_radius) {
                r = p.random(1, PARAMS.radius_range);
            } else {
                r = PARAMS.radius;
            }
            ps.addParticles(
                1,
                PARAMS.lifespan,
                r,
                m,
                PARAMS.color,
                PARAMS.decay_rate,
                PARAMS.gravity, 
            );
            ps.update();
            ps.show();
        }
    }

};

export default sketch2;