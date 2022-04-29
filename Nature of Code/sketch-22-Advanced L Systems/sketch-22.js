const PARAMS = {
    dec_fact: 0.6,
    angle: 25,
    generation: 0,
    rules: 0,
    color: {
        r: 26,
        g: 255,
        b: 0,
        a: 0.5,
    },
    line_wt: 0.5,
    pause: false,
};

var rule_blades = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Initialize",
    });
    const folder2 = folder1.addFolder({
        title: "Rules",
    });
    const folder3 = pane.addFolder({
        title: "General",
    });

    folder2
        .addButton({
            title: "Add",
            label: "new rule",
        })
        .on("click", () => {
            PARAMS.rules += 1;
            let r = folder2
                .addBlade({
                    view: "text",
                    label: `rule-${PARAMS.rules}`,
                    parse: (v) => String(v),
                    value: "",
                })
                .on("change", (ev) => {
                    console.log("NEW RULE : ", ev.value.replace(/\s/g, "").split("->"));
                    let val = ev.value.replace(/\s/g, "").split("->");
                    let lhs = val[0],
                        rhs = val[1];
                    let rule = {
                        lhs,
                        rhs,
                    };
                    // FF+[+F-F-F]-[-F+F+F]
                    rules[PARAMS.rules - 1] = rule;
                });
            rule_blades.push(r);
        });
    folder2
        .addButton({
            title: "Delete",
            label: "last rule",
        })
        .on("click", () => {
            PARAMS.rules -= 1;
            let a = rule_blades.pop();
            let ele = a.controller_.view.element;
            ele.parentNode.removeChild(ele);
        });

    folder1
        .addButton({
            title: "next",
            label: "generation",
        })
        .on("click", () => {
            PARAMS.generation += 1;
            updateGeneration();
        });

    folder1.addMonitor(PARAMS, "generation", {
        label: "",
    });

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

    folder3.addInput(PARAMS, "pause");
};

var angle;
var axiom = "F";
var sentence = axiom;
var len = 100;

var rules = [];

function updateGeneration() {
    len *= PARAMS.dec_fact;
    var nextSentence = "";
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++) {
            if (current == rules[j].lhs) {
                found = true;
                nextSentence += rules[j].rhs;
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