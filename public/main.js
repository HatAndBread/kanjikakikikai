const domEls = {
  mondaiButt: document.getElementById('mondai-button'),
  brushSizeRange: document.getElementById('brush-size'),
  canvas: document.getElementById('canvas'),
  keshi: document.getElementById('keshi'),
  bigMag: document.getElementById('big-mac'),
  toolsCloser: document.getElementById('tools-closer'),
  tools: document.getElementById('tools'),
  toolsOut: false
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

domEls.bigMag.addEventListener('click', () => {
  if (!domEls.toolsOut) {
    domEls.tools.style.right = '0px';
    domEls.toolsOut = true;
  } else {
    domEls.tools.style.right = '-100%';
    domEls.toolsOut = false;
  }
});

domEls.toolsCloser.addEventListener('click', () => {
  domEls.tools.style.right = '-100%';
  domEls.toolsOut = false;
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
    p.stroke(255, 110, 109);
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
