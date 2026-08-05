// ==========================================
// MATHS MEMORY TRAINER
// FAST TOUCH VERSION
// ==========================================

const QUESTIONS = [];

// ------------------------------------------
// SUBTRACTION
// ------------------------------------------

for (let a = 18; a >= 1; a--) {
  const maxB = Math.min(9, a);
  const minB = Math.max(0, a - 9);

  for (let b = maxB; b >= minB; b--) {
    QUESTIONS.push([`${a}-${b}`, a - b]);
  }
}

QUESTIONS.push(["0-0", 0]);


// ------------------------------------------
// MULTIPLICATION 0-12
// ------------------------------------------

for (let a = 0; a <= 12; a++) {
  for (let b = 0; b <= 12; b++) {
    QUESTIONS.push([`${a}×${b}`, a * b]);
  }
}


// ------------------------------------------
// ADDITION 0-9
// ------------------------------------------

for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {

    QUESTIONS.push([
      `${a}+${b}`,
      a + b
    ]);

    QUESTIONS.push([
      `${a}+${b}+1`,
      a + b + 1
    ]);
  }
}


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
// GAME VARIABLES
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
    localStorage.getItem("mathSpeedBest")
  ) || null;

let practiceBest =
  Number(
    localStorage.getItem("mathPracticeBest")
  ) || 0;

let practiceBestTime =
  Number(
    localStorage.getItem("mathPracticeBestTime")
  ) || 0;


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

  const copy = array.slice();

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [copy[i], copy[j]] =
      [copy[j], copy[i]];
  }

  return copy;
}


// ==========================================
// START
// ==========================================

function startGame(selectedMode) {

  mode = selectedMode;

  pool = shuffle(QUESTIONS);

  current = null;

  answer = "";

  index = 0;

  correct = 0;

  wrong = 0;

  currentStreak = 0;

  locked = false;

  home.classList.add("hidden");

  results.classList.add("hidden");

  game.classList.remove("hidden");

  startedAt =
    performance.now();

  streakStartedAt =
    startedAt;

  clearInterval(timerHandle);

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

  if (!startedAt) return;

  const elapsed =
    (
      performance.now() -
      startedAt
    ) / 1000;

  timerEl.textContent =
    elapsed.toFixed(2) + "s";
}


// ==========================================
// HIGH SCORE DISPLAY
// ==========================================

function updateHighScoreDisplay() {

  if (mode === "speed") {

    if (speedBest !== null) {

      accuracyEl.textContent =
        `🏆 Best: ${speedBest.toFixed(2)}s`;

    } else {

      accuracyEl.textContent =
        "🏆 Best: Not set";
    }

  } else {

    if (practiceBest > 0) {

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


  if (mode === "speed") {

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

  if (locked) return;

  if (answer.length >= 4) return;

  answer += String(digit);

  answerDisplay.textContent =
    answer;
}


// ==========================================
// BACKSPACE
// ==========================================

function clearLast() {

  if (locked) return;

  answer =
    answer.slice(0, -1);

  answerDisplay.textContent =
    answer || "\u00a0";
}


// ==========================================
// CLEAR
// ==========================================

function clearAll() {

  if (locked) return;

  answer = "";

  answerDisplay.textContent =
    "\u00a0";
}


// ==========================================
// SUBMIT
// ==========================================

function submitAnswer() {

  if (locked) return;

  if (answer === "") return;

  locked = true;

  const entered =
    Number(answer);

  const correctAnswer =
    current[1];

  const isCorrect =
    entered === correctAnswer;


  if (isCorrect) {

    correct++;

    currentStreak++;

    feedbackEl.textContent =
      "✓ Correct";


    if (mode === "speed") {

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


  if (mode === "practice") {

    finishPractice();

    return;
  }


  nextQuestion();
}


// ==========================================
// SPEED RESULTS
// ==========================================

function finishSpeed() {

  clearInterval(timerHandle);

  timerHandle = null;

  const totalTime =
    (
      performance.now() -
      startedAt
    ) / 1000;

  const perfect =
    correct === 10;

  let newRecord = false;


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

      newRecord = true;
    }
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


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
    totalTime.toFixed(2) + " s";


  document.getElementById(
    "resultAverage"
  ).textContent =
    (totalTime / 10)
      .toFixed(2) + " s";


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

  clearInterval(timerHandle);

  timerHandle = null;

  const streakTime =
    (
      performance.now() -
      streakStartedAt
    ) / 1000;

  let newRecord = false;


  if (
    currentStreak > practiceBest
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

    newRecord = true;

  } else if (
    currentStreak === practiceBest &&
    currentStreak > 0 &&
    (
      practiceBestTime === 0 ||
      streakTime < practiceBestTime
    )
  ) {

    practiceBestTime =
      streakTime;

    localStorage.setItem(
      "mathPracticeBestTime",
      String(practiceBestTime)
    );
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


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
    streakTime.toFixed(2) + " s";


  document.getElementById(
    "resultAverage"
  ).textContent =
    currentStreak > 0
      ? (
          streakTime /
          currentStreak
        ).toFixed(2) + " s"
      : "0.00 s";


  showBestResult(
    practiceBest > 0
      ? `🏆 Best streak: ${practiceBest} correct<br>
         ⏱️ Best time: ${practiceBestTime.toFixed(2)} s`
      : "🏆 Best streak: Not set"
  );
}


// ==========================================
// RESULT HIGH SCORE
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
      document.createElement("div");

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
// ⚡ ULTRA-FAST BUTTON HANDLING
// ==========================================
//
// IMPORTANT:
// We don't use click events here.
//
// The action happens immediately on
// pointerdown.
//
// We also prevent the browser from
// generating a second click afterwards.

function fastButton(
  element,
  action
) {

  if (!element) return;


  element.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      action();

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "click",
    event => {

      event.preventDefault();

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
  .forEach(button => {

    fastButton(
      button,
      () => {

        const key =
          button.dataset.key;


        if (key === "clear") {

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
  });


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
  () => startGame("speed")
);


fastButton(
  document.getElementById(
    "practiceBtn"
  ),
  () => startGame("practice")
);


fastButton(
  document.getElementById(
    "againBtn"
  ),
  () => startGame(mode)
);


fastButton(
  document.getElementById(
    "homeBtn"
  ),
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle = null;

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
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle = null;

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
  event => {

    if (
      event.key >= "0" &&
      event.key <= "9"
    ) {

      enterDigit(event.key);

    } else if (
      event.key === "Backspace"
    ) {

      clearLast();

    } else if (
      event.key === "Escape"
    ) {

      clearAll();

    } else if (
      event.key === "Enter"
    ) {

      submitAnswer();
    }
  }
);
