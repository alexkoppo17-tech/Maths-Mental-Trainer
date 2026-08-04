const QUESTIONS = [];

// ===============================
// YOUR ORIGINAL QUESTION BANK
// ===============================

// Subtraction
for (let a = 18; a >= 1; a--) {
  const maxB = Math.min(9, a);
  const minB = Math.max(0, a - 9);

  for (let b = maxB; b >= minB; b--) {
    QUESTIONS.push([`${a}-${b}`, a - b]);
  }
}

QUESTIONS.push(["0-0", 0]);

// Multiplication 0-12
for (let a = 0; a <= 12; a++) {
  for (let b = 0; b <= 12; b++) {
    QUESTIONS.push([`${a}×${b}`, a * b]);
  }
}

// Addition 0-9 and +1 combinations
for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {
    QUESTIONS.push([`${a}+${b}`, a + b]);
    QUESTIONS.push([`${a}+${b}+1`, a + b + 1]);
  }
}


// ===============================
// ELEMENTS
// ===============================

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


// ===============================
// GAME VARIABLES
// ===============================

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

let streakStartTime = 0;
let currentStreak = 0;


// ===============================
// HIGH SCORES
// ===============================

let speedHighScore =
  Number(localStorage.getItem("mathSpeedHighScore")) || null;

let practiceHighScore =
  Number(localStorage.getItem("mathPracticeHighScore")) || 0;

let practiceHighScoreTime =
  Number(localStorage.getItem("mathPracticeHighScoreTime")) || 0;


// ===============================
// SHUFFLE
// ===============================

function shuffle(arr) {

  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}


// ===============================
// START GAME
// ===============================

function startGame(selectedMode) {

  mode = selectedMode;

  pool = shuffle(QUESTIONS);

  current = null;

  answer = "";

  index = 0;

  correct = 0;

  wrong = 0;

  locked = false;

  currentStreak = 0;

  home.classList.add("hidden");

  results.classList.add("hidden");

  game.classList.remove("hidden");

  startedAt = performance.now();

  streakStartTime = startedAt;

  timerHandle = setInterval(updateTimer, 50);

  showHighScore();

  nextQuestion();
}


// ===============================
// TIMER
// ===============================

function updateTimer() {

  if (!startedAt) return;

  const elapsed =
    (performance.now() - startedAt) / 1000;

  timerEl.textContent =
    elapsed.toFixed(2) + "s";
}


// ===============================
// HIGH SCORE DISPLAY
// ===============================

function showHighScore() {

  if (mode === "speed") {

    if (speedHighScore !== null) {

      accuracyEl.textContent =
        `🏆 Best: ${speedHighScore.toFixed(2)}s`;

    } else {

      accuracyEl.textContent =
        "🏆 Best: Not set";

    }

  } else {

    if (practiceHighScore > 0) {

      accuracyEl.textContent =
        `🏆 Best: ${practiceHighScore} in a row • ${practiceHighScoreTime.toFixed(2)}s`;

    } else {

      accuracyEl.textContent =
        "🏆 Best: Not set";

    }
  }
}


// ===============================
// NEXT QUESTION
// ===============================

function nextQuestion() {

  // SPEED TEST
  if (mode === "speed" && index >= 10) {

    finishSpeedTest();

    return;
  }


  // PRACTICE MODE
  if (mode === "practice" && pool.length === 0) {

    pool = shuffle(QUESTIONS);
  }


  current = pool.shift();

  index++;

  answer = "";

  locked = false;

  questionEl.textContent =
    current[0].replaceAll("-", "−");

  answerDisplay.textContent = "\u00a0";

  if (mode === "speed") {

    progressEl.textContent =
      `Question ${index} / 10`;

  } else {

    progressEl.textContent =
      `Streak: ${currentStreak}`;
  }

  feedbackEl.textContent = "\u00a0";

  showHighScore();
}


// ===============================
// NUMBER PAD
// ===============================

function enterDigit(d) {

  if (locked) return;

  if (answer.length >= 4) return;

  answer += String(d);

  answerDisplay.textContent = answer;
}


function clearLast() {

  if (locked) return;

  answer =
    answer.slice(0, -1);

  answerDisplay.textContent =
    answer || "\u00a0";
}


function clearAll() {

  if (locked) return;

  answer = "";

  answerDisplay.textContent =
    "\u00a0";
}


// ===============================
// SUBMIT
// ===============================

function submit() {

  if (locked || answer === "") return;

  locked = true;

  const value = Number(answer);

  const isCorrect =
    value === current[1];


  // =============================
  // CORRECT
  // =============================

  if (isCorrect) {

    correct++;

    currentStreak++;

    feedbackEl.textContent =
      "✓ Correct";

    // SPEED MODE
    if (mode === "speed") {

      // Go immediately to next question.
      nextQuestion();

      return;
    }


    // PRACTICE MODE
    // Continue immediately.
    progressEl.textContent =
      `Streak: ${currentStreak}`;

    nextQuestion();

    return;
  }


  // =============================
  // WRONG
  // =============================

  wrong++;

  feedbackEl.textContent =
    `✗ Answer: ${current[1]}`;


  // PRACTICE MODE FAILS IMMEDIATELY
  if (mode === "practice") {

    finishPractice(false);

    return;
  }


  // SPEED TEST
  nextQuestion();
}


// ===============================
// FINISH SPEED TEST
// ===============================

function finishSpeedTest() {

  clearInterval(timerHandle);

  timerHandle = null;

  const totalTime =
    (performance.now() - startedAt) / 1000;


  const successful =
    correct === 10;


  // New high score ONLY if 10/10
  if (successful) {

    if (
      speedHighScore === null ||
      totalTime < speedHighScore
    ) {

      speedHighScore = totalTime;

      localStorage.setItem(
        "mathSpeedHighScore",
        speedHighScore
      );
    }
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


  document.getElementById("resultTitle").textContent =
    successful
      ? "10/10 Complete!"
      : "Test Complete";


  document.getElementById("resultScore").textContent =
    `${correct} / 10`;


  document.getElementById("resultCorrect").textContent =
    correct;


  document.getElementById("resultWrong").textContent =
    wrong;


  document.getElementById("resultTime").textContent =
    totalTime.toFixed(2) + " s";


  document.getElementById("resultAverage").textContent =
    (totalTime / 10).toFixed(2) + " s";


  if (successful && totalTime === speedHighScore) {

    document.getElementById("resultTitle").textContent =
      "🏆 NEW HIGH SCORE!";
  }
}


// ===============================
// FINISH PRACTICE
// ===============================

function finishPractice(success) {

  clearInterval(timerHandle);

  timerHandle = null;


  const totalTime =
    (performance.now() - streakStartTime) / 1000;


  // New practice record only when
  // streak is better than previous record.
  if (currentStreak > practiceHighScore) {

    practiceHighScore =
      currentStreak;

    practiceHighScoreTime =
      totalTime;


    localStorage.setItem(
      "mathPracticeHighScore",
      practiceHighScore
    );


    localStorage.setItem(
      "mathPracticeHighScoreTime",
      practiceHighScoreTime
    );
  }


  game.classList.add("hidden");

  results.classList.remove("hidden");


  document.getElementById("resultTitle").textContent =
    "Practice Failed";


  document.getElementById("resultScore").textContent =
    `${currentStreak} correct in a row`;


  document.getElementById("resultCorrect").textContent =
    currentStreak;


  document.getElementById("resultWrong").textContent =
    1;


  document.getElementById("resultTime").textContent =
    totalTime.toFixed(2) + " s";


  document.getElementById("resultAverage").textContent =
    currentStreak > 0
      ? (totalTime / currentStreak).toFixed(2) + " s"
      : "0.00 s";


  if (currentStreak === practiceHighScore) {

    document.getElementById("resultTitle").textContent =
      "🔥 NEW PRACTICE HIGH SCORE!";
  }
}


// ===============================
// BUTTONS
// ===============================

document
  .getElementById("submitBtn")
  .addEventListener("pointerdown", function(e) {

    e.preventDefault();

    submit();
  });


document
  .querySelectorAll(".key")
  .forEach(btn => {

    btn.addEventListener(
      "pointerdown",
      function(e) {

        e.preventDefault();

        const key =
          btn.dataset.key;


        if (key === "clear") {

          clearLast();

        } else if (key === "clearAll") {

          clearAll();

        } else {

          enterDigit(key);
        }
      }
    );
  });


document
  .getElementById("speedBtn")
  .addEventListener(
    "pointerdown",
    e => {

      e.preventDefault();

      startGame("speed");
    }
  );


document
  .getElementById("practiceBtn")
  .addEventListener(
    "pointerdown",
    e => {

      e.preventDefault();

      startGame("practice");
    }
  );


document
  .getElementById("againBtn")
  .addEventListener(
    "pointerdown",
    e => {

      e.preventDefault();

      startGame(mode);
    }
  );


document
  .getElementById("homeBtn")
  .addEventListener(
    "pointerdown",
    e => {

      e.preventDefault();

      clearInterval(timerHandle);

      timerHandle = null;

      results.classList.add("hidden");

      game.classList.add("hidden");

      home.classList.remove("hidden");
    }
  );


document
  .getElementById("backBtn")
  .addEventListener(
    "pointerdown",
    e => {

      e.preventDefault();

      clearInterval(timerHandle);

      timerHandle = null;

      game.classList.add("hidden");

      home.classList.remove("hidden");
    }
  );


// ===============================
// PHYSICAL KEYBOARD SUPPORT
// ===============================

document.addEventListener(
  "keydown",
  e => {

    if (
      e.key >= "0" &&
      e.key <= "9"
    ) {

      enterDigit(e.key);

    } else if (
      e.key === "Backspace"
    ) {

      clearLast();

    } else if (
      e.key === "Escape"
    ) {

      clearAll();

    } else if (
      e.key === "Enter"
    ) {

      submit();
    }
  }
);
