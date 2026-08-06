// ==========================================
// MATHS MEMORY TRAINER
// iPHONE FAST TOUCH + WRONG ANSWER REVIEW
// ==========================================


// ==========================================
// QUESTION BANK
// ==========================================

const QUESTIONS = [];

// SUBTRACTION
// Same set/order as your original app.
for (let a = 18; a >= 0; a--) {
  const highestB = Math.min(9, a);

  for (let b = highestB; b >= 0; b--) {
    QUESTIONS.push([`${a}-${b}`, a - b]);
  }
}


// MULTIPLICATION 0-12
for (let a = 0; a <= 12; a++) {
  for (let b = 0; b <= 12; b++) {
    QUESTIONS.push([`${a}×${b}`, a * b]);
  }
}


// ADDITION
// Original questions plus the +1 versions.
for (let a = 0; a <= 9; a++) {
  for (let b = 0; b <= 9; b++) {
    QUESTIONS.push([`${a}+${b}`, a + b]);
    QUESTIONS.push([`${a}+${b}+1`, a + b + 1]);
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

// NEW: records wrong answers during the round
let mistakes = [];


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

  mode = selectedMode;

  pool = shuffle(QUESTIONS);

  current = null;

  answer = "";

  index = 0;

  correct = 0;

  wrong = 0;

  currentStreak = 0;

  mistakes = [];

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

  updateHighScoreDisplay();
}


// ==========================================
// ENTER NUMBER
// ==========================================

function enterDigit(digit) {

  if (locked) return;

  // Your app allows a maximum of 4 digits.
  if (answer.length >= 4) return;

  answer += String(digit);

  answerDisplay.textContent =
    answer;
}


// ==========================================
// DELETE LAST NUMBER
// ==========================================

function clearLast() {

  if (locked) return;

  answer =
    answer.slice(0, -1);

  answerDisplay.textContent =
    answer || "\u00a0";
}


// ==========================================
// CLEAR ANSWER
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


  // ========================================
  // WRONG ANSWER
  // ========================================

  wrong++;

  mistakes.push({
    question: current[0],
    yourAnswer: entered,
    correctAnswer: correctAnswer
  });


  feedbackEl.textContent =
    `✗ Answer: ${correctAnswer}`;


  if (mode === "practice") {

    finishPractice();

    return;
  }


  nextQuestion();
}


// ==========================================
// SHOW WRONG ANSWERS
// ==========================================

function displayMistakes() {

  let box =
    document.getElementById(
      "mistakesDisplay"
    );


  if (!box) {

    box =
      document.createElement("div");

    box.id =
      "mistakesDisplay";

    box.style.marginTop =
      "20px";

    box.style.textAlign =
      "left";

    box.style.width =
      "100%";

    box.style.boxSizing =
      "border-box";

    const resultCard =
      document.querySelector(
        ".result-card"
      );

    if (resultCard) {

      resultCard.appendChild(box);

    } else {

      results.appendChild(box);
    }
  }


  if (mistakes.length === 0) {

    box.innerHTML = `
      <div style="
        text-align:center;
        font-size:20px;
        font-weight:800;
        margin-top:20px;
      ">
        🎯 No mistakes!
      </div>
    `;

    return;
  }


  let html = `
    <div style="
      font-size:21px;
      font-weight:800;
      margin-bottom:12px;
      text-align:center;
    ">
      ❌ Questions to review
    </div>
  `;


  mistakes.forEach(
    (mistake, i) => {

      html += `
        <div style="
          padding:12px;
          margin-bottom:8px;
          border-radius:10px;
          background:rgba(255,0,0,0.08);
        ">
          <strong>${i + 1}. ${mistake.question}</strong><br>
          ❌ Your answer: ${mistake.yourAnswer}<br>
          ✅ Correct answer: ${mistake.correctAnswer}
        </div>
      `;
    }
  );


  box.innerHTML = html;
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
    (
      totalTime / 10
    ).toFixed(2) + " s";


  showBestResult(
    speedBest !== null
      ? `🏆 Best 10/10 time: ${speedBest.toFixed(2)} s`
      : "🏆 Best 10/10 time: Not set"
  );


  // NEW: show every mistake
  displayMistakes();
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


  // NEW: show the question you got wrong
  displayMistakes();
}


// ==========================================
// HIGH SCORE ON RESULTS SCREEN
// ==========================================

function showBestResult(text) {

  const resultCard =
    document.querySelector(
      ".result-card"
    );

  if (!resultCard) return;


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
// 📱 EXTRA-RELIABLE IPHONE TOUCH HANDLING
// ==========================================
//
// Touchstart = immediate response.
// Click = backup if touchstart doesn't fire.
// The duplicate guard prevents one physical
// touch from entering two numbers.
//

function fastButton(
  element,
  action
) {

  if (!element) return;


  let touchHandled =
    false;


  // Make Safari treat this as a touch
  // control rather than a normal link/button.
  element.style.touchAction =
    "manipulation";

  element.style.webkitTapHighlightColor =
    "transparent";

  element.style.userSelect =
    "none";

  element.style.webkitUserSelect =
    "none";


  // ========================================
  // FIRST LINE OF DEFENCE
  // ========================================

  element.addEventListener(
    "touchstart",
    function(event) {

      event.preventDefault();

      if (touchHandled)
        return;

      touchHandled = true;

      action();

    },
    {
      passive: false
    }
  );


  // ========================================
  // RESET TOUCH STATE
  // ========================================

  element.addEventListener(
    "touchend",
    function(event) {

      event.preventDefault();

      // Keep the flag alive briefly so Safari's
      // synthetic click doesn't double-trigger.
      setTimeout(
        function() {

          touchHandled = false;

        },
        80
      );

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "touchcancel",
    function() {

      touchHandled = false;

    }
  );


  // ========================================
  // BACKUP CLICK
  // ========================================

  element.addEventListener(
    "click",
    function(event) {

      event.preventDefault();

      if (touchHandled)
        return;

      action();

    },
    {
      passive: false
    }
  );
}


// ==========================================
// KEYPAD BUTTONS
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
// SUBMIT BUTTON
// ==========================================

fastButton(
  document.getElementById(
    "submitBtn"
  ),
  submitAnswer
);


// ==========================================
// SPEED MODE
// ==========================================

fastButton(
  document.getElementById(
    "speedBtn"
  ),
  function() {

    startGame("speed");

  }
);


// ==========================================
// PRACTICE MODE
// ==========================================

fastButton(
  document.getElementById(
    "practiceBtn"
  ),
  function() {

    startGame("practice");

  }
);


// ==========================================
// PLAY AGAIN
// ==========================================

fastButton(
  document.getElementById(
    "againBtn"
  ),
  function() {

    startGame(mode);

  }
);


// ==========================================
// HOME BUTTON
// ==========================================

fastButton(
  document.getElementById(
    "homeBtn"
  ),
  function() {

    clearInterval(timerHandle);

    timerHandle = null;

    results.classList.add("hidden");

    game.classList.add("hidden");

    home.classList.remove("hidden");

  }
);


// ==========================================
// BACK BUTTON
// ==========================================

fastButton(
  document.getElementById(
    "backBtn"
  ),
  function() {

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
  function(event) {

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
