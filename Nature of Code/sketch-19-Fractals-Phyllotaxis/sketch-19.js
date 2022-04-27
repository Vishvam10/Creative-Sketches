const PARAMS = {
    radius: 1,
    angle: 137.5,
    scale: 3,
    dots: 0,
    frameRate: 0,
    adv_col: false,
    one_col: true,
    color: { r: 0, g: 228, b: 255 },
    trail: -100,
    pause: false,
    red: false,
    rv: "x",
    r_range: {
        min: 0,
        max: 255,
    },
    r_map_to: {
        min: 0,
        max: 100,
    },
    r_scale: 20,
    r_mod: 255,

    green: false,
    gv: "y",
    g_range: {
        min: 0,
        max: 100,
    },
    g_map_to: {
        min: 0,
        max: 100,
    },
    g_scale: 20,
    g_mod: 255,

    blue: false,
    bv: "x",
    b_range: {
        min: 0,
        max: 100,
    },
    b_map_to: {
        min: 0,
        max: 100,
    },
    b_scale: 20,
    b_mod: 255,
};

let segments = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });
    pane.registerPlugin(TweakpaneEssentialsPlugin);
    const tab = pane.addTab({
        pages: [{ title: "Parameters" }, { title: "Appearance" }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Parameters",
    });
    const folder2 = tab.pages[0].addFolder({
        title: "General",
    });

    const folder3 = tab.pages[1].addFolder({
        title: "Red",
    });
    const folder4 = tab.pages[1].addFolder({
        title: "Green",
    });
    const folder5 = tab.pages[1].addFolder({
        title: "Blue",
    });

    folder1.addInput(PARAMS, "radius", {
        min: 1,
        max: 40,
        step: 0.1,
    });
    folder1.addInput(PARAMS, "angle", {
        min: -180,
        max: 180,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "scale", {
        min: 1,
        max: 10,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "adv_col");
    folder1.addInput(PARAMS, "one_col");
    folder1.addInput(PARAMS, "color");
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addInput(PARAMS, "trail", {
        min: -200,
        max: 100,
    });
    folder2.addInput(PARAMS, "pause");

    let red_params = [],
        green_params = [],
        blue_params = [];

    folder3.addInput(PARAMS, "red").on("change", (ev) => {
        if (ev.value) {
            for (r of red_params) {
                r.disabled = false;
            }
        } else {
            for (r of red_params) {
                r.disabled = true;
            }
        }
    });

    let rv = folder3.addBlade({
        disabled: true,
        view: "list",
        label: "var",
        options: [
            { text: "x", value: "x" },
            { text: "y", value: "y" },
            { text: "x+y", value: "x+y" },
            { text: "x-y", value: "x-y" },
        ],
        value: "x",
    });

    red_params.push(rv);
    red_params.push(
        folder3.addInput(PARAMS, "r_range", {
            disabled: true,
            min: 0,
            max: 255,
        })
    );

    let rm = folder3.addInput(PARAMS, "r_map_to", {
        disabled: true,
        min: 0,
        max: 255,
    });
    let rs = folder3.addInput(PARAMS, "r_scale", {
        disabled: true,
        min: 0,
        max: 100,
    });

    red_params.push(rm);
    red_params.push(rs);

    red_params.push(
        folder3.addInput(PARAMS, "r_mod", {
            disabled: true,
            min: 1,
            max: 1000,
        })
    );

    folder4.addInput(PARAMS, "green").on("change", (ev) => {
        if (ev.value) {
            for (g of green_params) {
                g.disabled = false;
            }
        } else {
            for (g of green_params) {
                g.disabled = true;
            }
        }
    });
    green_params.push(
        folder4.addBlade({
            disabled: true,
            view: "list",
            label: "var",
            options: [
                { text: "x", value: "x" },
                { text: "y", value: "y" },
                { text: "x+y", value: "x+y" },
                { text: "x-y", value: "x-y" },
            ],
            value: "x",
        })
    );

    let gr = folder4.addInput(PARAMS, "g_range", {
        disabled: true,
        min: 0,
        max: 255,
    });

    let gm = folder4.addInput(PARAMS, "g_map_to", {
        disabled: true,
        min: 0,
        max: 255,
    });

    green_params.push(gr);
    green_params.push(gm);

    green_params.push(
        folder4.addInput(PARAMS, "g_scale", {
            disabled: true,
            min: 0,
            max: 100,
        })
    );
    green_params.push(
        folder4.addInput(PARAMS, "g_mod", {
            disabled: true,
            min: 1,
            max: 1000,
        })
    );

    folder5.addInput(PARAMS, "blue").on("change", (ev) => {
        if (ev.value) {
            for (b of blue_params) {
                b.disabled = false;
            }
        } else {
            for (b of blue_params) {
                b.disabled = true;
            }
        }
    });
    blue_params.push(
        folder5.addBlade({
            disabled: true,
            view: "list",
            label: "var",
            options: [
                { text: "x", value: "x" },
                { text: "y", value: "y" },
                { text: "x+y", value: "x+y" },
                { text: "x-y", value: "x-y" },
            ],
            value: "x",
        })
    );

    let br = folder5.addInput(PARAMS, "b_range", {
        disabled: true,
        min: 0,
        max: 255,
    });

    let bm = folder5.addInput(PARAMS, "b_map_to", {
        disabled: true,
        min: 0,
        max: 255,
    });

    blue_params.push(br);
    blue_params.push(bm);

    blue_params.push(
        folder5.addInput(PARAMS, "b_scale", {
            disabled: true,
            min: 0,
            max: 100,
        })
    );
    blue_params.push(
        folder5.addInput(PARAMS, "b_mod", {
            disabled: true,
            min: 1,
            max: 1000,
        })
    );
};

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    angleMode(DEGREES);
    createCanvas(width, height);
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return;
    }

    background(0, PARAMS.trail);

    translate(width / 2, height / 2);
    let theta = PARAMS.dots * PARAMS.angle;
    let radius = PARAMS.scale * sqrt(PARAMS.dots);

    let x = radius * cos(theta);
    let y = radius * sin(theta);
    let r = 255,
        rv = x,
        g = 10,
        gv = y,
        b = 255,
        bv = x;
    noStroke();
    if (PARAMS.adv_col) {
        if (PARAMS.red) {
            console.log("IN RED");
            if (PARAMS.rv == "x") {
                rv = x;
            } else if (PARAMS.rv == "y") {
                rv = y;
            } else if (PARAMS.rv == "x+y") {
                rv = x + y;
            } else if (PARAMS.rv == "x-y") {
                rv = x - y;
            }
            r =
                (abs(
                        map(
                            rv,
                            parseInt(PARAMS.r_range.min),
                            parseInt(PARAMS.r_range.max),
                            parseInt(PARAMS.r_map_to.min),
                            parseInt(PARAMS.r_map_to.min)
                        )
                    ) *
                    PARAMS.r_scale) %
                PARAMS.r_mod;
        }
        if (PARAMS.green) {
            if (PARAMS.gv == "x") {
                gv = x;
            } else if (PARAMS.gv == "y") {
                gv = y;
            } else if (PARAMS.gv == "x+y") {
                gv = x + y;
            } else if (PARAMS.gv == "x-y") {
                gv = x - y;
            }
            g =
                (abs(
                        map(
                            gv,
                            parseInt(PARAMS.g_range.min),
                            parseInt(PARAMS.g_range.max),
                            parseInt(PARAMS.g_map_to.min),
                            parseInt(PARAMS.g_map_to.min)
                        )
                    ) *
                    PARAMS.g_scale) %
                PARAMS.g_mod;
        }
        if (PARAMS.blue) {
            if (PARAMS.bv == "x") {
                bv = x;
            } else if (PARAMS.bv == "y") {
                bv = y;
            } else if (PARAMS.bv == "x+y") {
                bv = x + y;
            } else if (PARAMS.bv == "x-y") {
                bv = x - y;
            }
            b =
                (abs(
                        map(
                            bv,
                            parseInt(PARAMS.b_range.min),
                            parseInt(PARAMS.b_range.max),
                            parseInt(PARAMS.b_map_to.min),
                            parseInt(PARAMS.b_map_to.min)
                        )
                    ) *
                    PARAMS.b_scale) %
                PARAMS.b_mod;
        }
        fill(r, g, b);
    }
    if (PARAMS.one_col) {
        fill(PARAMS.color.r, PARAMS.color.g, PARAMS.color.b);
    }
    circle(x, y, 2 * PARAMS.radius);

    PARAMS.frameRate = floor(frameRate());
    PARAMS.dots++;
}