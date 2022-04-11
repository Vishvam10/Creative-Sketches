class Pendulum {
    constructor(ox, oy, al, m) {
        this.origin = createVector(ox, oy);
        this.pos = createVector();
        this.angle = PI / 4;
        this.aVel = 0.0;
        this.aAcc = 0.0;
        this.damping = 1;
        this.mass = m;
        this.r = sqrt(this.mass);
        this.arm_length = al;
    }

    update() {
        let gravity = 0.5;
        this.aAcc = (-1 * gravity * sin(this.angle)) / this.arm_length;
        this.aVel += this.aAcc;
        this.aVel *= this.damping;
        this.angle += this.aVel;
    }

    show() {
            this.pos.set(
                this.arm_length * sin(this.angle),
                this.arm_length * cos(this.angle),
                0
            );
            this.pos.add(this.origin);

            stroke(255);
            strokeWeight(2);
            line(this.origin.x, this.origin.y, this.pos.x, this.pos.y);

            ellipseMode(CENTER);
            fill(127);
            ellipse(this.pos.x, this.pos.y, this.r, this.r);
        }
        // updateProperties(data) {
        //     let d = dist(
        //         mouseX - width / 2,
        //         mouseY - height / 2,
        //         this.pos.x,
        //         this.pos.y
        //     );
        //     console.log("DISTANCE : ", d < this.r);
        //     if (d < this.r) {
        //         if (data.shiftKey) {
        //             let new_G = data.y / 500;
        //             console.log("G : ", new_G);
        //             this.G = constrain(new_G, -0.02, 0.02);
        //         } else {
        //             this.mass = abs(data.y * 50);
        //             this.r = sqrt(this.mass);
        //         }
        //     }
        // }
}