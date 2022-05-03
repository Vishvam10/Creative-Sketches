const PARAMS = {
    dA: 0.98,
    dB: 2.05,
    dt: 1,
    feed: 0.055,
    k: 0.062,
    line_wt: 1,
    color: {
        r: 255,
        g: 124,
        b: 102
    },
    frameRate: 0,
    pause: true,
};

var n = Math.pow(2, PARAMS.order)
var total = n * n

var grid = []
var next = []

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    })


    folder1.addInput(PARAMS, "dA", {
        min: 0,
        max: 5,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "dB", {
        min: 0,
        max: 5,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "dt", {
        min: 0,
        max: 5,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "feed", {
        min: 0,
        max: 5,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "k", {
        min: 0,
        max: 5,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "color")
    folder1.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder1.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder1.addInput(PARAMS, "pause");
};

function initalize() {
    for (var x = 0; x < width; x++) {
        grid[x] = [];
        next[x] = [];
        for (var y = 0; y < height; y++) {
            grid[x][y] = {
                a: 1,
                b: 0
            };
            next[x][y] = {
                a: 1,
                b: 0
            };
        }
    }

    for (var i = 100; i < 110; i++) {
        for (var j = 100; j < 110; j++) {
            grid[i][j].b = 1;
        }
    }
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    pixelDensity(1);
    grid = [];
    next = [];
    for (var x = 0; x < width; x++) {
        grid[x] = [];
        next[x] = [];
        for (var y = 0; y < height; y++) {
            grid[x][y] = {
                a: 1,
                b: 0
            };
            next[x][y] = {
                a: 1,
                b: 0
            };
        }
    }

    for (var i = floor(width / 2); i < floor(width / 2) + 50; i++) {
        for (var j = floor(height / 2); j < floor(height / 2) + 50; j++) {
            grid[i][j].b = 1;
        }
    }
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return
    }

    for (var x = 1; x < width - 1; x++) {
        for (var y = 1; y < height - 1; y++) {
            var a = grid[x][y].a;
            var b = grid[x][y].b;
            next[x][y].a = a + PARAMS.dA * laplaceA(x, y) - a * b * b + (PARAMS.feed * (1 - a)) * PARAMS.dt;
            next[x][y].b = b + PARAMS.dB * laplaceB(x, y) + a * b * b - ((PARAMS.k + PARAMS.feed) * b) * PARAMS.dt;

            next[x][y].a = constrain(next[x][y].a, 0, 1);
            next[x][y].b = constrain(next[x][y].b, 0, 1);
        }
    }

    loadPixels();
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var pix = (x + y * width) * 4;
            var a = next[x][y].a;
            var b = next[x][y].b;
            c1 = map(a, 0, 1, 0, 255);
            c2 = map(b, 0, 1, 0, 255);
            pixels[pix + 0] = PARAMS.color.r;
            pixels[pix + 1] = PARAMS.color.g;
            pixels[pix + 2] = PARAMS.color.b;
            pixels[pix + 3] = c1;
        }
    }
    updatePixels();
    swap();
    PARAMS.frameRate = floor(frameRate())
}

function laplaceA(x, y) {
    var sumA = 0;
    sumA += grid[x][y].a * -1;
    sumA += grid[x - 1][y].a * 0.2;
    sumA += grid[x + 1][y].a * 0.2;
    sumA += grid[x][y + 1].a * 0.2;
    sumA += grid[x][y - 1].a * 0.2;
    sumA += grid[x - 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y + 1].a * 0.05;
    sumA += grid[x - 1][y + 1].a * 0.05;
    return sumA;
}

function laplaceB(x, y) {
    var sumB = 0;
    sumB += grid[x][y].b * -1;
    sumB += grid[x - 1][y].b * 0.2;
    sumB += grid[x + 1][y].b * 0.2;
    sumB += grid[x][y + 1].b * 0.2;
    sumB += grid[x][y - 1].b * 0.2;
    sumB += grid[x - 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y + 1].b * 0.05;
    sumB += grid[x - 1][y + 1].b * 0.05;
    return sumB;
}

function swap() {
    var temp = grid;
    grid = next;
    next = temp;
}