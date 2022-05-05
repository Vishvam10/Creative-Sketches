const PARAMS = {
    n: 8,
    init_p: 4,
    p_color: "#ffffff",

    animate: true,

    frameRate: 0,
    o_trail: 100,
    pause: false,
};


var init_p = 3;
var n = 1;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const tab = pane.addTab({
        pages: [{ title: "Params" }, { title: "Animate" }],
    });


    const folder1 = tab.pages[0].addFolder({
        title: "Parameters",
    })
    const folder2 = tab.pages[0].addFolder({
        title: "General",
    })


    folder1.addInput(PARAMS, "init_p", {
        min: 0,
        max: 20,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0);
        initalize();
    })
    folder1.addInput(PARAMS, "n", {
        min: 0,
        max: 10,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0);
        initalize()
    })

    folder1.addInput(PARAMS, "p_color")
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addInput(PARAMS, "animate")
    folder2.addInput(PARAMS, "pause");

}


var points = []

function initalize(width, height) {
    createCanvas(200, 200);
    points = []
    for (let i = 0; i < PARAMS.init_p; i++) {
        points[i] = createVector(random(width), random(height), random(width));
    }
}


function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    pixelDensity(1);
    initalize()
}

function draw() {
    if (PARAMS.pause) {
        return
    }
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let distances = [];
            for (let i = 0; i < points.length; i++) {
                let v = points[i];
                let z = frameCount % width;
                let d = dist(x, y, z, v.x, v.y, v.z);
                distances[i] = d;
            }
            let sorted = sort(distances);
            let r = map(sorted[0], 0, 150, 0, 255);
            let g = map(sorted[1], 0, 50, 255, 0);
            let b = map(sorted[2], 0, 200, 255, 0);
            let index = (x + y * width) * 4;
            pixels[index + 0] = r;
            pixels[index + 1] = g;
            pixels[index + 2] = b;
            pixels[index + 3] = 255;
        }
    }
    updatePixels();
    for (let p of points) {
        stroke(PARAMS.p_color);
        strokeWeight(8);
        point(p.x, p.y)
    }
    PARAMS.frameRate = floor(frameRate())
}