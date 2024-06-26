const s = ( p ) => {

    const PARAMS = {
        angle1: 10,
        angle2: 100,
        angleV1: 0.01,
        angleV2: 0.1,
        ampx: 200,
        ampy: 100,
        radius: 1,
        line_wt: 0.1,
        color: "rgb(0,255,255)",
        oTrail: -100,
        pause: false,
    };
    
    const width = p.windowWidth - 400;
    const height = p.windowHeight - 50;
  
    p.setup = () => {
        const controlContainer = document.getElementById("controls");
        p.createCanvas(width, height);
        
        const pane = new Tweakpane.Pane({
            container: controlContainer,
        });
        const folder1 = pane.addFolder({
            title: "Wave Properties",
        });
        const folder2 = pane.addFolder({
            title: "General",
        });
        folder1.addInput(PARAMS, "radius", { min: 2, max: 32, step: 1 });
        folder1.addInput(PARAMS, "line_wt", { min: 0.1, max: 4, step: 0.01 });
        folder1.addInput(PARAMS, "angle1", { min: 0, max: 1, step: 0.01 });
        folder1.addInput(PARAMS, "angle2", { min: 0, max: 1, step: 0.01 });
        folder1.addInput(PARAMS, "angleV1", { min: 0, max: 1, step: 0.01 });
        folder1.addInput(PARAMS, "angleV2", { min: 0, max: 1, step: 0.01 });
        folder1.addInput(PARAMS, "ampx", { min: 0, max: width / 2, step: 1 });
        folder1.addInput(PARAMS, "ampy", { min: 0, max: height / 2, step: 1 });
        folder2.addInput(PARAMS, "color");
        folder2.addInput(PARAMS, "oTrail", { min: -100, max: 200, step: 1 });
        folder2.addInput(PARAMS, "pause");

        p.background(0);
    };
  
    p.draw = () => {
        if (PARAMS.pause) {
            return;
        }
        p.background(0, PARAMS.oTrail);
        p.translate(width / 2, height / 2);
        p.fill(PARAMS.color);
        p.stroke(PARAMS.color);
        let x = p.map(p.sin(PARAMS.angle1), -1, 1, -PARAMS.ampx, PARAMS.ampx);
        let y = p.map(p.sin(PARAMS.angle2), -1, 1, -PARAMS.ampy, PARAMS.ampy);
        p.strokeWeight(PARAMS.line_wt);
        p.line(0, 0, x, y);
        p.circle(x, y, PARAMS.radius);
        PARAMS.angle1 += PARAMS.angleV1;
        PARAMS.angle2 += PARAMS.angleV2;
    };
};
  
let sketch = new p5(s);