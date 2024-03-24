const PARAMS = {
    width: 200,
    height: 200,
    n: 8,
    init_p: 4,

    show_p: true,
    p_size: 8,
    p_color: "#ffffff",

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

    const folder1 = pane.addFolder({
        title: "Parameters",
    })
    const folder2 = pane.addFolder({
        title: "General",
    })


    folder1.addInput(PARAMS, "width", {
        min: 100,
        max: 800,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0);
        initalize(ev.value, PARAMS.height);
    })
    folder1.addInput(PARAMS, "height", {
        min: 100,
        max: 1200,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0);
        initalize(PARAMS.width, ev.value);
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
    folder1.addInput(PARAMS, "show_p").on("change", (ev) => {
        if (ev.value) {
            p_s.disabled = false
            p_c.disabled = false
        } else {
            p_s.disabled = true
            p_c.disabled = true
        }
    })

    const p_s = folder1.addInput(PARAMS, "p_size", {
        disabled: true,
        min: 0.1,
        max: 20,
        step: 0.1
    }).on("change", (ev) => {
        clear();
        background(0);
        initalize()
    })
    const p_c = folder1.addInput(PARAMS, "p_color", {
        disabled: true
    })

    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addInput(PARAMS, "pause");

}


var points = []

function initalize(width = 200, height = 200) {
    createCanvas(width, height);
    points = []
    for (let i = 0; i < PARAMS.init_p; i++) {
        points[i] = createVector(random(width), random(height), random(width));
    }
}


function setup() {
    createPane();
    w = windowWidth - 400;
    h = windowHeight - 50;
    pixelDensity(1);
    initalize()
    createCanvas(w, h)
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
    if (PARAMS.show_p) {
        for (let p of points) {
            stroke(PARAMS.p_color);
            strokeWeight(PARAMS.p_size);
            point(p.x, p.y)
        }

    }
    PARAMS.frameRate = floor(frameRate())
}