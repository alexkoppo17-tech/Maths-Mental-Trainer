// ==========================================
// MATHS MEMORY TRAINER
// iPHONE-RELIABLE TOUCH VERSION
// ==========================================


// ==========================================
// YOUR ORIGINAL QUESTION BANK
// ==========================================

const QUESTIONS = [

  // ----------------------------------------
  // SUBTRACTION
  // ----------------------------------------

  ["18-9",9],
  ["17-9",8],
  ["17-8",9],
  ["16-9",7],
  ["16-8",8],
  ["16-7",9],
  ["15-9",6],
  ["15-8",7],
  ["15-7",8],
  ["15-6",9],
  ["14-9",5],
  ["14-8",6],
  ["14-7",7],
  ["14-6",8],
  ["14-5",9],
  ["13-9",4],
  ["13-8",5],
  ["13-7",6],
  ["13-6",7],
  ["13-5",8],
  ["13-4",9],
  ["12-9",3],
  ["12-8",4],
  ["12-7",5],
  ["12-6",6],
  ["12-5",7],
  ["12-4",8],
  ["12-3",9],
  ["11-9",2],
  ["11-8",3],
  ["11-7",4],
  ["11-6",5],
  ["11-5",6],
  ["11-4",7],
  ["11-3",8],
  ["11-2",9],
  ["10-9",1],
  ["10-8",2],
  ["10-7",3],
  ["10-6",4],
  ["10-5",5],
  ["10-4",6],
  ["10-3",7],
  ["10-2",8],
  ["10-1",9],
  ["9-9",0],
  ["9-8",1],
  ["9-7",2],
  ["9-6",3],
  ["9-5",4],
  ["9-4",5],
  ["9-3",6],
  ["9-2",7],
  ["9-1",8],
  ["9-0",9],
  ["8-8",0],
  ["8-7",1],
  ["8-6",2],
  ["8-5",3],
  ["8-4",4],
  ["8-3",5],
  ["8-2",6],
  ["8-1",7],
  ["8-0",8],
  ["7-7",0],
  ["7-6",1],
  ["7-5",2],
  ["7-4",3],
  ["7-3",4],
  ["7-2",5],
  ["7-1",6],
  ["7-0",7],
  ["6-6",0],
  ["6-5",1],
  ["6-4",2],
  ["6-3",3],
  ["6-2",4],
  ["6-1",5],
  ["6-0",6],
  ["5-5",0],
  ["5-4",1],
  ["5-3",2],
  ["5-2",3],
  ["5-1",4],
  ["5-0",5],
  ["4-4",0],
  ["4-3",1],
  ["4-2",2],
  ["4-1",3],
  ["4-0",4],
  ["3-3",0],
  ["3-2",1],
  ["3-1",2],
  ["3-0",3],
  ["2-2",0],
  ["2-1",1],
  ["2-0",2],
  ["1-1",0],
  ["1-0",1],
  ["0-0",0],


  // ----------------------------------------
  // MULTIPLICATION 0-12
  // ----------------------------------------

  ["0×0",0],
  ["0×1",0],
  ["0×2",0],
  ["0×3",0],
  ["0×4",0],
  ["0×5",0],
  ["0×6",0],
  ["0×7",0],
  ["0×8",0],
  ["0×9",0],
  ["0×10",0],
  ["0×11",0],
  ["0×12",0],

  ["1×0",0],
  ["1×1",1],
  ["1×2",2],
  ["1×3",3],
  ["1×4",4],
  ["1×5",5],
  ["1×6",6],
  ["1×7",7],
  ["1×8",8],
  ["1×9",9],
  ["1×10",10],
  ["1×11",11],
  ["1×12",12],

  ["2×0",0],
  ["2×1",2],
  ["2×2",4],
  ["2×3",6],
  ["2×4",8],
  ["2×5",10],
  ["2×6",12],
  ["2×7",14],
  ["2×8",16],
  ["2×9",18],
  ["2×10",20],
  ["2×11",22],
  ["2×12",24],

  ["3×0",0],
  ["3×1",3],
  ["3×2",6],
  ["3×3",9],
  ["3×4",12],
  ["3×5",15],
  ["3×6",18],
  ["3×7",21],
  ["3×8",24],
  ["3×9",27],
  ["3×10",30],
  ["3×11",33],
  ["3×12",36],

  ["4×0",0],
  ["4×1",4],
  ["4×2",8],
  ["4×3",12],
  ["4×4",16],
  ["4×5",20],
  ["4×6",24],
  ["4×7",28],
  ["4×8",32],
  ["4×9",36],
  ["4×10",40],
  ["4×11",44],
  ["4×12",48],

  ["5×0",0],
  ["5×1",5],
  ["5×2",10],
  ["5×3",15],
  ["5×4",20],
  ["5×5",25],
  ["5×6",30],
  ["5×7",35],
  ["5×8",40],
  ["5×9",45],
  ["5×10",50],
  ["5×11",55],
  ["5×12",60],

  ["6×0",0],
  ["6×1",6],
  ["6×2",12],
  ["6×3",18],
  ["6×4",24],
  ["6×5",30],
  ["6×6",36],
  ["6×7",42],
  ["6×8",48],
  ["6×9",54],
  ["6×10",60],
  ["6×11",66],
  ["6×12",72],

  ["7×0",0],
  ["7×1",7],
  ["7×2",14],
  ["7×3",21],
  ["7×4",28],
  ["7×5",35],
  ["7×6",42],
  ["7×7",49],
  ["7×8",56],
  ["7×9",63],
  ["7×10",70],
  ["7×11",77],
  ["7×12",84],

  ["8×0",0],
  ["8×1",8],
  ["8×2",16],
  ["8×3",24],
  ["8×4",32],
  ["8×5",40],
  ["8×6",48],
  ["8×7",56],
  ["8×8",64],
  ["8×9",72],
  ["8×10",80],
  ["8×11",88],
  ["8×12",96],

  ["9×0",0],
  ["9×1",9],
  ["9×2",18],
  ["9×3",27],
  ["9×4",36],
  ["9×5",45],
  ["9×6",54],
  ["9×7",63],
  ["9×8",72],
  ["9×9",81],
  ["9×10",90],
  ["9×11",99],
  ["9×12",108],

  ["10×0",0],
  ["10×1",10],
  ["10×2",20],
  ["10×3",30],
  ["10×4",40],
  ["10×5",50],
  ["10×6",60],
  ["10×7",70],
  ["10×8",80],
  ["10×9",90],
  ["10×10",100],
  ["10×11",110],
  ["10×12",120],

  ["11×0",0],
  ["11×1",11],
  ["11×2",22],
  ["11×3",33],
  ["11×4",44],
  ["11×5",55],
  ["11×6",66],
  ["11×7",77],
  ["11×8",88],
  ["11×9",99],
  ["11×10",110],
  ["11×11",121],
  ["11×12",132],

  ["12×0",0],
  ["12×1",12],
  ["12×2",24],
  ["12×3",36],
  ["12×4",48],
  ["12×5",60],
  ["12×6",72],
  ["12×7",84],
  ["12×8",96],
  ["12×9",108],
  ["12×10",120],
  ["12×11",132],
  ["12×12",144],


  // ----------------------------------------
  // ADDITION
  // ----------------------------------------

  ["0+0",0],["0+0+1",1],
  ["0+1",1],["0+1+1",2],
  ["0+2",2],["0+2+1",3],
  ["0+3",3],["0+3+1",4],
  ["0+4",4],["0+4+1",5],
  ["0+5",5],["0+5+1",6],
  ["0+6",6],["0+6+1",7],
  ["0+7",7],["0+7+1",8],
  ["0+8",8],["0+8+1",9],
  ["0+9",9],["0+9+1",10],

  ["1+0",1],["1+0+1",2],
  ["1+1",2],["1+1+1",3],
  ["1+2",3],["1+2+1",4],
  ["1+3",4],["1+3+1",5],
  ["1+4",5],["1+4+1",6],
  ["1+5",6],["1+5+1",7],
  ["1+6",7],["1+6+1",8],
  ["1+7",8],["1+7+1",9],
  ["1+8",9],["1+8+1",10],
  ["1+9",10],["1+9+1",11],

  ["2+0",2],["2+0+1",3],
  ["2+1",3],["2+1+1",4],
  ["2+2",4],["2+2+1",5],
  ["2+3",5],["2+3+1",6],
  ["2+4",6],["2+4+1",7],
  ["2+5",7],["2+5+1",8],
  ["2+6",8],["2+6+1",9],
  ["2+7",9],["2+7+1",10],
  ["2+8",10],["2+8+1",11],
  ["2+9",11],["2+9+1",12],

  ["3+0",3],["3+0+1",4],
  ["3+1",4],["3+1+1",5],
  ["3+2",5],["3+2+1",6],
  ["3+3",6],["3+3+1",7],
  ["3+4",7],["3+4+1",8],
  ["3+5",8],["3+5+1",9],
  ["3+6",9],["3+6+1",10],
  ["3+7",10],["3+7+1",11],
  ["3+8",11],["3+8+1",12],
  ["3+9",12],["3+9+1",13],

  ["4+0",4],["4+0+1",5],
  ["4+1",5],["4+1+1",6],
  ["4+2",6],["4+2+1",7],
  ["4+3",7],["4+3+1",8],
  ["4+4",8],["4+4+1",9],
  ["4+5",9],["4+5+1",10],
  ["4+6",10],["4+6+1",11],
  ["4+7",11],["4+7+1",12],
  ["4+8",12],["4+8+1",13],
  ["4+9",13],["4+9+1",14],

  ["5+0",5],["5+0+1",6],
  ["5+1",6],["5+1+1",7],
  ["5+2",7],["5+2+1",8],
  ["5+3",8],["5+3+1",9],
  ["5+4",9],["5+4+1",10],
  ["5+5",10],["5+5+1",11],
  ["5+6",11],["5+6+1",12],
  ["5+7",12],["5+7+1",13],
  ["5+8",13],["5+8+1",14],
  ["5+9",14],["5+9+1",15],

  ["6+0",6],["6+0+1",7],
  ["6+1",7],["6+1+1",8],
  ["6+2",8],["6+2+1",9],
  ["6+3",9],["6+3+1",10],
  ["6+4",10],["6+4+1",11],
  ["6+5",11],["6+5+1",12],
  ["6+6",12],["6+6+1",13],
  ["6+7",13],["6+7+1",14],
  ["6+8",14],["6+8+1",15],
  ["6+9",15],["6+9+1",16],

  ["7+0",7],["7+0+1",8],
  ["7+1",8],["7+1+1",9],
  ["7+2",9],["7+2+1",10],
  ["7+3",10],["7+3+1",11],
  ["7+4",11],["7+4+1",12],
  ["7+5",12],["7+5+1",13],
  ["7+6",13],["7+6+1",14],
  ["7+7",14],["7+7+1",15],
  ["7+8",15],["7+8+1",16],
  ["7+9",16],["7+9+1",17],

  ["8+0",8],["8+0+1",9],
  ["8+1",9],["8+1+1",10],
  ["8+2",10],["8+2+1",11],
  ["8+3",11],["8+3+1",12],
  ["8+4",12],["8+4+1",13],
  ["8+5",13],["8+5+1",14],
  ["8+6",14],["8+6+1",15],
  ["8+7",15],["8+7+1",16],
  ["8+8",16],["8+8+1",17],
  ["8+9",17],["8+9+1",18],

  ["9+0",9],["9+0+1",10],
  ["9+1",10],["9+1+1",11],
  ["9+2",11],["9+2+1",12],
  ["9+3",12],["9+3+1",13],
  ["9+4",13],["9+4+1",14],
  ["9+5",14],["9+5+1",15],
  ["9+6",15],["9+6+1",16],
  ["9+7",16],["9+7+1",17],
  ["9+8",17],["9+8+1",18],
  ["9+9",18],["9+9+1",19]
];


// ==========================================
// ELEMENTS
// ==========================================

const home =
  document.getElementById("home");

const game =
  document.getElementById("game");

const results =
  document.getElementById("results");

const questionEl =
  document.getElementById("question");

const answerDisplay =
  document.getElementById("answerDisplay");

const progressEl =
  document.getElementById("progress");

const timerEl =
  document.getElementById("timer");

const accuracyEl =
  document.getElementById("accuracy");

const feedbackEl =
  document.getElementById("feedback");


// ==========================================
// GAME STATE
// ==========================================

let mode = "speed";

let pool = [];

let current = null;

let answer = "";

let index = 0;

let correct = 0;

let wrong = 0;

let startedAt = 0;

let timerHandle = null;

let locked = false;

let currentStreak = 0;

let streakStartedAt = 0;


// ==========================================
// HIGH SCORES
// ==========================================

let speedBest =
  Number(
    localStorage.getItem(
      "mathSpeedBest"
    )
  ) || null;

let practiceBest =
  Number(
    localStorage.getItem(
      "mathPracticeBest"
    )
  ) || 0;

let practiceBestTime =
  Number(
    localStorage.getItem(
      "mathPracticeBestTime"
    )
  ) || 0;


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

  const copy =
    array.slice();

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] =
    [
      copy[j],
      copy[i]
    ];
  }

  return copy;
}


// ==========================================
// START GAME
// ==========================================

function startGame(selectedMode) {

  mode =
    selectedMode;

  pool =
    shuffle(QUESTIONS);

  current = null;

  answer = "";

  index = 0;

  correct = 0;

  wrong = 0;

  currentStreak = 0;

  locked = false;

  home.classList.add(
    "hidden"
  );

  results.classList.add(
    "hidden"
  );

  game.classList.remove(
    "hidden"
  );

  startedAt =
    performance.now();

  streakStartedAt =
    startedAt;

  clearInterval(
    timerHandle
  );

  timerHandle =
    setInterval(
      updateTimer,
      50
    );

  updateHighScoreDisplay();

  nextQuestion();
}


// ==========================================
// TIMER
// ==========================================

function updateTimer() {

  if (!startedAt)
    return;

  const elapsed =
    (
      performance.now() -
      startedAt
    ) / 1000;

  timerEl.textContent =
    elapsed.toFixed(2) +
    "s";
}


// ==========================================
// HIGH SCORE DISPLAY
// ==========================================

function updateHighScoreDisplay() {

  if (
    mode === "speed"
  ) {

    if (
      speedBest !== null
    ) {

      accuracyEl.textContent =
        `🏆 Best: ${speedBest.toFixed(2)}s`;

    } else {

      accuracyEl.textContent =
        "🏆 Best: Not set";
    }

  } else {

    if (
      practiceBest > 0
    ) {

      accuracyEl.textContent =
        `🏆 Best: ${practiceBest} in a row`;

    } else {

      accuracyEl.textContent =
        "🏆 Best: Not set";
    }
  }
}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

  if (
    mode === "speed" &&
    index >= 10
  ) {

    finishSpeed();

    return;
  }


  if (
    mode === "practice" &&
    pool.length === 0
  ) {

    pool =
      shuffle(QUESTIONS);
  }


  current =
    pool.shift();

  index++;

  answer = "";

  locked = false;

  questionEl.textContent =
    current[0].replaceAll(
      "-",
      "−"
    );

  answerDisplay.textContent =
    "\u00a0";


  if (
    mode === "speed"
  ) {

    progressEl.textContent =
      `Question ${index} / 10`;

  } else {

    progressEl.textContent =
      `Streak: ${currentStreak}`;
  }


  feedbackEl.textContent =
    "\u00a0";

  updateHighScoreDisplay();
}


// ==========================================
// NUMBER INPUT
// ==========================================

function enterDigit(digit) {

  if (locked)
    return;

  if (
    answer.length >= 4
  )
    return;

  answer +=
    String(digit);

  answerDisplay.textContent =
    answer;
}


// ==========================================
// DELETE LAST
// ==========================================

function clearLast() {

  if (locked)
    return;

  answer =
    answer.slice(
      0,
      -1
    );

  answerDisplay.textContent =
    answer || "\u00a0";
}


// ==========================================
// CLEAR ALL
// ==========================================

function clearAll() {

  if (locked)
    return;

  answer = "";

  answerDisplay.textContent =
    "\u00a0";
}


// ==========================================
// SUBMIT
// ==========================================

function submitAnswer() {

  if (locked)
    return;

  if (
    answer === ""
  )
    return;

  locked = true;

  const entered =
    Number(answer);

  const correctAnswer =
    current[1];

  const isCorrect =
    entered ===
    correctAnswer;


  if (isCorrect) {

    correct++;

    currentStreak++;

    feedbackEl.textContent =
      "✓ Correct";


    if (
      mode === "speed"
    ) {

      nextQuestion();

      return;
    }


    progressEl.textContent =
      `Streak: ${currentStreak}`;

    nextQuestion();

    return;
  }


  wrong++;

  feedbackEl.textContent =
    `✗ Answer: ${correctAnswer}`;


  if (
    mode === "practice"
  ) {

    finishPractice();

    return;
  }


  nextQuestion();
}


// ==========================================
// SPEED RESULTS
// ==========================================

function finishSpeed() {

  clearInterval(
    timerHandle
  );

  timerHandle =
    null;

  const totalTime =
    (
      performance.now() -
      startedAt
    ) / 1000;

  const perfect =
    correct === 10;

  let newRecord =
    false;


  if (perfect) {

    if (
      speedBest === null ||
      totalTime < speedBest
    ) {

      speedBest =
        totalTime;

      localStorage.setItem(
        "mathSpeedBest",
        String(speedBest)
      );

      newRecord =
        true;
    }
  }


  game.classList.add(
    "hidden"
  );

  results.classList.remove(
    "hidden"
  );


  document.getElementById(
    "resultTitle"
  ).textContent =
    newRecord
      ? "🏆 NEW HIGH SCORE!"
      : perfect
        ? "10/10 Complete!"
        : "Round Complete";


  document.getElementById(
    "resultScore"
  ).textContent =
    `${correct} / 10`;


  document.getElementById(
    "resultCorrect"
  ).textContent =
    correct;


  document.getElementById(
    "resultWrong"
  ).textContent =
    wrong;


  document.getElementById(
    "resultTime"
  ).textContent =
    totalTime.toFixed(2) +
    " s";


  document.getElementById(
    "resultAverage"
  ).textContent =
    (
      totalTime / 10
    ).toFixed(2) +
    " s";


  showBestResult(
    speedBest !== null
      ? `🏆 Best 10/10 time: ${speedBest.toFixed(2)} s`
      : "🏆 Best 10/10 time: Not set"
  );
}


// ==========================================
// PRACTICE RESULTS
// ==========================================

function finishPractice() {

  clearInterval(
    timerHandle
  );

  timerHandle =
    null;

  const streakTime =
    (
      performance.now() -
      streakStartedAt
    ) / 1000;

  let newRecord =
    false;


  if (
    currentStreak >
    practiceBest
  ) {

    practiceBest =
      currentStreak;

    practiceBestTime =
      streakTime;

    localStorage.setItem(
      "mathPracticeBest",
      String(practiceBest)
    );

    localStorage.setItem(
      "mathPracticeBestTime",
      String(practiceBestTime)
    );

    newRecord =
      true;

  } else if (
    currentStreak ===
    practiceBest &&
    currentStreak > 0 &&
    (
      practiceBestTime === 0 ||
      streakTime <
      practiceBestTime
    )
  ) {

    practiceBestTime =
      streakTime;

    localStorage.setItem(
      "mathPracticeBestTime",
      String(practiceBestTime)
    );
  }


  game.classList.add(
    "hidden"
  );

  results.classList.remove(
    "hidden"
  );


  document.getElementById(
    "resultTitle"
  ).textContent =
    newRecord
      ? "🔥 NEW PRACTICE HIGH SCORE!"
      : "Practice Failed";


  document.getElementById(
    "resultScore"
  ).textContent =
    `${currentStreak} correct in a row`;


  document.getElementById(
    "resultCorrect"
  ).textContent =
    currentStreak;


  document.getElementById(
    "resultWrong"
  ).textContent =
    1;


  document.getElementById(
    "resultTime"
  ).textContent =
    streakTime.toFixed(2) +
    " s";


  document.getElementById(
    "resultAverage"
  ).textContent =
    currentStreak > 0
      ? (
          streakTime /
          currentStreak
        ).toFixed(2) +
        " s"
      : "0.00 s";


  showBestResult(
    practiceBest > 0
      ? `🏆 Best streak: ${practiceBest} correct<br>
         ⏱️ Best time: ${practiceBestTime.toFixed(2)} s`
      : "🏆 Best streak: Not set"
  );
}


// ==========================================
// RESULTS HIGH SCORE
// ==========================================

function showBestResult(text) {

  const resultCard =
    document.querySelector(
      ".result-card"
    );

  let bestDisplay =
    document.getElementById(
      "bestScoreDisplay"
    );


  if (!bestDisplay) {

    bestDisplay =
      document.createElement(
        "div"
      );

    bestDisplay.id =
      "bestScoreDisplay";

    bestDisplay.style.textAlign =
      "center";

    bestDisplay.style.fontSize =
      "20px";

    bestDisplay.style.fontWeight =
      "800";

    bestDisplay.style.lineHeight =
      "1.4";

    bestDisplay.style.marginTop =
      "18px";

    resultCard.appendChild(
      bestDisplay
    );
  }


  bestDisplay.innerHTML =
    text;
}


// ==========================================
// 📱 RELIABLE iPHONE TOUCH BUTTONS
// ==========================================

function fastButton(
  element,
  action
) {

  if (!element)
    return;


  let touchActive =
    false;


  element.addEventListener(
    "touchstart",
    function(event) {

      event.preventDefault();

      if (touchActive)
        return;

      touchActive =
        true;

      action();

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "touchend",
    function(event) {

      event.preventDefault();

      touchActive =
        false;

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "touchcancel",
    function() {

      touchActive =
        false;

    }
  );


  // Mouse / trackpad fallback.
  element.addEventListener(
    "pointerdown",
    function(event) {

      if (
        event.pointerType !==
        "touch"
      ) {

        event.preventDefault();

        action();
      }
    },
    {
      passive: false
    }
  );
}


// ==========================================
// KEYPAD
// ==========================================

document
  .querySelectorAll(".key")
  .forEach(
    button => {

      fastButton(
        button,
        function() {

          const key =
            button.dataset.key;


          if (
            key === "clear"
          ) {

            clearLast();

          } else if (
            key === "clearAll"
          ) {

            clearAll();

          } else {

            enterDigit(key);
          }
        }
      );
    }
  );


// ==========================================
// SUBMIT
// ==========================================

fastButton(
  document.getElementById(
    "submitBtn"
  ),
  submitAnswer
);


// ==========================================
// HOME BUTTONS
// ==========================================

fastButton(
  document.getElementById(
    "speedBtn"
  ),
  function() {

    startGame(
      "speed"
    );
  }
);


fastButton(
  document.getElementById(
    "practiceBtn"
  ),
  function() {

    startGame(
      "practice"
    );
  }
);


fastButton(
  document.getElementById(
    "againBtn"
  ),
  function() {

    startGame(
      mode
    );
  }
);


fastButton(
  document.getElementById(
    "homeBtn"
  ),
  function() {

    clearInterval(
      timerHandle
    );

    timerHandle =
      null;

    results.classList.add(
      "hidden"
    );

    game.classList.add(
      "hidden"
    );

    home.classList.remove(
      "hidden"
    );
  }
);


fastButton(
  document.getElementById(
    "backBtn"
  ),
  function() {

    clearInterval(
      timerHandle
    );

    timerHandle =
      null;

    game.classList.add(
      "hidden"
    );

    home.classList.remove(
      "hidden"
    );
  }
);


// ==========================================
// PHYSICAL KEYBOARD
// ==========================================

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key >= "0" &&
      event.key <= "9"
    ) {

      enterDigit(
        event.key
      );

    } else if (
      event.key ===
      "Backspace"
    ) {

      clearLast();

    } else if (
      event.key ===
      "Escape"
    ) {

      clearAll();

    } else if (
      event.key ===
      "Enter"
    ) {

      submitAnswer();
    }
  }
);
