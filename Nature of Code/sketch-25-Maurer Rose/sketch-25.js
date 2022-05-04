const PARAMS = {
    n: 2,
    d: 29,
    m_line_wt: 0.02,
    s_line_wt: 0.2,
    scale: 100,
    m_color: "#ff7c66",
    s_color: "#ffffff",

    animate: false,
    anim_n: false,
    n_func: "noise",
    anim_d: false,
    d_func: "noise",
    anim_sc: false,
    sc_func: "noise",

    frameRate: 0,
    o_trail: 100,
    pause: false,
};


var angle = 0;

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


    folder1.addInput(PARAMS, "n", {
        min: 0,
        max: 20,
        step: 1
    }).on("change", (ev) => {
        clear();
        background(0)
    })
    folder1.addInput(PARAMS, "d", {
        min: -360,
        max: 360,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })
    folder1.addInput(PARAMS, "scale", {
        min: 1,
        max: 500,
        step: 1
    })

    folder1.addInput(PARAMS, "m_line_wt", {
        min: 0.01,
        max: 1,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })
    folder1.addInput(PARAMS, "s_line_wt", {
        min: 0.1,
        max: 8,
        step: 0.01
    }).on("change", (ev) => {
        clear();
        background(0)
    })

    folder1.addInput(PARAMS, "m_color")
    folder1.addInput(PARAMS, "s_color")
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    folder2.addInput(PARAMS, "o_trail", {
        min: -200,
        max: 400,
        step: 1
    })
    folder2.addInput(PARAMS, "pause");

    tab.pages[1].addInput(PARAMS, "animate").on("change", (ev) => {
        if (ev.value) {
            n_settings.disabled = false
            anim_n.disabled = false
            d_settings.disabled = false
            anim_d.disabled = false
            sc_settings.disabled = false
            anim_sc.disabled = false
        } else {
            n_settings.disabled = true
            anim_n.disabled = true
            d_settings.disabled = true
            anim_d.disabled = true
            sc_settings.disabled = true
            anim_sc.disabled = true
        }
    });
    const folder3 = tab.pages[1].addFolder({
        title: "Settings",
    })

    const n_settings = folder3.addInput(PARAMS, "anim_n").on("change", (ev) => {
        if (ev.value) {
            anim_n.disabled = false
        } else {
            anim_n.disabled = true
        }
    });
    const anim_n = folder3.addBlade({
        disabled: true,
        view: 'list',
        label: 'function',
        options: [
            { text: 'sin(x) [-360, 360]', value: 'sin' },
            { text: 'cos(x) [-360, 360]', value: 'cos' },
            { text: 'perlin noise', value: 'noise' },
        ],
        value: 'noise',
    }).on("change", (ev) => {
        PARAMS.n_func = ev.value
    })

    const d_settings = folder3.addInput(PARAMS, "anim_d").on("change", (ev) => {
        if (ev.value) {
            anim_d.disabled = false
        } else {
            anim_d.disabled = true
        }
    });
    const anim_d = folder3.addBlade({
        disabled: true,
        view: 'list',
        label: 'function',
        options: [
            { text: 'sin(x) [-360, 360]', value: 'sin' },
            { text: 'cos(x) [-360, 360]', value: 'cos' },
            { text: 'perlin noise', value: 'noise' },
        ],
        value: 'noise',
    }).on("change", (ev) => {
        PARAMS.d_func = ev.value
    })

    const sc_settings = folder3.addInput(PARAMS, "anim_sc").on("change", (ev) => {
        if (ev.value) {
            anim_sc.disabled = false
        } else {
            anim_sc.disabled = true
        }
    });
    const anim_sc = folder3.addBlade({
        disabled: true,
        view: 'list',
        label: 'function',
        options: [
            { text: 'sin(x) [-360, 360]', value: 'sin' },
            { text: 'cos(x) [-360, 360]', value: 'cos' },
            { text: 'perlin noise', value: 'noise' },
        ],
        value: 'noise',
    }).on("change", (ev) => {
        PARAMS.sc_func = ev.value
    })


};

function initalize() {}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    angleMode(DEGREES)
    background(0);
}

function draw() {
    if (PARAMS.pause) {
        return
    }
    background(0, PARAMS.o_trail)
    translate(width / 2, height / 2);
    strokeWeight(PARAMS.m_line_wt);
    stroke(PARAMS.m_color);
    noFill();
    beginShape();
    for (let i = 0; i < 361; i++) {
        let k = i * PARAMS.d;
        let r = PARAMS.scale * sin(PARAMS.n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);
    }
    endShape();
    strokeWeight(PARAMS.s_line_wt);
    stroke(PARAMS.s_color)
    noFill();
    beginShape();
    for (let i = 0; i < 361; i++) {
        let k = i;
        let r = PARAMS.scale * sin(PARAMS.n * k);
        let x = r * cos(k);
        let y = r * sin(k);
        vertex(x, y);
    }
    if (PARAMS.animate) {
        if (PARAMS.anim_n) {
            switch (PARAMS.n_func) {
                case "noise":
                    PARAMS.n += noise(0, 1);
                    break;
                case "sin":
                    PARAMS.n += sin(angle);
                    angle += 0.1
                case "sin":
                    PARAMS.n += cos(angle);
                    angle += 0.1
            }

        }
        if (PARAMS.anim_d) {
            console.log(PARAMS.d_func);
            switch (PARAMS.d_func) {
                case "noise":
                    PARAMS.d += noise(0, 1);
                    break;
                case "sin":
                    PARAMS.d += sin(angle);
                    angle += 0.1
                case "sin":
                    PARAMS.d += cos(angle);
                    angle += 0.1
            }

        }
        if (PARAMS.anim_sc) {
            switch (PARAMS.sc_func) {
                case "noise":
                    PARAMS.scale += noise(0, 1);
                    break;
                case "sin":
                    PARAMS.scale += sin(angle);
                    angle += 0.1
                case "sin":
                    PARAMS.scale += cos(angle);
                    angle += 0.1
            }

        }
    }
    endShape();
    PARAMS.frameRate = floor(frameRate())
}