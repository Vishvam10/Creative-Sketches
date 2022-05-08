window.addEventListener("load", (e) => {
    document.getElementById("defaultCanvas0").parentNode.removeChild(document.getElementById("defaultCanvas0"))
})

const PARAMS = {
    ref_rate: 2,
    frameRate: 0,
    pause: true,
};


let target;
let popmax;
let mutationRate;
let population;

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



function setup() {
    createPane()

    allPhrasesTitle = createP("All phrases");
    allPhrasesTitle.class("allPhrasesTitle");

    allPhrases = createP()
    allPhrases.class("allPhrases");


    target = "To be or not to be.";
    popmax = 200;
    mutationRate = 0.01;

    population = new Population(target, mutationRate, popmax);
}

function displayInfo() {
    // Display current status of population
    let answer = population.getBest();


    let statstext = "total generations : " + population.getGenerations() + "<br>";
    statstext += "average fitness : " + nf(population.getAverageFitness()) + "<br>";
    statstext += "total population : " + popmax + "<br>";
    statstext += "mutation rate : " + floor(mutationRate * 100) + "%";

    allPhrasesTitle.html("All phrases:<br>");
    allPhrases.html(population.allPhrases());

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
        displayInfo();

    }
    PARAMS.frameRate = floor(frameRate())
}