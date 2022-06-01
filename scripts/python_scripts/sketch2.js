let vehicle;
let target;

function setup() {
    createCanvas(400, 400);
    vehicle = new Vehicle(100, 100);
}

function draw() {
    background(0);
    console.log("object");
    fill(255, 0, 0);
    noStroke();
    target = createVector(mouseX, mouseY);
    circle(target.x, target.y, 32);

    let steering = vehicle.flee(target);
    vehicle.applyForce(steering);

    vehicle.edges(); // not in video added after the fact
    vehicle.update();
    vehicle.show();
}