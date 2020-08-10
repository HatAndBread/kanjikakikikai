/*====================
GLOBALS***************
====================*/

let takingPhoto = false;
let clearCanvas = false;
let clearCanvasTwo = false;
let clearMirror = false;
let preventDrawing = true;
let practicing = false;

const domEls = {
  mondaiButt: document.getElementById('mondai-button'),
  canvas: document.getElementById('canvas'),
  keshi: document.getElementById('keshi'),
  bigMag: document.getElementById('big-mac'),
  toolsCloser: document.getElementById('tools-closer'),
  tools: document.getElementById('tools'),
  studySetSelector: document.getElementById('study-set-selector'),
  setSelectorButt: document.getElementById('select-study-set-butt'),
  setCloserButt: document.getElementById('set-selector-closer'),
  selectorButts: document.getElementsByClassName('set-selector'),
  mondaiText: document.getElementById('mondai'),
  kanjiAnswer: document.getElementById('kanji_answer'),
  checkAnswerBox: document.getElementById('check-answer'),
  maru: document.getElementById('maru'),
  batsu: document.getElementById('batsu'),
  yourDrawing: document.getElementById('your-drawing'),
  statsDisplay: document.getElementById('stats'),
  rightOrWrongDiv: document.getElementById('right-or-wrong'),
  startButton: document.getElementById('start-button'),
  hints: document.getElementById('hints'),
  gameFinished: document.getElementById('game-finished'),
  finalScore: document.getElementById('final-score'),
  compliment: document.getElementById('compliment'),
  bottom: document.getElementById('bottom'),
  greeting: document.getElementById('greeting'),
  practiceBox: document.getElementById('practice'),
  practiceKanjiExample: document.getElementById('kanji-example'),
  practiceUserCanvas: document.getElementById('user-canvas'),
  practiceCloser: document.getElementById('practice-closer'),
  loader: document.getElementById('loader'),
  toolsOut: false
};

const getGreeting = (userName) => {
  let date = new Date();
  let time = date.getHours();
  console.log(time);
  if (time >= 4 && time < 7) {
    return `朝早いですね、${userName}さん!☀️`;
  } else if (time >= 7 && time <= 10) {
    return `おはようございます、${userName}さん!☀️`;
  } else if (time > 10 && time <= 17) {
    return `こんにちは、${userName}さん!💪`;
  } else if (time > 17) {
    return `こんばんは、${userName}さん!🌙✨`;
  } else {
    return `もう寝なさい、${userName}さん!🌙✨💤`;
  }
};

const setup = () => {
  let userInfo = document.getElementById('user-info');
  if (userInfo) {
    let data = JSON.parse(userInfo.innerText);
    let settings = data.userSettings;
    console.log(settings);
    console.log(data);
    let greeting = getGreeting(data.username);
    domEls.greeting.innerText = greeting;
    return settings;
  } else {
    return {
      brushSize: 30,
      inkColor: { r: 230, g: 57, b: 70 },
      questionsPerRound: 10,
      practiceAfterFailure: true
    };
  }
};

const userSettings = setup();
console.log(userSettings);
let currentSet;
let currentMondai = {
  kanji: null,
  yomikata: null,
  definition: null
};

// Will give you the actual viewheight of mobile browsers with navigation bars
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
//******************** */

const userStats = {
  studySetUsingNow: 'random kanji',
  percentCorrect: 100,
  numberCorrect: 0,
  questionOutOf: {
    currentQuestion: 1,
    totalQuestions: userSettings.questionsPerRound
  },
  updateStats: function (correct) {
    if (correct) {
      this.numberCorrect += 1;
    }
    this.percentCorrect = Math.round((this.numberCorrect / this.questionOutOf.currentQuestion) * 100);
    this.questionOutOf.currentQuestion += 1;
  }
};

const complimentFactory = {
  goodCompliments: ['すばらしい！！🎉', '上手！🥳', '天才！🎊', 'すごいね！❣️'],
  mediumCompliments: ['悪くないね！', 'その調子！', 'さすが！', 'いいぞ！'],
  badCompliments: ['ヤバっ！😵', 'なんとも言えません😖', 'もっと勉強しないと😭'],
  getCompliments: function () {
    if (userStats.percentCorrect >= 80) {
      return this.goodCompliments[Math.floor(Math.random() * this.goodCompliments.length)];
    } else if (userStats.percentCorrect < 80 && userStats.percentCorrect > 60) {
      return this.mediumCompliments[Math.floor(Math.random() * this.mediumCompliments.length)];
    } else {
      return this.badCompliments[Math.floor(Math.random() * this.badCompliments.length)];
    }
  }
};

const finishGame = () => {
  domEls.gameFinished.style.display = 'flex';
  domEls.mondaiButt.style.display = 'none';
  domEls.mondaiText.style.display = 'none';
  domEls.finalScore.innerText = `Your final score: ${userStats.percentCorrect}%`;
  domEls.compliment.innerText = complimentFactory.getCompliments();
};

const resetUserStats = (studySet) => {
  userStats.studySetUsingNow = studySet;
  userStats.percentCorrect = 100;
  userStats.numberCorrect = 0;
  userStats.questionOutOf.currentQuestion = 1;
  userStats.questionOutOf.totalQuestions = userSettings.questionsPerRound;
};

function createStatsTable() {
  for (let i = 0; i < domEls.statsDisplay.childNodes.length; i++) {
    domEls.statsDisplay.removeChild(domEls.statsDisplay.childNodes[i]);
  }
  const statsTable = document.createElement('table');
  const studySetRow = document.createElement('tr');
  const questionOutOfRow = document.createElement('tr');
  const percentCorrectRow = document.createElement('tr');
  const studySetText = document.createTextNode(`Study set:  ${userStats.studySetUsingNow}`);
  const questionsOutOfText = document.createTextNode(
    `Question ${userStats.questionOutOf.currentQuestion}/${userStats.questionOutOf.totalQuestions}`
  );
  const percentCorrectText = document.createTextNode(`${userStats.percentCorrect}% correct`);
  studySetRow.appendChild(studySetText);
  questionOutOfRow.appendChild(questionsOutOfText);
  percentCorrectRow.appendChild(percentCorrectText);
  statsTable.appendChild(studySetRow);
  statsTable.appendChild(questionOutOfRow);
  statsTable.appendChild(percentCorrectRow);
  domEls.statsDisplay.appendChild(statsTable);
}
createStatsTable();

const canvasSettings = {
  width: domEls.canvas.clientWidth,
  height: domEls.canvas.clientHeight
};

const smallCanvasSettings = {
  width: domEls.yourDrawing.clientWidth,
  height: domEls.yourDrawing.clientHeight
};

const resetGame = () => {
  domEls.startButton.style.display = 'block';
  domEls.statsDisplay.style.display = 'none';
  domEls.mondaiText.innerText = '';
};

const getWordSet = async (title) => {
  let butt;
  console.log(title);
  for (let i = 0; i < domEls.selectorButts.length; i++) {
    console.log(domEls.selectorButts[i].innerHTML);
    domEls.selectorButts[i].style.fontWeight = 'unset';
    domEls.selectorButts[i].style.boxShadow = 'unset';
    console.log(domEls.selectorButts[i].innerText);
    if (domEls.selectorButts[i].innerText.trim() == title) {
      // Todo find out where whitespace is coming from.
      butt = domEls.selectorButts[i];
    }
  }
  butt.style.fontWeight = '900';
  butt.style.boxShadow = '10px 5px 5px #e63946';
  loader.hidden = false;
  const res = await fetch(`/get-words/${title}`);
  const data = await res.json();
  loader.hidden = true;
  currentSet = data.set;
  console.log(currentSet);
  resetUserStats(currentSet.title);
  clearCanvas = true;
  createStatsTable();
  resetGame();
};

const getPreDefinedWordSet = async (src, title) => {
  let butt;
  for (let i = 0; i < domEls.selectorButts.length; i++) {
    console.log(domEls.selectorButts[i].innerText);
    domEls.selectorButts[i].style.fontWeight = 'unset';
    domEls.selectorButts[i].style.boxShadow = 'unset';
    if (domEls.selectorButts[i].innerText === title) {
      butt = domEls.selectorButts[i];
    }
  }
  butt.style.fontWeight = '900';
  butt.style.boxShadow = '10px 5px 5px #e63946';
  const res = await fetch(`./word-sets/${src}`);
  const words = await res.json();
  currentSet = {};
  currentSet.title = title;
  currentSet.words = words;
  console.log(currentSet);
  resetUserStats(currentSet.title);
  clearCanvas = true;
  createStatsTable();
  resetGame();
};

getPreDefinedWordSet('jlpt-five.jscsrc', 'Random Kanji'); // set up initially

for (let i = 0; i < domEls.selectorButts.length; i++) {
  domEls.selectorButts[i].addEventListener('click', (e) => {
    domEls.studySetSelector.style.display = 'none';
    preventDrawing = false;
    if (
      e.target.value === 'jlpt2' ||
      e.target.value === 'jlpt3' ||
      e.target.value === 'jlpt4' ||
      e.target.value === 'jlpt5' ||
      e.target.value === 'random-kanji'
    ) {
      let fileName;
      let title;
      switch (e.target.value) {
        case 'jlpt2':
          fileName = 'jlpt-two.jscsrc';
          title = 'JLPT2';
          break;
        case 'jlpt3':
          fileName = 'jlpt-three.jscsrc';
          title = 'JLPT3';
          break;
        case 'jlpt4':
          fileName = 'jlpt-four.jscsrc';
          title = 'JLPT4';
          break;
        case 'jlpt5':
          fileName = 'jlpt-five.jscsrc';
          title = 'JLPT5';
          break;
        default:
          fileName = 'jlpt-two.jscsrc';
          title = 'Random Kanji';
          break;
      }
      getPreDefinedWordSet(fileName, title);
    } else {
      getWordSet(e.target.value);
    }
  });
}

const getMondai = () => {
  let ranNum = Math.floor(Math.random() * currentSet.words.length);
  currentMondai.yomikata = currentSet.words[ranNum].yomikata;
  currentMondai.kanji = currentSet.words[ranNum].kanji;
  currentMondai.definition = currentSet.words[ranNum].definition;
  if (currentMondai.definition) {
    domEls.mondaiText.innerText = `${currentMondai.yomikata} (${currentMondai.definition})`;
  } else {
    domEls.mondaiText.innerText = `${currentMondai.yomikata}`;
  }
  console.log(currentMondai);
  clearMirror = true;
};

const checkAnswer = () => {
  takingPhoto = true;
  domEls.statsDisplay.style.display = 'none';
  domEls.kanjiAnswer.innerText = currentMondai.kanji;
  domEls.checkAnswerBox.style.display = 'block';
  smallCanvasSettings.width = domEls.yourDrawing.clientWidth;
  smallCanvasSettings.height = domEls.yourDrawing.clientHeight;
  domEls.kanjiAnswer.style.fontSize = '58px';
  if (currentMondai.kanji.length === 3) {
    domEls.kanjiAnswer.style.fontSize = '42px';
  }
  if (currentMondai.kanji.length === 4) {
    domEls.kanjiAnswer.style.fontSize = '32px';
  }
  if (currentMondai.kanji.length === 5) {
    domEls.kanjiAnswer.style.fontSize = '26px';
  }
  if (currentMondai.kanji.length > 5) {
    domEls.kanjiAnswer.style.fontSize = '14px';
  }
  domEls.mondaiButt.disabled = true;
  domEls.mondaiButt.style.display = 'none';
  preventDrawing = true;
};

domEls.maru.addEventListener('click', (e) => {
  e.preventDefault();
  domEls.checkAnswerBox.style.display = 'none';
  preventDrawing = false;
  domEls.mondaiButt.disabled = false;
  domEls.mondaiButt.style.display = 'block';
  if (userStats.questionOutOf.currentQuestion < userSettings.questionsPerRound) {
    getMondai();
    userStats.updateStats(true);
    domEls.statsDisplay.style.display = 'block';
  } else {
    userStats.updateStats(true);
    finishGame();
  }

  createStatsTable();
});

domEls.practiceCloser.addEventListener('click', (e) => {
  domEls.practiceBox.hidden = true;
  practicing = false;
  preventDrawing = false;
  console.log(userStats);
  if (userStats.questionOutOf.currentQuestion <= userSettings.questionsPerRound) {
    domEls.statsDisplay.style.display = 'block';
  }
});

domEls.batsu.addEventListener('click', (e) => {
  e.preventDefault();

  if (userSettings.practiceAfterFailure) {
    preventDrawing = true;
    practicing = true;
    domEls.statsDisplay.style.display = 'none';
    domEls.practiceBox.hidden = false;
    domEls.practiceKanjiExample.innerText = currentMondai.kanji;
  } else {
    preventDrawing = false;
    domEls.statsDisplay.style.display = 'block';
  }
  domEls.checkAnswerBox.style.display = 'none';
  domEls.mondaiButt.disabled = false;
  domEls.mondaiButt.style.display = 'block';
  if (userStats.questionOutOf.currentQuestion < userSettings.questionsPerRound) {
    getMondai();
    userStats.updateStats(false);
  } else {
    userStats.updateStats(false);
    domEls.statsDisplay.style.display = 'none';
    finishGame();
  }

  createStatsTable();
});

domEls.setSelectorButt.addEventListener('click', () => {
  domEls.studySetSelector.style.display = 'block';
  domEls.gameFinished.style.display = 'none';
  preventDrawing = true;
});

domEls.setCloserButt.addEventListener('click', () => {
  domEls.studySetSelector.style.display = 'none';
  preventDrawing = false;
});

domEls.mondaiButt.addEventListener('click', (e) => {
  checkAnswer();
});

domEls.startButton.addEventListener('click', (e) => {
  e.preventDefault();
  domEls.startButton.style.display = 'none';
  preventDrawing = false;
  domEls.mondaiButt.style.display = 'block';
  domEls.statsDisplay.style.display = 'block';
  domEls.gameFinished.style.display = 'none';
  domEls.mondaiText.style.display = 'block';
  getMondai();
  domEls.hints.style.animationName = 'grow';
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

keshi.addEventListener('click', () => {
  clearCanvas = true;
  clearCanvasTwo = true;
});

window.addEventListener('resize', (e) => {
  canvasSettings.width = domEls.canvas.clientWidth;
  canvasSettings.height = domEls.canvas.clientHeight;
  smallCanvasSettings.width = domEls.yourDrawing.clientWidth;
  smallCanvasSettings.height = domEls.yourDrawing.clientHeight;
  console.log(smallCanvasSettings.width);
  console.log(smallCanvasSettings.height);
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  //Stop stupid mobile browsers from moving bottom div around
  //domEls.bottom.style.top = 'calc(var(--vh, 1vh) * 100)';
  //domEls.bottom.style.marginTop = '-50px';
});

let mirror;

let quickTouch = false;

const touchCors = {
  x: null,
  y: null,
  lastX: null,
  lastY: null,
  force: null,
  distanceSinceLast: null
};

const mouseData = {
  timeSinceMouseDown: 0,
  lastX: null,
  lastY: null,
  x: null,
  y: null
};

const getTouches = (e) => {
  if (!practicing) {
    let x = Math.floor(e.touches[0].clientX - domEls.canvas.getBoundingClientRect().x);
    let y = Math.floor(e.touches[0].clientY - domEls.canvas.getBoundingClientRect().y);
    touchCors.x = x;
    touchCors.y = y;
    touchCors.force = e.touches[0].force;
  } else {
    let x = Math.floor(e.touches[0].clientX - domEls.practiceUserCanvas.getBoundingClientRect().x);
    let y = Math.floor(e.touches[0].clientY - domEls.practiceUserCanvas.getBoundingClientRect().y);
    touchCors.x = x;
    touchCors.y = y;
    touchCors.force = e.touches[0].force;
  }
};

//prevent zooming on mobile//////////////////////////////
domEls.canvas.addEventListener('click', (e) => {
  e.preventDefault();
});
document.addEventListener(
  'touchmove',
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  false
);

let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  function (event) {
    mouseData.timeSinceMouseDown = 0;

    let now = new Date().getTime();
    if (now - lastTouchEnd <= 100) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);
document.addEventListener('mouseup', () => {
  mouseData.timeSinceMouseDown = 0;
  mouseData.lastX = null;
  mouseData.lastY = null;
});

const allowTouching = (element) => {
  element.addEventListener('click', (e) => {
    e.preventDefault();
  });
  element.addEventListener('touchstart', (e) => {
    e.preventDefault();
    getTouches(e);
  });
  element.addEventListener('touchmove', (e) => {
    e.preventDefault();
    getTouches(e);
  });
  element.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchCors.x = null;
    touchCors.y = null;
    touchCors.lastX = null;
    touchCors.lastY = null;
    touchCors.force = null;
    mouseData.timeSinceMouseDown = 0;
    mouseData.lastX = null;
    mouseData.lastY = null;
  });
};

allowTouching(domEls.statsDisplay);
allowTouching(domEls.hints);
allowTouching(domEls.canvas);
if (domEls.greeting) {
  allowTouching(domEls.greeting);
}
allowTouching(domEls.practiceUserCanvas);

domEls.statsDisplay.addEventListener('click', (e) => {
  e.preventDefault();
});
domEls.hints.addEventListener('click', (e) => {
  e.preventDefault();
});

////////////////////////////////////////////////////////

let sketch = function (p) {
  let pg;
  let cnv;
  let getMouseChange;

  p.setup = function () {
    cnv = p.createCanvas(canvasSettings.width, canvasSettings.height);
    getMouseChange = () => {
      let xChange = p.pmouseX - p.mouseX;
      let yChange = p.pmouseY - p.mouseY;
      if (xChange < 0) {
        xChange = xChange * -1;
      }
      if (yChange < 0) {
        yChange = yChange * -1;
      }
      if (xChange > yChange) {
        return xChange;
      } else {
        return yChange;
      }
    };
  };
  p.draw = function () {
    if (clearCanvas) {
      p.clear();
      clearCanvas = false;
    }
    if (!preventDrawing) {
      p.stroke(userSettings.inkColor.r, userSettings.inkColor.g, userSettings.inkColor.b);
      p.strokeWeight(3);

      if (touchCors.x && touchCors.force) {
        if (!touchCors.lastX) {
          let ran = p.random(-1, 1);
          let ranTwo = p.random(-1, 1);
          p.line(touchCors.x + p.random(-3, 3), touchCors.y + p.random(-3, 3), touchCors.x + ran, touchCors.y + ranTwo);
          p.line(touchCors.x, touchCors.y, touchCors.x, touchCors.y);
          if (touchCors.force) {
            p.strokeWeight(touchCors.force * userSettings.brushSize + p.random(-2, 2));
            p.line(touchCors.x, touchCors.y, touchCors.x, touchCors.y);

            p.strokeWeight(3);
          }
          touchCors.lastX = touchCors.x + ran;
          touchCors.lastY = touchCors.y + ranTwo;
        } else {
          let ran = p.random(-1, 1);
          let ranTwo = p.random(-1, 1);
          p.line(touchCors.lastX, touchCors.lastY, touchCors.x + ran, touchCors.y);
          if (touchCors.force) {
            p.strokeWeight(touchCors.force * userSettings.brushSize + p.random(-2, 2));
            p.line(touchCors.lastX, touchCors.lastY, touchCors.x, touchCors.y);

            p.strokeWeight(3);
          }
          touchCors.lastX = touchCors.x + ran;
          touchCors.lastY = touchCors.y + ranTwo;
        }
      }

      if (p.mouseIsPressed && !touchCors.force) {
        let change = getMouseChange();
        if (change > 7 && change < 20) {
          mouseData.timeSinceMouseDown -= 2;
        }
        if (change >= 20 && change < 30) {
          mouseData.timeSinceMouseDown -= 3;
        }
        if (change >= 30) {
          mouseData.timeSinceMouseDown -= 4;
        }
        if (mouseData.timeSinceMouseDown < 0) {
          mouseData.timeSinceMouseDown = mouseData.timeSinceMouseDown * -1;
        }
        if (mouseData.timeSinceMouseDown < 50) {
          mouseData.timeSinceMouseDown += 1;
        }
        console.log(mouseData);
        let theNumber = mouseData.timeSinceMouseDown - mouseData.timeSinceMouseDown * 0.3 + p.random(-1, 1);
        console.log(theNumber);
        let ran = p.random(-1, 1);
        let ran2 = p.random(-1, 1);
        mouseData.x = p.mouseX + ran;
        mouseData.y = p.mouseY + ran2;
        p.strokeWeight(userSettings.brushSize * 0.08 + theNumber);
        if (mouseData.lastX) {
          p.line(mouseData.lastX, mouseData.lastY, mouseData.x, mouseData.y);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        } else {
          p.line(p.mouseX + p.random(-3, 3), p.mouseY + p.random(-3, 3), mouseData.x, mouseData.y);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
        mouseData.lastX = mouseData.x;
        mouseData.lastY = mouseData.y;
      }
    }
    if (takingPhoto) {
      mirror = p.createGraphics(p.width, p.height);

      mirror.image(cnv, 0, 0, smallCanvasSettings.width, smallCanvasSettings.height);

      mirror.loadPixels();
    }
  };

  p.windowResized = function () {
    //stretches image to fit when user resizes
    pg = p.createGraphics(p.width, p.height);
    pg.image(cnv, 0, 0, canvasSettings.width, canvasSettings.height);
    pg.loadPixels();
    p.resizeCanvas(canvasSettings.width, canvasSettings.height);
    p.image(pg, 0, 0);
  };
};

function yourDrawing(p) {
  let cnv;
  p.setup = function () {
    cnv = p.createCanvas(smallCanvasSettings.width, smallCanvasSettings.height);
  };
  p.draw = function () {
    if (clearMirror) {
      p.clear();
      clearMirror = false;
    }
    if (takingPhoto) {
      p.resizeCanvas(smallCanvasSettings.width, smallCanvasSettings.height);
      p.image(mirror, 0, 0);
      takingPhoto = false;
      clearCanvas = true;
    }
  };
  p.windowResized = function () {};
}

function practiceDrawing(p) {
  let cnv;
  let initialWidth;
  let initialHeight;
  p.setup = function () {
    console.log(domEls.practiceUserCanvas.clientWidth);
    initialWidth = domEls.practiceUserCanvas.clientWidth;
    initialHeight = domEls.practiceUserCanvas.clientHeight;
    cnv = p.createCanvas(initialWidth, initialHeight);
  };
  p.draw = function () {
    if (domEls.practiceUserCanvas.clientWidth !== initialWidth) {
      p.resizeCanvas(domEls.practiceUserCanvas.clientWidth, domEls.practiceUserCanvas.clientHeight);
      initialWidth = domEls.practiceUserCanvas.clientWidth;
    }

    if (clearCanvasTwo) {
      p.clear();
      clearCanvasTwo = false;
    }
    p.stroke(userSettings.inkColor.r, userSettings.inkColor.g, userSettings.inkColor.b);
    p.strokeWeight(2);
    if (touchCors.x) {
      if (!touchCors.lastX) {
        p.line(touchCors.x, touchCors.y, touchCors.x, touchCors.y);
        if (touchCors.force) {
          p.strokeWeight(touchCors.force * 15 + p.random(-2, 2));
          p.line(touchCors.x, touchCors.y, touchCors.x, touchCors.y);
          p.strokeWeight(2);
        }
        touchCors.lastX = touchCors.x;
        touchCors.lastY = touchCors.y;
      } else {
        p.line(touchCors.lastX, touchCors.lastY, touchCors.x, touchCors.y);
        if (touchCors.force) {
          p.strokeWeight(touchCors.force * 15 + p.random(-2, 2));
          p.line(touchCors.lastX, touchCors.lastY, touchCors.x, touchCors.y);
          p.strokeWeight(2);
        }
        touchCors.lastX = touchCors.x;
        touchCors.lastY = touchCors.y;
      }
    }

    if (p.mouseIsPressed && !touchCors.lastX) {
      p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      p.line(p.pmouseX, p.pmouseY, p.mouseX + p.random(-1, 1), p.mouseY + p.random(-1, 1));
    }
  };
  p.windowResized = function () {
    p.resizeCanvas(domEls.practiceUserCanvas.clientWidth, domEls.practiceUserCanvas.clientHeight);
  };
}

new p5(sketch, domEls.canvas);
new p5(yourDrawing, domEls.yourDrawing);
new p5(practiceDrawing, domEls.practiceUserCanvas);

/*
//text file parser

const parseText = async (path) => {
  const data = await fetch(`/${path}.txt`);
  const text = await data.text();
  const textToArr = text.split('\n');

  for (let i = 0; i < textToArr.length; i++) {
    const newArr = textToArr[i].split('');
    textToArr[i] = newArr;
  }
  console.log(textToArr);

  for (let i = 0; i < textToArr.length; i++) {
    for (let j = 0; j < textToArr[i].length; j++) {
      if (textToArr[i][j] === ' ' || textToArr[i][j] === '	') {
        textToArr[i][j] = '*';
      }
    }
  }

  for (let i = 0; i < textToArr.length; i++) {
    const newString = textToArr[i].join('');
    textToArr[i] = newString.split('*');

    if (textToArr[i].length > 3) {
      let def = [];
      for (let j = 2; j < textToArr[i].length; j++) {
        def.push(textToArr[i][j]);
      }
      let string = def.join(' ');
      textToArr[i][2] = string;
    }
  }

  const words = [];
  for (let i = 0; i < textToArr.length; i++) {
    words.push({ kanji: textToArr[i][0], yomikata: textToArr[i][1], definition: textToArr[i][2] });
  }
  const jason = JSON.stringify(words);
  async function sendJason() {
    const hello = await fetch('/send-jason', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: jason
    });
  }
  console.log(words);
  sendJason();
};

parseText('jlpt3');


*/

/*

const parseText = async (path) => {
  const data = await fetch(`/${path}.txt`);
  const text = await data.text();
  const textToArr = text.split('\n');

  for (let i = 0; i < textToArr.length; i++) {
    const newArr = textToArr[i].split('');
    textToArr[i] = newArr;
  }
  for (let i = 0; i < textToArr.length; i++) {
    for (let j = 0; j < textToArr[i].length; j++) {
      if (textToArr[i][j] === ' ' || textToArr[i][j] === '	') {
        textToArr[i][j] = '*';
      }
    }
  }
  for (let i = 0; i < textToArr.length; i++) {
    const newString = textToArr[i].join('');
    textToArr[i] = newString;
  }
  for (let i = 0; i < textToArr.length; i++) {
    const newArr = textToArr[i].split('*');
    textToArr[i] = newArr;
    textToArr[i].shift();
  }
  for (let i = textToArr.length - 1; i >= 0; i--) {
    textToArr[i].splice(2, 1); //erase part of speech
    if (textToArr[i][1] === '') {
      textToArr.splice(i, 1);
    }
    if (textToArr[i].length > 3) {
      let word = [];
      for (let j = 2; j < textToArr[i].length; j++) {
        word.push(textToArr[i][j]);
      }
      let string = word.join(' ');
      textToArr[i].splice(2, textToArr[i].length);
      textToArr[i].push(string);
    }
  }
  
  const words = [];
  for (let i = 0; i < textToArr.length; i++) {
    words.push({ kanji: textToArr[i][1], yomikata: textToArr[i][0], definition: textToArr[i][2] });
  }
  const jason = JSON.stringify(words);
  async function sendJason() {
    const hello = await fetch('/send-jason', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: jason
    });
  }
  console.log(words);
  sendJason();
  
};
*/
