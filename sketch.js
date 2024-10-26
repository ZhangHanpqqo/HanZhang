let font, fontCN;
let particles = [];
let fontSize = 65;
let fontSizeCN = 40;
let textString = "";
let points = [];
let mouseRadius = 100;
let baseHue = 255;
let colorCandidates = [baseHue , 100, 251];
let colorRand;

let highlightWords = [
  { line: 0, start: 75370, length: 20700 }, // Example: Highlight "text" on first line
  { line: 4, start: 56890, length: 52350 }, 
  { line: 5, start: 60000, length: 79840 },
  { line: 6, start: 90820, length: 32800 },
];

function preload() {
  font = loadFont("https://github.com/ZhangHanpqqo/HanZhang/blob/main/assets/rm_typerighter_old.ttf");
  fontCN = loadFont("https://github.com/ZhangHanpqqo/HanZhang/blob/main/assets/songti_CN.otf");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textSize(fontSize);
  fill(255);

  loadStrings('/assets/intro.txt', doText);
  
  // // Get the coordinates of the text points
  // points = font.textToPoints(textString, 50, height / 2, fontSize, {
  //   sampleFactor: 0.5
  // });

  // // Create particles from points
  // for (let i = 0; i < points.length; i++) {
  //   particles.push(new Particle(points[i].x, points[i].y));
  // }
}

function doText(lines){
  if (lines) {
    textLines = lines; // Store loaded lines
    
    // Offset settings for printing lines with breaks
    let yOffset = height / 5; // Begin a bit down from the top
    let lineSpacing = fontSize; // Adjust line spacing if necessary

    // Add a dark grey background shadow for the text
    // for (let i = 0; i < textLines.length; i++) {
    //   fill('yellow');
    //   noStroke();
    //   text(textLines[i], 50, yOffset + i * lineSpacing);
    // }

    colorRand = random(0, 98) / 33;

    // Create particle points for each line
    for (let i = 0; i < textLines.length; i++) {
      let linePoints;
      if(i == 7){
        // textFont(fontCN);
        linePoints = fontCN.textToPoints(textLines[i], 50, yOffset + i * lineSpacing, fontSizeCN, {sampleFactor: 0.5});
      }
      else{
        linePoints = font.textToPoints(textLines[i], 50, yOffset + i * lineSpacing, fontSize, {sampleFactor: 0.5});
      }

      
      
      // Add particles for each point in this line
      for (let j = 0; j < linePoints.length; j++) {
          let wordColor = color(255, 255, 255, 200); // Default to white
          // let baseHue = frameCount % 360;
          
          // Highlight specific words
          for (let hw of highlightWords) {
            if (i == hw.line) {
              let charIndex = j / (textLines[i].length / linePoints.length);
              let hueOffset = 80 * sin(0.3 * j + i);
              let sparkle = 20 * noise(j * 0.1 + i);

              if (charIndex >= hw.start && charIndex < hw.start + hw.length) {
                colorRand = floor(colorRand);
                wordColor = color((colorCandidates[colorRand % 3]+ hueOffset + sparkle) % 255, colorCandidates[(colorRand+1) % 3], colorCandidates[(colorRand+2) % 3]); // Red for highlighted words
              }
            }
          }

        particles.push(new Particle(linePoints[j].x, linePoints[j].y, wordColor));
      }
    }
  } else {
    console.error("Failed to load text file.");
  }
}

function draw() {
  background(0);

  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // If the particle is close to the mouse, it floats around, otherwise it sits at its original position
    let d = dist(mouseX, mouseY, p.homeX, p.homeY);
    if (d < mouseRadius) {
      p.flee(mouseX, mouseY);
    } else {
      p.returnHome();
    }
    p.update();
    p.show();
  }
}

function keyPressed() {
  switch (keyCode) {
    case 48: //key 0
      window.location.href = "/pages/contact.html"; // Replace with desired URL
      break;
    case 49: //key 1
      window.location.href = "/pages/art.html"; // Replace with desired URL
      break;
    case 50: //key 2
      window.location.href = "/pages/tech.html"; // Replace with desired URL
      break;
    case 51: //key 3
      window.location.href = "/pages/life.html"; // Replace with desired URL
      break;
    case 52: //key 4
      window.location.href = "/pages/CN.html"; // Replace with desired URL
      break;
    case 57: //key 9
      window.open("/assets/CV_art_Han_2410.pdf", '_blank'); // Replace with desired URL
      break;
  }
}

class Particle {
  constructor(x, y, lineColor) {
    this.x = x;
    this.y = y;
    this.homeX = x;
    this.homeY = y;
    this.lineColor = lineColor;
    this.speed = createVector(random(-2, 2), random(-2, 2));
  }
  
  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.speed.mult(0.95);
  }

  flee(mx, my) {
    let force = createVector(this.x - mx, this.y - my);
    force.setMag(0.1);
    this.speed.add(force);
  }

  returnHome() {
    let homeDirection = createVector(this.homeX - this.x, this.homeY - this.y);
    homeDirection.setMag(0.02);
    this.speed.add(homeDirection);
  }

  show() {
    stroke(this.lineColor);
    strokeWeight(1);
    point(this.x, this.y);
  }
}
