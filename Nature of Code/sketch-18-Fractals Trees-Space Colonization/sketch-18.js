const PARAMS = {
    min_dist: 2,
    max_dist: 100,
    strength: 4,
    color: "#822500",
    line_wt: 2,

    optimize: false,
    clear_rate: 20,

    frameRate: 0,
    branches: 1,
    pause: false,
};

var tree;

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const tab = pane.addTab({
        pages: [{ title: "Branch" }, { title: "Optim." }],
    });

    const folder1 = tab.pages[0].addFolder({
        title: "Parameters",
    });
    const folder2 = tab.pages[1].addFolder({
        title: "Optimization",
    });
    const folder3 = tab.pages[0].addFolder({
        title: "General",
    });
    folder1.addInput(PARAMS, "min_dist", {
        min: 1,
        max: 200,
        step: 1,
    });
    folder1.addInput(PARAMS, "max_dist", {
        min: 1,
        max: 300,
        step: 1,
    });
    folder1.addInput(PARAMS, "strength", {
        min: 1,
        max: 50,
        step: 0.1,
    });

    folder1.addInput(PARAMS, "color");
    folder1.addInput(PARAMS, "line_wt", {
        min: 1,
        max: 10,
        step: 0.1,
    });

    folder2.addInput(PARAMS, "optimize").on("change", (ev) => {
        if (ev.value) {
            clear_rate.disabled = false;
            branches_graph.disabled = false;
            no_of_branches_100.disabled = false;
        } else {
            clear_rate.disabled = true;
            branches_graph.disabled = true;
            no_of_branches_100.disabled = true;
        }
    });
    const clear_rate = folder2.addInput(PARAMS, "clear_rate", {
        disabled: true,
        min: 100,
        max: 5000,
        step: 1,
    });

    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        label: "",
    });
    const branches_graph = folder2.addMonitor(PARAMS, "branches", {
        disabled: true,
        view: "graph",
        min: 10,
        max: 1000,
    });
    const no_of_branches_100 = folder2.addMonitor(PARAMS, "branches", {
        disabled: true,
        label: "x100",
    });
    folder3.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    if (PARAMS.min_dist < PARAMS.max_dist) {
        tree = new Tree(PARAMS.min_dist, PARAMS.max_dist);
    } else {
        tree = new Tree(10, 100);
    }
}

function draw() {
    if (PARAMS.pause) {
        return;
    }
    background(0);
    if (PARAMS.optimize) {
        tree.optimize(PARAMS.clear_rate);
    }

    if (tree.leaves.length > 0) {
        tree.show(PARAMS.color, PARAMS.line_wt);
        if (PARAMS.min_dist < PARAMS.max_dist) {
            tree.grow(PARAMS.strength, PARAMS.min_dist, PARAMS.max_dist);
        } else {
            tree.grow(10, 100);
        }
        PARAMS.frameRate = floor(frameRate());
        PARAMS.branches = floor(tree.branches.length / 100);
    }
}