var song;
var fft;
var sliderRate;
var sliderPan;
var sliderVolume;
var w;
var agent;

var delta = 0.01;

function loaded() {
  song.play();
}

function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
    console.log("paused");
  } else {
    song.loop();
    console.log("playing");
  }
}

function setup() {
  const width = windowWidth - 400;
  const height = windowHeight - 50;
  let canvas = createCanvas(width, height);
  background(0);
  song = loadSound("unravel.mp3", loaded);
  sliderRate = createSlider(0, 1.5, 1, 0.01);
  sliderPan = createSlider(-1, 1, 0, 0.01);
  sliderVolume = createSlider(0, 1, 0.5, 0.01);
  btn = createButton("Pause / Play");
  btn.mousePressed(togglePlay);
  fft = new p5.FFT(0, 128);
  w = width / 64;
  agent = new Entity(width/2, height/2);
}

function draw() {
  song.pan(sliderPan.value());
  song.rate(sliderRate.value());
  song.setVolume(sliderVolume.value());

  let spectrum = fft.analyze();
  // background(220);

  // noStroke();
  let force = createVector(0, 0);
  // let avg = 0;
  for (let i = 0; i< spectrum.length; i++){
    
    let amp = spectrum[i];
    let y = map(amp, 0, 256, height, 0);

    let L = spectrum.slice(0, 3).reduce((a, b) => a + b, 0) / 4;
    let R = spectrum.slice(4, 8).reduce((a, b) => a + b, 0) / 4;
    let U = spectrum.slice(9, 12).reduce((a, b) => a + b, 0) / 4;
    let D = spectrum.slice(13, 16).reduce((a, b) => a + b, 0) / 4;
`x`
    // console.log(max(L, R, U, D));

    // if(i <= 4) {
    //   fill("#ff0000");
    // } else if(i > 4 && i <= 8) {
    //   fill("#ff8800");
    // } else if(i > 8 && i <= 12) {
    //   fill("#eaff00");
    // } else if(i > 12 && i <= 16){
    //   fill("#73ff00");
    // }  
    // rect(i*w, y, w - 2, height - y);
  }
  // console.log("FRAME : ", frameCount, " VELOCITY : ", vel);
  
  agent.applyForce(force);
  agent.wrap();
  agent.update();
  agent.show();
  // text(spectrum.length, width/2, height/2)

  // let waveform = fft.waveform();
  // noFill();
  // beginShape();
  // stroke(20);
  // for (let i = 0; i < waveform.length; i++){
  //   let x = map(i, 0, waveform.length, 0, width);
  //   let y = map( waveform[i], -1, 1, 0, height);
  //   vertex(x,y);
  // }
  // endShape();


}