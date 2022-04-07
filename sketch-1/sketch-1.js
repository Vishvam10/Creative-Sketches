class Vector {
    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    norm() {
        if (this.mag != 0) {
            this.x = this.x / this.mag();
            this.y = this.y / this.mag();
        }
    }
    limit(value) {
        if (this.mag() > value) {
            return new Vector(value, value);
        }
        return;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return new Vector(this.x, this.y);
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return new Vector(this.x, this.y);
    }
    mult(value) {
        this.x *= value;
        this.y *= value;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    div(value) {
        this.x /= value;
        this.y /= value;
    }
    dist(v) {
        return Math.sqrt(
            (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y)
        );
    }
}

class Entity {
    // constructor(position_, velocity_) {
    //     this.position = position_;
    //     this.velocity = velocity_;
    //     this.acceleration = 0;
    //     this.topSpeed = 10;
    // }
    constructor() {
        this.position = new Vector(random(width), random(height));
        this.velocity = new Vector(0, 0);
        this.topSpeed = 4;
    }
    update() {
        const mousePosition = new Vector(mouseX, mouseY);
        const dir = mousePosition.sub(this.position);
        dir.norm();
        dir.mult(0.5);
        this.acceleration = dir;
        this.velocity.add(this.acceleration);
        console.log("VEL : ", this.velocity);
        this.velocity.limit(this.topSpeed);
        console.log(
            "NEW VEL : ",
            this.velocity == this.velocity.limit(this.topSpeed)
        );
        this.position.add(this.velocity);
    }
    display() {
        stroke(0);
        fill(100);
        ellipse(this.position.x, this.position.y, 16, 16);
    }
    checkEdges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
}

let position;
let velocity;

function setup() {
    createCanvas(400, 400);
    frameRate(60);
    noLoop();
}

function draw() {
    console.log("DRAWING ...");
    background(204);
    const en = new Entity();
    en.update();
    en.checkEdges();
    en.display();
}