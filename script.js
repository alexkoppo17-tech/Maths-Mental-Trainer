const QUESTIONS = [];

// ==========================================
// YOUR QUESTION BANK
// ==========================================

// SUBTRACTION
for (let a = 18; a >= 1; a--) {
  const maxB = Math.min(9, a);
  const minB = Math.max(0, a - 9);

  for (let b = maxB; b >= minB; b--) {
    QUESTIONS.push([`${a}-${b}`, a - b]);
  }
}

QUESTIONS.push(["0-0", 0]);

// MULTIPLICATION 0-12
for (let a = 0; a <= 12; a++) {
  for (let b = 0; b <= 12; b++) {
    QUESTIONS.push([`${a}×${b}`, a * b]);
  }
}

// ADDITION 0-9
for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {
    QUESTIONS.push([`${a}+${b}`, a + b]);
    QUESTIONS.push([`${a}+${b}+1`, a + b + 1]);
  }
}


// ==========================================
// ELEMENTS
// ==========================================

const home = document.getElementById("home");
const game = document.getElementById("game");
const results = document.getElementById("results");

const questionEl = document.getElementById("question");
const answerDisplay = document.getElementById("answerDisplay");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const accuracyEl = document.getElementById("accuracy");
const feedbackEl = document.getElementById("feedback");


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
// SAVED HIGH SCORES
// ==========================================

// SPEED:
// Fastest time for a perfect 10/10.

let speedBest =
  Number(localStorage.getItem("mathSpeedBest")) || null;


// PRACTICE:
// Longest correct streak.

let practiceBest =
  Number(localStorage.getItem("mathPracticeBest")) || 0;


// Time achieved during the best practice streak.

let practiceBestTime =
  Number(localStorage.getItem("mathPracticeBestTime")) || 0;


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

  const copy = array.slice();

  for (let i = copy.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] =
      [copy[j], copy[i]];
  }

  return copy;
}


// ==========================================
// START GAME
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

  startedAt = performance.now();

  streakStartedAt = startedAt;

  clearInterval(timerHandle);

  timerHandle =
    setInterval(updateTimer, 50);

  updateHighScoreDisplay();

  nextQuestion();
}


// ==========================================
// TIMER
// ==========================================

function updateTimer() {

  if (!startedAt) return;

  const elapsed =
    (performance.now() - startedAt) / 1000;

  timerEl.textContent =
    elapsed.toFixed(2) + "s";
}


// ==========================================
// HIGH SCORE DISPLAY DURING GAME
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

  // SPEED TEST FINISHED
  if (
    mode === "speed" &&
    index >= 10
  ) {

    finishSpeed();

    return;
  }


  // PRACTICE MODE
  if (
    mode === "practice" &&
    pool.length === 0
  ) {

    pool = shuffle(QUESTIONS);
  }


  current = pool.shift();

  index++;

  answer = "";

  locked = false;

  questionEl.textContent =
    current[0].replaceAll("-", "−");

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


  // ========================================
  // CORRECT
  // ========================================

  if (isCorrect) {

    correct++;

    currentStreak++;

    feedbackEl.textContent =
      "✓ Correct";


    // SPEED MODE
    if (mode === "speed") {

      // Go straight to the next question.
      nextQuestion();

      return;
    }


    // PRACTICE MODE
    progressEl.textContent =
      `Streak: ${currentStreak}`;

    nextQuestion();

    return;
  }


  // ========================================
  // WRONG
  // ========================================

  wrong++;

  feedbackEl.textContent =
    `✗ Answer: ${correctAnswer}`;


  // PRACTICE MODE ENDS IMMEDIATELY
  if (mode === "practice") {

    finishPractice();

    return;
  }


  // SPEED TEST
  nextQuestion();
}


// ==========================================
// FINISH SPEED TEST
// ==========================================

function finishSpeed() {

  clearInterval(timerHandle);

  timerHandle = null;

  const totalTime =
    (performance.now() - startedAt) / 1000;


  const perfect =
    correct === 10;


  let newRecord = false;


  // ONLY A PERFECT 10/10 CAN SET A RECORD
  if (perfect) {

    if (
      speedBest === null ||
      totalTime < speedBest
    ) {

      speedBest = totalTime;

      localStorage.setItem(
        "mathSpeedBest",
        String(speedBest)
      );

      newRecord = true;
    }
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


  // TITLE
  if (newRecord) {

    document.getElementById(
      "resultTitle"
    ).textContent =
      "🏆 NEW HIGH SCORE!";

  } else if (perfect) {

    document.getElementById(
      "resultTitle"
    ).textContent =
      "10/10 Complete!";

  } else {

    document.getElementById(
      "resultTitle"
    ).textContent =
      "Round Complete";
  }


  // SCORE
  document.getElementById(
    "resultScore"
  ).textContent =
    `${correct} / 10`;


  // CORRECT
  document.getElementById(
    "resultCorrect"
  ).textContent =
    correct;


  // WRONG
  document.getElementById(
    "resultWrong"
  ).textContent =
    wrong;


  // CURRENT TIME
  document.getElementById(
    "resultTime"
  ).textContent =
    totalTime.toFixed(2) + " s";


  // AVERAGE
  document.getElementById(
    "resultAverage"
  ).textContent =
    (totalTime / 10).toFixed(2) + " s";


  // ========================================
  // SHOW BEST TIME
  // ========================================

  const resultCard =
    document.querySelector(".result-card");


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

    bestDisplay.style.marginTop =
      "18px";

    resultCard.appendChild(
      bestDisplay
    );
  }


  if (speedBest !== null) {

    bestDisplay.textContent =
      `🏆 Best 10/10 time: ${speedBest.toFixed(2)} s`;

  } else {

    bestDisplay.textContent =
      "🏆 Best 10/10 time: Not set";
  }
}


// ==========================================
// FINISH PRACTICE
// ==========================================

function finishPractice() {

  clearInterval(timerHandle);

  timerHandle = null;


  const streakTime =
    (performance.now() - streakStartedAt) / 1000;


  let newRecord = false;


  // ========================================
  // NEW STREAK RECORD
  // ========================================

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

    // Same number of questions,
    // but completed faster.

    practiceBestTime =
      streakTime;


    localStorage.setItem(
      "mathPracticeBestTime",
      String(practiceBestTime)
    );
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


  if (newRecord) {

    document.getElementById(
      "resultTitle"
    ).textContent =
      "🔥 NEW PRACTICE HIGH SCORE!";

  } else {

    document.getElementById(
      "resultTitle"
    ).textContent =
      "Practice Failed";
  }


  // CURRENT STREAK
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


  // CURRENT TIME
  document.getElementById(
    "resultTime"
  ).textContent =
    streakTime.toFixed(2) + " s";


  // CURRENT AVERAGE
  document.getElementById(
    "resultAverage"
  ).textContent =
    currentStreak > 0
      ? (streakTime / currentStreak).toFixed(2) + " s"
      : "0.00 s";


  // ========================================
  // SHOW BEST PRACTICE SCORE
  // ========================================

  const resultCard =
    document.querySelector(".result-card");


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


  if (practiceBest > 0) {

    bestDisplay.innerHTML =
      `🏆 Best streak: ${practiceBest} correct<br>` +
      `⏱️ Best time: ${practiceBestTime.toFixed(2)} s`;

  } else {

    bestDisplay.textContent =
      "🏆 Best streak: Not set";
  }
}


// ==========================================
// FAST TOUCH HANDLER
// ==========================================
//
// We use pointerdown so the action happens
// when your finger TOUCHES the button,
// rather than waiting for a click.
//
// The buttons already have touch-action:
// manipulation in style.css.

function fastTouch(element, action) {

  element.addEventListener(
    "pointerdown",
    function(event) {

      event.preventDefault();

      action();
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

    fastTouch(button, () => {

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
    });
  });


// ==========================================
// SUBMIT
// ==========================================

fastTouch(
  document.getElementById("submitBtn"),
  submitAnswer
);


// ==========================================
// HOME BUTTONS
// ==========================================

fastTouch(
  document.getElementById("speedBtn"),
  () => startGame("speed")
);


fastTouch(
  document.getElementById("practiceBtn"),
  () => startGame("practice")
);


fastTouch(
  document.getElementById("againBtn"),
  () => startGame(mode)
);


fastTouch(
  document.getElementById("homeBtn"),
  () => {

    clearInterval(timerHandle);

    timerHandle = null;

    results.classList.add("hidden");

    game.classList.add("hidden");

    home.classList.remove("hidden");
  }
);


fastTouch(
  document.getElementById("backBtn"),
  () => {

    clearInterval(timerHandle);

    timerHandle = null;

    game.classList.add("hidden");

    home.classList.remove("hidden");
  }
);


// ==========================================
// PHYSICAL KEYBOARD SUPPORT
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
