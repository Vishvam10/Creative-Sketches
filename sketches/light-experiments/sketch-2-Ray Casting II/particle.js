class Particle {
    constructor(x, y, ang_inc=4, color, radius=16) {
        this.pos = createVector(x, y);
        this.ang_inc = ang_inc;
        this.rays = [];
        this.color = color;
        this.r = radius;
        for(let a=0; a<360; a+=this.ang_inc) {
            this.rays.push(new Ray(this.pos, radians(a), this.color));
        }

    }

    look(walls, show_rays=true) {
        for(let ray of this.rays) {
            let closest_pt = null;
            let min_dist = Infinity;
            let chosen_wall = null;
            for(let wall of walls) {
                const pt = ray.cast(wall);
                if(pt) {
                    let d = p5.Vector.dist(this.pos, pt);
                    if(d < min_dist) {
                        min_dist = d;
                        closest_pt = pt;
                        chosen_wall = wall;
                    }
                }
            }
            if(closest_pt) {
                chosen_wall.illuminate(closest_pt.x, closest_pt.y, this.color);
                if(show_rays) {
                    line(this.pos.x, this.pos.y, closest_pt.x, closest_pt.y);
                }
            }
        }
    }

    update(x, y) {
        this.pos.set(x, y);
    }

    updateParticleColor(col) {
        this.color = col;
    }

    updateRayColor(col) {
        for(let ray of this.rays) {
            ray.updateRayColor(col)
        }
    }

    updateRaysPerAngle(ang_inc) {
        this.ang_inc = ang_inc;
        this.rays = [];
        for(let a=0; a<360; a+=this.ang_inc) {
            this.rays.push(new Ray(this.pos, radians(a), this.color));
        }

    }

    move(vx, vy) {
        this.pos.x += vx;
        this.pos.y += vy
    }

    wrap() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

    show(show_rays=true) {
        push();
        fill(this.color);
        noStroke();
        circle(this.pos.x, this.pos.y, this.r);
        pop();
        if(show_rays) {
            for(let ray of this.rays) {
                ray.show();
            }
        }
    }

}