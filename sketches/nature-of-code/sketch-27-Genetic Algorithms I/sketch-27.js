window.addEventListener("load", (e) => {
    document.getElementById("defaultCanvas0").parentNode.removeChild(document.getElementById("defaultCanvas0"))
})

const PARAMS = {
    ref_rate: 3,
    max_pop: 200,
    mut_rate: 0.01,
    limit: 20,
    frameRate: 0,
    pause: false,
};


var target;
var popmax;
var mutationRate;
var population;

let bestPhrase;
let allPhrasesTitle;
let allPhrases;
let stats;

let bestPhraseCont;
let statsCont;



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

    folder1.addInput(PARAMS, "ref_rate", {
        min: 1,
        max: 100,
        step: 1
    })
    folder1.addBlade({
        view: 'text',
        label: 'name',
        parse: (v) => String(v),
        value: 'To be or not to be',
    }).on("change", (ev) => {
        clear();

        target = str(ev.value)
        intialize()
    })
    folder1.addInput(PARAMS, "max_pop", {
        min: 20,
        max: 1000,
        step: 1
    }).on("change", (ev) => {
        popmax = ev.value
        intialize()
    })
    folder1.addInput(PARAMS, "mut_rate", {
        min: 0.001,
        max: 1,
        step: 0.001
    }).on("change", (ev) => {
        mutationRate = ev.value
        intialize()
    })
    folder1.addInput(PARAMS, "limit", {
        min: 2,
        max: 100,
        step: 1
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

const intialize = () => {
    population = new Population(target, mutationRate, popmax);
}

function setup() {
    createPane()

    allPhrasesTitle = createP("All phrases");
    allPhrasesTitle.class("allPhrasesTitle");

    allPhrases = createP()
    allPhrases.class("allPhrases");


    target = "To be or not to be";
    popmax = 200;
    mutationRate = 0.01;

    intialize()
}


function displayInfo(limit) {
    // Display current status of population
    let answer = population.getBest();


    let statstext = "Total Generations : " + population.getGenerations() + "<br>";
    statstext += "Average Fitness : " + nf(round(population.getAverageFitness(), 4)) + "<br>";
    statstext += "Total Population : " + popmax + "<br>";
    statstext += "Mutation Rate : " + floor(mutationRate * 100) + "%" + "<br>";
    statstext += "Time Elapsed : " + round(millis() / 1000, 0) + " seconds "

    allPhrasesTitle.html("All phrases:<br>");
    allPhrases.html(population.allPhrases(limit));

    let bp = "Best phrase:<br>" + answer
    bestPhraseCont = createElement('div', bp);
    bestPhraseCont.class('bestPhraseCont');

    statsCont = createElement('div', statstext);
    statsCont.class('statsCont');

}

function draw() {
    if (PARAMS.pause) {
        return
    }
    background(44)
    if (frameCount % PARAMS.ref_rate == 0) {
        if (bestPhraseCont) {
            bestPhraseCont.remove()
        }
        if (statsCont) {
            statsCont.remove()
        }
        // 1. Generate mating pool
        population.naturalSelection();

        // 2. Create next generation
        population.generate();
        // 3. Calculate fitness
        population.calcFitness();

        population.evaluate();

        // If we found the target phrase, stop
        if (population.isFinished()) {
            //println(millis()/1000.0);
            noLoop();
        }
        displayInfo(limit = PARAMS.limit);

    }
    PARAMS.frameRate = floor(frameRate())
}