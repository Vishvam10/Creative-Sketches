var song;
var fft;
var sliderRate;
var sliderPan;
var sliderVolume;
var w;
var agent;
var pause = false;
var prev = -1;

var delta = 0.01;

// [RIGHT, UP, DOWN, LEFT]
var angles = [0, Math.PI/2, Math.PI, 3*Math.PI/2]
var colors = ["#ff0000", "#ff8800", "#eaff00", "#73ff00"]

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

function PauseAnimation() {
  pause = true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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
  pauseBtn = createButton("Pause / Play Animation");
  pauseBtn.mousePressed(PauseAnimation);
  btn = createButton("Pause / Play Audio");
  btn.mousePressed(togglePlay);
  fft = new p5.FFT(0, 128);
  w = width / 64;
  agent = new Entity(width/2, height/2);
}

function draw() {
  if (pause) {
    return;
  }
  song.pan(sliderPan.value());
  song.rate(sliderRate.value());
  song.setVolume(sliderVolume.value());

  let spectrum = fft.analyze();
  let energy = fft.getEnergy("bass")
  console.log(energy);
  // console.log(spectrum);
  // background(0);

  // noStroke();
  // for (let i = 0; i< spectrum.length; i++){
    
  //   let dir = [];
  //   // [RIGHT, UP, DOWN, LEFT]

  //   dir[0] = (spectrum.slice(9, 12).reduce((a, b) => a + b, 0) / 4) / 256;
  //   dir[1] = (spectrum.slice(4, 8).reduce((a, b) => a + b, 0) / 4) / 512;
  //   dir[2] = (spectrum.slice(13, 16).reduce((a, b) => a + b, 0) / 4) / 256;
  //   dir[3] = (spectrum.slice(0, 3).reduce((a, b) => a + b, 0) / 4) / 256;
  //   v = -1;
  //   ang_ind = -1;
  //   for(let j=0; j<3; j++) {
  //     if(dir[j] > v) {
  //       v = dir[j];
  //       ang_ind = j;
  //     }
  //   }
  //   if(ang_ind != prev) {
  //     v = v * 5000;
  //   } else {
  //     v = v * 10;
  //   }
  //   prev = ang_ind;
  //   // console.log(max(L, R, U, D));
  // }
  // let vel = p5.Vector.fromAngle(angles[ang_ind], v)
  // console.log(ang_ind);
  // if(ang_ind == 0 || ang_ind == 2) {
  //   agent.applyVelocity(vel, 0);
  // } else {
  //   agent.applyVelocity(vel, 1);

  // }
  // agent.wrap();
  // agent.update();
  // agent.show(colors[ang_ind]);
  // text(spectrum.length, width/2, height/2)

  // let waveform = fft.waveform();
  // noFill();
  // beginShape();
  // stroke(255);
  // for (let i = 0; i < waveform.length; i++){
  //   let x = map(i, 0, waveform.length, 0, width);
  //   let y = map( waveform[i], -1, 1, 0, height);
  //   vertex(x,y);
  // }
  // endShape();


}