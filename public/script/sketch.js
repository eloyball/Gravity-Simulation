let colors;
let presets;
let previewPaths = new Array();
let previewColors = new Array();
let collidedBodies = new Array();

function setup() {
  createCanvas(windowWidth, windowHeight);
  colors = new Colors();
  presets = new Preset();
  initPreset();
  toggleControls();

// Two Bodies
  // celestialBodies.push(new CelestialBody('red', 1200, 20, createVector(windowWidth/2 + 100, windowHeight/2 + 45), createVector(0, 20.8)));
  // celestialBodies.push(new CelestialBody('blue', 1200, 20, createVector(windowWidth/2 - 100, windowHeight/2 + 45), createVector(0, -20.8)));
// Infinity
  // celestialBodies.push(new CelestialBody('orange', 400, 20, createVector(windowWidth/2, windowHeight/2), createVector(0.93240737 * 10, 0.86473146 * 10)));
  // celestialBodies.push(new CelestialBody('blue', 400, 20, createVector(windowWidth/2 + 0.97000436 * 400, windowHeight/2 - 0.24308753 * 400), createVector(-0.93240737 * 10 / 2, -0.86473146 * 10 / 2)));
  // celestialBodies.push(new CelestialBody('red', 400, 20, createVector(windowWidth/2 - 0.97000436 * 400, windowHeight/2 + 0.24308753 * 400), createVector(-0.93240737 * 10 / 2, -0.86473146 * 10 / 2)));
// Solar System
  // stars.push(new Star(createVector(windowWidth/2, windowHeight/2 + 45)));
  // celestialBodies.push(new CelestialBody('gray', 1, 8, createVector(windowWidth/2 + 100, windowHeight/2 + 45), createVector(0, 100)));
  // celestialBodies.push(new CelestialBody('orange', 1, 12, createVector(windowWidth/2 + 150, windowHeight/2 + 45), createVector(0, 81.650)));
  // celestialBodies.push(new CelestialBody('blue', 1, 12, createVector(windowWidth/2 + 200, windowHeight/2 + 45), createVector(0, 70.711)));
  // celestialBodies.push(new CelestialBody('red', 1, 10, createVector(windowWidth/2 + 250, windowHeight/2 + 45), createVector(0, 63.246)));
  // celestialBodies.push(new CelestialBody('purple', 1, 20, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)));
  // celestialBodies.push(new CelestialBody('yellow', 1, 15, createVector(windowWidth/2 + 350, windowHeight/2 + 45), createVector(0, 53.452)));
  // celestialBodies.push(new CelestialBody('green', 1, 18, createVector(windowWidth/2 + 400, windowHeight/2 + 45), createVector(0, 50)));
// Earth Moon
  // stars.push(new Star(createVector(windowWidth/2, windowHeight/2 + 45)));
  // celestialBodies.push(new CelestialBody('gray', 0.01, 9, createVector(windowWidth/2 + 290, windowHeight/2 + 45), createVector(0, -18.4)));
  // celestialBodies.push(new CelestialBody('blue', 3000, 16, createVector(windowWidth/2 + 350, windowHeight/2 + 45), createVector(0, 53.452)));
// Square
  // stars.push(new Star(createVector(windowWidth/2, windowHeight/2 + 45)));
  // celestialBodies.push(new CelestialBody('purple', 1000, 15, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)));
  // celestialBodies.push(new CelestialBody('yellow', 0.001, 10, createVector(windowWidth/2 + 233, windowHeight/2 + 45), createVector(0, 98.514)));
// Hexagon
  // stars.push(new Star(createVector(windowWidth/2, windowHeight/2 + 45)));
  // celestialBodies.push(new CelestialBody('blue', 1000, 15, createVector(windowWidth/2 + 300, windowHeight/2 + 45), createVector(0, 57.735)));
  // celestialBodies.push(new CelestialBody('gray', 0.001, 10, createVector(windowWidth/2 + 253.333, windowHeight/2 + 45), createVector(0, 104.703)));
}

function draw() {  
  background(5);

  drawStars();

  if(!isSimulating) {
    drawPreviewPath();
  }

  updateBodies();

  for(const body of collidedBodies) {
    body.render();
  }
}

function drawStars() {
  for(const star of stars) {
    star.render();
  }
}

function drawPreviewPath() {
  let i = 0;
  
  for(const path of previewPaths) {
    const pathColor = colors.baseColors.get(previewColors[i])
    
    push();
    beginShape();
    noFill();
    stroke(pathColor.x, pathColor.y, pathColor.z);
    strokeWeight(2);
    for(const v of path) {
      vertex(v.x, v.y);
    }
    endShape();
    pop();

    i++;
  }
}

function updatePathColor() {
  previewColors = [];
  
  for(const body of celestialBodies) {
      previewColors.push(body.color);
  }
}

function radialGradient(x1, y1, r1, x2, y2, r2, color1, stop1, color2, stop2) {
  let gradient = drawingContext.createRadialGradient(
    x1, y1, r1, x2, y2, r2
  );
  gradient.addColorStop(stop1, color1);
  gradient.addColorStop(stop2, color2);
  drawingContext.fillStyle = gradient;
}