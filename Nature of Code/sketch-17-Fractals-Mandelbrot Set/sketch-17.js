/* 

The Mandelbrot set is the set of complex numbers c 
for which the function fc( z) = z^2 + c does not diverge to infinity when iterated from z = 0 i.e., for which the sequence fc(0), fc(fc(0)), fc(fc(fc(0))), etc., remains bounded in absolute value. 

Ref : https://en.wikipedia.org/wiki/Mandelbrot_set

*/

const PARAMS = {
    minVal: -2.5,
    maxVal: 2.5,
    frameRate: 0,
    pause: false,
    generation: 0,
};

let segments = [];

const createPane = () => {
    const controlContainer = document.getElementById("controls");
    const pane = new Tweakpane.Pane({
        container: controlContainer,
    });

    const folder1 = pane.addFolder({
        title: "Parameters",
    });
    const folder2 = pane.addFolder({
        title: "General",
    });
    folder1.addInput(PARAMS, "minVal", {
        min: -10,
        max: 10,
        step: 0.01,
    });
    folder1.addInput(PARAMS, "maxVal", {
        min: -10,
        max: 10,
        step: 0.01,
    });
    folder2.addMonitor(PARAMS, "frameRate", {
        view: "graph",
        min: 1,
        max: 90,
    });
    folder2.addInput(PARAMS, "pause");
};

function setup() {
    createPane();
    width = windowWidth - 400;
    height = windowHeight - 50;
    createCanvas(width, height);
    pixelDensity(1);
}

function draw() {
    var maxiterations = 100;

    loadPixels();
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var a = map(x, 0, width, PARAMS.minVal, PARAMS.maxVal);
            var b = map(y, 0, height, PARAMS.minVal, PARAMS.maxVal);

            // This is the new Z. New Z = Old Z ^ 2 + c and c = a + bi.  ( Since we are not using complex numbers as such to represent the numbers ). c is the original value. So, a = aa + ca and b = bb + cb
            var ca = a;
            var cb = b;

            var n = 0;

            while (n < maxiterations) {
                var aa = a * a - b * b;
                var bb = 2 * a * b;
                a = aa + ca;
                b = bb + cb;
                if (a * a + b * b > 16) {
                    break;
                }
                n++;
            }

            var bright = map(n, 0, maxiterations, 0, 1);
            bright = map(sqrt(bright), 0, 1, 0, 255);

            if (n == maxiterations) {
                bright = 0;
            }

            var pix = (x + y * width) * 4;
            pixels[pix + 0] = bright;
            pixels[pix + 1] = bright;
            pixels[pix + 2] = bright;
            pixels[pix + 3] = 255;
        }
    }
    updatePixels();

    PARAMS.frameRate = floor(frameRate());
}

/*

- pixels[] is the array of pixels ( which is built into p5 )

In an HTML canvas, the pixels are arranged in 1D. And each pixel's RGBA values are flattened out as well. For example, the pixel in position (0,0) would be :

pixels = [255,255,255,50,_,_,_,_, .....]

the first 4 elements in the pixel array. The pixel in position (0,1) would be :

pixels[5 to 8], and so on.

- So, the general formula to get a pixel in HTML canvas is :

_ (x + (y * width)) * 4 


*/