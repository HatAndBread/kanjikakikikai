const domEls = {
  mondaiButt: document.getElementById('mondai'),
  brushSizeRange: document.getElementById('brush-size'),
  canvas: document.getElementById('canvas'),
  keshi: document.getElementById('keshi')
};

const canvasSettings = {
  width: domEls.canvas.clientWidth,
  height: domEls.canvas.clientHeight
};

const userSettings = {
  brushSize: 5
};

const getMondai = () => {
  domEls.mondaiButt.innerHTML = 'チェック';
};

const checkAnswer = () => {
  domEls.mondaiButt.innerHTML = 'もんだい';
};

domEls.mondaiButt.addEventListener('click', (e) => {
  let text = e.target.innerHTML;
  text === 'もんだい' ? getMondai() : checkAnswer();
  console.log(e.target.innerHTML);
});

domEls.brushSizeRange.addEventListener('change', (e) => {
  userSettings.brushSize = e.target.value;
});

let clearCanvas = false;
keshi.addEventListener('click', () => {
  clearCanvas = true;
});

window.addEventListener('resize', (e) => {
  canvasSettings.width = domEls.canvas.clientWidth;
  canvasSettings.height = domEls.canvas.clientHeight;
  console.log(canvasSettings);
});

const lastPoints = {
  x: null,
  y: null
};

let sketch = function (p) {
  let pg;
  let cnv;
  let myFont;
  p.preload = function () {
    myFont = p.loadFont('./assets/Dosis-VariableFont_wght.ttf');
  };
  p.setup = function () {
    cnv = p.createCanvas(canvasSettings.width, canvasSettings.height);
    p.textFont(myFont);
    p.textSize(28);
    p.textStyle('NORMAL');
  };
  p.draw = function () {
    if (clearCanvas) {
      p.clear();
      clearCanvas = false;
    }
    p.stroke(10, 11, 12);
    p.strokeWeight(userSettings.brushSize);
    if (p.mouseIsPressed) {
      if (lastPoints.x && lastPoints) {
        p.line(lastPoints.x, lastPoints.y, p.mouseX, p.mouseY);
      } else {
        p.line(p.mouseX, p.mouseY, p.mouseX, p.mouseY);
      }
      lastPoints.x = p.mouseX;
      lastPoints.y = p.mouseY;
    }
    p.strokeWeight(1);
    p.fill(`rgba(131,132,249,0.3)`);
    p.stroke(`rgba(160,200,249,0.3)`);
    p.text(`Stats: 100% correct`, p.width - 200, 100);
  };
  p.mouseReleased = function () {
    lastPoints.x = null;
    lastPoints.y = null;
  };
  p.windowResized = function () {
    pg = p.createGraphics(p.width, p.height);
    pg.image(cnv, 0, 0, canvasSettings.width, canvasSettings.height);
    pg.loadPixels();
    p.resizeCanvas(canvasSettings.width, canvasSettings.height);
    p.image(pg, 0, 0);
  };
};
new p5(sketch, window.document.getElementById('canvas'));
