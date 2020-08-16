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
  nav: document.getElementById('nav-bar'),
  attention: document.getElementById('attention-getter'),
  exampleDisplay: document.getElementById('example-display'),
  video: document.getElementById('video'),
  playButton: document.getElementById('play-button'),
  videoCloser: document.getElementById('video-closer'),
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
  //get user settings. they are sent from server to ejs file and saved in a hidden div.
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
      brushSize: 70,
      inkColor: '#1d3557',
      questionsPerRound: 10,
      practiceAfterFailure: true,
      senseForce: false
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

const userStats = {
  studySetUsingNow: 'basic',
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
// defines size of canvas that is used to compare user's writing with the correct answer.
const smallCanvasSettings = {
  width: domEls.yourDrawing.clientWidth,
  height: domEls.yourDrawing.clientHeight
};

const resetGame = () => {
  domEls.startButton.style.display = 'block';
  domEls.statsDisplay.style.display = 'none';
  domEls.mondaiText.innerText = '';
  domEls.checkAnswerBox.style.display = 'none';
  domEls.practiceBox.hidden = true;
  preventDrawing = true;
  practicing = false;
  domEls.mondaiButt.disabled = false;
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
  domEls.loader.style.display = 'flex';

  const res = await fetch(`/get-words/${title}`);
  const data = await res.json();
  domEls.loader.style.display = 'none';
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
  domEls.loader.style.display = 'flex';

  const res = await fetch(`./word-sets/${src}`);
  const words = await res.json();
  domEls.loader.style.display = 'none';
  currentSet = {};
  currentSet.title = title;
  currentSet.words = words;
  console.log(currentSet);
  resetUserStats(currentSet.title);
  clearCanvas = true;
  createStatsTable();
  resetGame();
};

if (userSettings.loadOnStart) {
  switch (userSettings.loadOnStart) {
    case 'jlpt2':
      getPreDefinedWordSet('jlpt-two.jscsrc', 'JLPT2');
      break;
    case 'jlpt3':
      getPreDefinedWordSet('jlpt-three.jscsrc', 'JLPT3');
      break;
    case 'jlpt4':
      getPreDefinedWordSet('jlpt-four.jscsrc', 'JLPT4');
      break;
    case 'jlpt5':
      getPreDefinedWordSet('jlpt-five.jscsrc', 'JLPT5');
      break;
    case 'basic':
      getPreDefinedWordSet('basic.jscsrc', 'Basic');
      break;
    case 'places':
      getPreDefinedWordSet('places.jscsrc', 'Places');
      break;
    default:
      getWordSet(userSettings.loadOnStart);
      break;
  }
} else {
  getPreDefinedWordSet('basic.jscsrc', 'Basic'); // set up initially
}

for (let i = 0; i < domEls.selectorButts.length; i++) {
  domEls.selectorButts[i].addEventListener('click', (e) => {
    domEls.studySetSelector.style.display = 'none';
    preventDrawing = false;
    if (
      e.target.value === 'jlpt2' ||
      e.target.value === 'jlpt3' ||
      e.target.value === 'jlpt4' ||
      e.target.value === 'jlpt5' ||
      e.target.value === 'places' ||
      e.target.value === 'basic'
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
        case 'basic':
          fileName = 'basic.jscsrc';
          title = 'Basic';
          break;
        case 'places':
          fileName = 'places.jscsrc';
          title = 'Places';
          break;
        default:
          fileName = 'jlpt-five.jscsrc';
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

function isKanji(ch) {
  return (ch >= '\u4e00' && ch <= '\u9faf') || (ch >= '\u3400' && ch <= '\u4dbf');
}

const centerVideo = () => {
  domEls.exampleDisplay.style.top = `${window.innerHeight / 2 - videoSize.height / 2}px`;
  domEls.exampleDisplay.style.left = `${window.innerWidth / 2 - videoSize.width / 2}px`;
  console.log(videoSize.height);
  console.log(videoSize.width);

  domEls.videoCloser.style.left = `${videoSize.width - 20}px`;
  domEls.videoCloser.style.top = `5px`;
  domEls.playButton.style.top = `${videoSize.height / 2 - 64}px`;
  domEls.playButton.style.left = `${videoSize.width / 2 - 32}px`;
};

domEls.playButton.addEventListener('click', () => {
  domEls.playButton.style.display = 'none';
  domEls.video.play();
});
domEls.videoCloser.addEventListener('click', () => {
  closeVideo();
});

const closeVideo = () => {
  domEls.exampleDisplay.hidden = true;
  domEls.exampleDisplay.style.pointerEvents = 'none';
  domEls.video.src = '';
};

let videoSize = {
  width: 0,
  height: 0
};
const getAnimation = async (ch) => {
  domEls.loader.style.display = 'flex';
  const res = await fetch(`/get-strokes/${ch}`);
  const data = await res.json();
  if (data.link) {
    domEls.exampleDisplay.style.pointerEvents = 'all';
    let link = data.link;
    domEls.video.controls = false;
    domEls.video.src = link;
    domEls.video.type = 'video/mp4';
    domEls.video.muted = true;
    domEls.video.addEventListener('loadedmetadata', () => {
      videoSize.width = domEls.video.videoWidth;
      videoSize.height = domEls.video.videoHeight;
      centerVideo();
      let promise = domEls.video.play();
      promise.then(
        () => {
          domEls.playButton.style.display = 'none';
          domEls.exampleDisplay.hidden = false;
          domEls.loader.style.display = 'none';
          domEls.video.loop = true;
          domEls.video.removeEventListener('ended', closeVideo);
          domEls.video.play();
        },
        (err) => {
          console.log(err);
          domEls.exampleDisplay.hidden = false;
          domEls.loader.style.display = 'none';
          domEls.playButton.style.display = 'block';
          domEls.video.addEventListener('ended', closeVideo);
        }
      );
    });
  } else {
    alert('Sorry. Video is not available right now. 😢');
  }
};

const checkAnswer = () => {
  domEls.attention.style.animationName = '';
  takingPhoto = true;
  domEls.statsDisplay.style.display = 'none';
  domEls.kanjiAnswer.textContent = '';
  for (let i = 0; i < currentMondai.kanji.length; i++) {
    let itIsKanji = isKanji(currentMondai.kanji[i]);
    const kanjiText = document.createTextNode(currentMondai.kanji[i]);
    const span = document.createElement('span');
    span.style.fontFamily = `'umeboshi', 'Dosis', sans-serif`;
    span.appendChild(kanjiText);
    if (itIsKanji) {
      span.style.cursor = 'pointer';
      span.addEventListener('click', (e) => {
        getAnimation(e.target.innerText);
      });
    }
    domEls.kanjiAnswer.appendChild(span);
  }
  domEls.checkAnswerBox.style.display = 'block';
  smallCanvasSettings.width = domEls.yourDrawing.clientWidth;
  smallCanvasSettings.height = domEls.yourDrawing.clientHeight;
  domEls.kanjiAnswer.style.fontSize = '88px';
  if (currentMondai.kanji.length === 3) {
    domEls.kanjiAnswer.style.fontSize = '70px';
  }
  if (currentMondai.kanji.length === 4) {
    domEls.kanjiAnswer.style.fontSize = '48px';
  }
  if (currentMondai.kanji.length === 5) {
    domEls.kanjiAnswer.style.fontSize = '40px';
  }
  if (currentMondai.kanji.length > 5) {
    domEls.kanjiAnswer.style.fontSize = '30px';
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
    domEls.attention.style.animationName = 'attention';
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
  if (userStats.questionOutOf.currentQuestion < userSettings.questionsPerRound) {
    domEls.attention.style.animationName = 'attention';
  }
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
    domEls.practiceKanjiExample.textContent = '';
    for (let i = 0; i < currentMondai.kanji.length; i++) {
      let itIsKanji = isKanji(currentMondai.kanji[i]);
      const kanjiText = document.createTextNode(currentMondai.kanji[i]);
      const span = document.createElement('span');
      span.style.fontFamily = `'umeboshi', 'Dosis', sans-serif`;
      span.appendChild(kanjiText);
      if (itIsKanji) {
        span.style.cursor = 'pointer';
        span.addEventListener('click', (e) => {
          getAnimation(e.target.innerText);
        });
      }
      domEls.practiceKanjiExample.appendChild(span);
    }
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
    if (!userSettings.practiceAfterFailure) {
      domEls.attention.style.animationName = 'attention';
    }
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
  smallCanvasSettings.width = domEls.yourDrawing.clientWidth;
  smallCanvasSettings.height = domEls.yourDrawing.clientHeight;
  centerVideo();
});

domEls.nav.addEventListener('click', (e) => {
  if (e.target.id != 'select-study-set-butt') {
    domEls.studySetSelector.style.display = 'none';
  }
});

//mirror is used to keep image data of user's writing so it be compared with correct answer later.
let mirror;

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

//prevent unwanted zooming on mobile
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

allowTouching(domEls.canvas);
allowTouching(domEls.practiceUserCanvas);

///////////////////////p5 canvas stuff/////////////////////////////////

let sketch = function (p) {
  let pg;
  let cnv;
  let getMouseChange;
  let initialWidth;
  let initialHeight;

  p.setup = function () {
    initialWidth = domEls.canvas.clientWidth;
    initialHeight = domEls.canvas.clientHeight;
    console.log('initial!');
    console.log(initialWidth);
    console.log(initialHeight);
    cnv = p.createCanvas(initialWidth, initialHeight);
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
    if (domEls.canvas.clientWidth !== initialWidth || domEls.canvas.clientHeight !== initialHeight) {
      //change canvas size and stretch image on window resize
      pg = p.createGraphics(initialWidth, initialHeight);
      pg.image(cnv, 0, 0, initialWidth, initialHeight);
      p.resizeCanvas(domEls.canvas.clientWidth, domEls.canvas.clientHeight);
      pg.loadPixels();
      initialWidth = domEls.canvas.clientWidth;
      initialHeight = domEls.canvas.clientHeight;
      p.image(pg, 0, 0, initialWidth, initialHeight);
    }
    if (clearCanvas) {
      p.clear();
      clearCanvas = false;
    }
    if (!preventDrawing) {
      p.stroke(userSettings.inkColor);
      p.strokeWeight(3);
      if (userSettings.senseForce) {
        if (touchCors.x && touchCors.force && touchCors.force < 1) {
          if (!touchCors.lastX) {
            let ran = p.random(-1, 1);
            let ranTwo = p.random(-1, 1);
            p.line(
              touchCors.x + p.random(-3, 3),
              touchCors.y + p.random(-3, 3),
              touchCors.x + ran,
              touchCors.y + ranTwo
            );
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

        if ((p.mouseIsPressed && !touchCors.force) || (p.mouseIsPressed && touchCors.force === 1)) {
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

          let increasedBrushSize = mouseData.timeSinceMouseDown - mouseData.timeSinceMouseDown * 0.3 + p.random(-1, 1);

          let ran = p.random(-1, 1);
          let ran2 = p.random(-1, 1);
          mouseData.x = p.mouseX + ran;
          mouseData.y = p.mouseY + ran2;
          p.strokeWeight(userSettings.brushSize * 0.08 + increasedBrushSize);
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
      } else {
        // DRAW IF USER SETTINGS IS SET TO NOT DETECT FORCE
        if (p.mouseIsPressed) {
          p.strokeWeight(userSettings.brushSize / 6);
          p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
        }
      }
    }
    if (takingPhoto) {
      mirror = p.createGraphics(p.width, p.height);

      mirror.image(cnv, 0, 0, smallCanvasSettings.width, smallCanvasSettings.height);

      mirror.loadPixels();
    }
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
    p.stroke(userSettings.inkColor);
    p.strokeWeight(5);

    if (p.mouseIsPressed) {
      p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
    }
  };
  p.windowResized = function () {
    p.resizeCanvas(domEls.practiceUserCanvas.clientWidth, domEls.practiceUserCanvas.clientHeight);
  };
}

new p5(sketch, domEls.canvas);
new p5(yourDrawing, domEls.yourDrawing);
new p5(practiceDrawing, domEls.practiceUserCanvas);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then((res) => {
        console.log('service worker registered');
      })
      .catch((err) => {
        console.log('service worker not registered', err);
      });
  });
}
