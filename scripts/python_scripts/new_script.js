var s = function(p) {
 let t = 0; // time variable

p.setup() = function() {
    p.createCanvas(600, 600);
    p.noStroke();
    p.fill(40, 200, 40);
}

p.preload() = function() {
    console.log("asdfasfd");
}

p.draw() = function() {
    p.background(10, 10); // translucent p.background (creates trails)

    // make a x and y grid of ellipses
    for (let x = 0; x <= p.width; x = x + 30) {
        for (let y = 0; y <= p.height; y = y + 30) {
            // starting p.point of each p.circle depends on mouse position
            const xAngle = p.map(p.mouseX, 0, p.width, -4 * PI, 4 * PI, true);
            const yAngle = p.map(p.mouseY, 0, p.height, -4 * PI, 4 * PI, true);
            // and also varies based on the particle's location
            const angle = xAngle * (x / p.width) + yAngle * (y / p.height);

            // each particle moves in a p.circle
            const myX = x + 20 * p.cos(2 * PI * t + angle);
            const myY = y + 20 * p.sin(2 * PI * t + angle);

            p.ellipse(myX, myY, 10); // draw particle
        }
    }

    t = t + 0.01; // update time
}}