const PARAMS = {
    dec_fact: 0.6,
    angle: 25,
    generation: 0,
    color: {
        r: 26,
        g: 255,
        b: 0,
        a: 0.5,
    },
    line_wt: 0.5,
    pause: false,
};

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Initialize",
    });
    const folder2 = pane.addFolder({
        title: "General",
    });

    folder1
        .addButton({
            title: "Next",
            label: "Generation",
        })
        .on("click", () => {
            PARAMS.generation += 1;
            updateGeneration();
        });
    folder1.addMonitor(PARAMS, "generation");

    folder1.addInput(PARAMS, "color");
    folder1.addInput(PARAMS, "angle", {
        min: -180,
        max: 180,
    });
    folder1.addInput(PARAMS, "dec_fact", {
        min: 0.01,
        max: 0.99,
        step: 0.001,
    });
    folder1.addInput(PARAMS, "line_wt", {
        min: 0.1,
        max: 8,
        step: 0.01,
    });

    folder2.addInput(PARAMS, "pause");
};

var angle;
var axiom = "F";
var sentence = axiom;
var len = 100;

var rules = [];
rules[0] = {
    a: "F",
    b: "FF+[+F-F-F]-[-F+F+F]",
};

function updateGeneration() {
    len *= PARAMS.dec_fact;
    var nextSentence = "";
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++) {
            if (current == rules[j].a) {
                found = true;
                nextSentence += rules[j].b;
                break;
            }
        }
        if (!found) {
            nextSentence += current;
        }
    }
    sentence = nextSentence;
    turtle();
}

function turtle() {
    resetMatrix();
    translate(width / 2, height);
    strokeWeight(PARAMS.line_wt);
    let c = `rgba(${parseInt(PARAMS.color.r)}, ${parseInt(
    PARAMS.color.g
  )}, ${parseInt(PARAMS.color.b)}, ${round(PARAMS.color.a, 2)})`;
    stroke(c);
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        if (current == "F") {
            line(0, 0, 0, -len);
            translate(0, -len);
        } else if (current == "+") {
            rotate(angle);
        } else if (current == "-") {
            rotate(-angle);
        } else if (current == "[") {
            push();
        } else if (current == "]") {
            pop();
        }
    }
}

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
}

function draw() {
    angle = radians(PARAMS.angle);
    background(0);
    turtle();
}