const QUESTIONS = [];

// Your original question bank
// Subtraction
for (let a = 18; a >= 1; a--) {
  const maxB = Math.min(9, a);
  const minB = Math.max(0, a - 9);
  for (let b = maxB; b >= minB; b--) {
    QUESTIONS.push([`${a}-${b}`, a - b]);
  }
}
QUESTIONS.push(["0-0", 0]);

// Multiplication: 0-12 × 0-12
for (let a = 0; a <= 12; a++) {
  for (let b = 0; b <= 12; b++) {
    QUESTIONS.push([`${a}×${b}`, a * b]);
  }
}

// Addition: 0-9 + 0-9 and the same combinations + 1
for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {
    QUESTIONS.push([`${a}+${b}`, a + b]);
    QUESTIONS.push([`${a}+${b}+1`, a + b + 1]);
  }
}

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
let totalQuestions = 10;

function shuffle(arr) {
  const a = arr.slice();

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
}

function startGame(selectedMode) {
  mode = selectedMode;
  totalQuestions = mode === "speed" ? 10 : QUESTIONS.length;

  pool = shuffle(QUESTIONS);
  current = null;
  answer = "";
  index = 0;
  correct = 0;
  wrong = 0;
  locked = false;

  home.classList.add("hidden");
  results.classList.add("hidden");
  game.classList.remove("hidden");

  startedAt = performance.now();

  timerHandle = setInterval(updateTimer, 50);

  nextQuestion();
}

function updateTimer() {
  if (!startedAt) return;

  timerEl.textContent =
    ((performance.now() - startedAt) / 1000).toFixed(2) + "s";
}

function nextQuestion() {
  if (mode === "speed" && index >= 10) {
    finishGame();
    return;
  }

  if (mode === "practice" && pool.length === 0) {
    finishGame();
    return;
  }

  if (mode === "speed") {
    current = pool[index];
  } else {
    current = pool.shift();
  }

  index++;
  answer = "";
  locked = false;

  questionEl.textContent = current[0].replaceAll("-", "−");

  answerDisplay.textContent = "\u00a0";

  progressEl.textContent =
    mode === "speed"
      ? `Question ${index} / 10`
      : `Practice ${index}`;

  feedbackEl.textContent = "\u00a0";

  updateStats();
}

function updateStats() {
  const attempted = correct + wrong;

  scoreEl.textContent = `Correct: ${correct}`;

  accuracyEl.textContent =
    `Accuracy: ${
      attempted ? Math.round((correct / attempted) * 100) : 0
    }%`;
}

function enterDigit(d) {
  if (locked) return;

  if (answer.length >= 4) return;

  answer += String(d);

  answerDisplay.textContent = answer;
}

function clearLast() {
  if (locked) return;

  answer = answer.slice(0, -1);

  answerDisplay.textContent = answer || "\u00a0";
}

function clearAll() {
  if (locked) return;

  answer = "";

  answerDisplay.textContent = "\u00a0";
}

function submit() {
  if (locked || answer === "") return;

  locked = true;

  const value = Number(answer);
  const isCorrect = value === current[1];

  if (isCorrect) {
    correct++;
    feedbackEl.textContent = "✓ Correct";
  } else {
    wrong++;
    feedbackEl.textContent = `✗ Answer: ${current[1]}`;
  }

  updateStats();

  setTimeout(nextQuestion, 220);
}

function finishGame() {
  clearInterval(timerHandle);

  timerHandle = null;

  const total =
    (performance.now() - startedAt) / 1000;

  const attempted = correct + wrong;

  const average =
    attempted ? total / attempted : 0;

  game.classList.add("hidden");

  results.classList.remove("hidden");

  if (mode === "speed") {
    document.getElementById("resultTitle").textContent =
      "10 Question Test Complete";

    document.getElementById("resultScore").textContent =
      `${correct} / 10`;
  } else {
    document.getElementById("resultTitle").textContent =
      "Practice Complete";

    document.getElementById("resultScore").textContent =
      `${correct} / ${attempted}`;
  }

  document.getElementById("resultCorrect").textContent =
    correct;

  document.getElementById("resultWrong").textContent =
    wrong;

  document.getElementById("resultTime").textContent =
    total.toFixed(2) + " s";

  document.getElementById("resultAverage").textContent =
    average.toFixed(2) + " s";
}

document.querySelectorAll(".key").forEach(btn => {
  btn.addEventListener("click", () => {
    const k = btn.dataset.key;

    if (k === "clear") {
      clearLast();
    } else if (k === "clearAll") {
      clearAll();
    } else {
      enterDigit(k);
    }
  });
});

document
  .getElementById("submitBtn")
  .addEventListener("click", submit);

document
  .getElementById("speedBtn")
  .addEventListener("click", () => startGame("speed"));

document
  .getElementById("practiceBtn")
  .addEventListener("click", () => startGame("practice"));

document
  .getElementById("againBtn")
  .addEventListener("click", () => startGame(mode));

document
  .getElementById("homeBtn")
  .addEventListener("click", () => {
    clearInterval(timerHandle);

    timerHandle = null;

    results.classList.add("hidden");
    game.classList.add("hidden");
    home.classList.remove("hidden");
  });

document
  .getElementById("backBtn")
  .addEventListener("click", () => {
    clearInterval(timerHandle);

    timerHandle = null;

    game.classList.add("hidden");
    home.classList.remove("hidden");
  });

document.addEventListener("keydown", e => {
  if (e.key >= "0" && e.key <= "9") {
    enterDigit(e.key);
  } else if (e.key === "Backspace") {
    clearLast();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "Enter") {
    submit();
  }
});
