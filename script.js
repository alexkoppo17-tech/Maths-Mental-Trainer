// ==========================================
// MATHS MEMORY TRAINER
// FINAL VERSION
// 469 ORIGINAL QUESTIONS + MY QUESTIONS
// ==========================================


// ==========================================
// ORIGINAL 469 QUESTION BANK
// ==========================================

const QUESTIONS = [];


// ------------------------------------------
// SUBTRACTION
// ------------------------------------------

for (let a = 18; a >= 1; a--) {

  const maxB = Math.min(9, a);
  const minB = Math.max(0, a - 9);

  for (let b = maxB; b >= minB; b--) {

    QUESTIONS.push([
      `${a}-${b}`,
      a - b
    ]);

  }
}

QUESTIONS.push(["0-0", 0]);


// ------------------------------------------
// MULTIPLICATION 0-12
// ------------------------------------------

for (let a = 0; a <= 12; a++) {

  for (let b = 0; b <= 12; b++) {

    QUESTIONS.push([
      `${a}×${b}`,
      a * b
    ]);

  }
}


// ------------------------------------------
// ADDITION
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


// SAFETY CHECK
if (QUESTIONS.length !== 469) {

  throw new Error(
    "Question bank error: expected exactly 469 questions."
  );

}


// ==========================================
// CUSTOM QUESTION BANK
// ==========================================

let customQuestions =
  JSON.parse(
    localStorage.getItem("mathCustomQuestions") || "[]"
  );


// ==========================================
// ELEMENTS
// ==========================================

const home =
  document.getElementById("home");

const game =
  document.getElementById("game");

const results =
  document.getElementById("results");

const bankView =
  document.getElementById("bankView");

const questionEl =
  document.getElementById("question");

const answerDisplay =
  document.getElementById("answerDisplay");

const progressEl =
  document.getElementById("progress");

const timerEl =
  document.getElementById("timer");

const bestEl =
  document.getElementById("best");

const feedbackEl =
  document.getElementById("feedback");

const mistakesEl =
  document.getElementById("mistakes");


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
// GAME STATE
// ==========================================

let mode = "speed";

let questionSource = "original";

let pool = [];

let current = null;

let answer = "";

let index = 0;

let correct = 0;

let wrong = 0;

let currentStreak = 0;

let startedAt = 0;

let streakStartedAt = 0;

let timerHandle = null;

let locked = false;

let mistakes = [];


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
// CUSTOM QUESTIONS
// ==========================================

function getCustomQuestions() {

  return customQuestions.map(
    (q, i) => ({

      id: `custom-${i}`,

      text: q.text,

      answer: q.answer

    })
  );

}


function saveCustomQuestions() {

  localStorage.setItem(
    "mathCustomQuestions",
    JSON.stringify(customQuestions)
  );

}


// ==========================================
// SHOW SCREEN
// ==========================================

function showScreen(screen) {

  home.classList.add("hidden");

  game.classList.add("hidden");

  results.classList.add("hidden");

  bankView.classList.add("hidden");

  screen.classList.remove("hidden");

}


// ==========================================
// START GAME
// ==========================================

function startGame(
  selectedMode,
  selectedSource = "original"
) {

  mode = selectedMode;

  questionSource = selectedSource;

  let sourceQuestions;


  if (
    questionSource === "custom"
  ) {

    sourceQuestions =
      getCustomQuestions();

    if (
      sourceQuestions.length === 0
    ) {

      alert(
        "You haven't added any questions to My Questions yet."
      );

      return;

    }

  } else {

    sourceQuestions =
      QUESTIONS.map(
        (q, i) => ({

          id: `original-${i}`,

          text: q[0],

          answer: q[1]

        })
      );

  }


  pool =
    shuffle(sourceQuestions);


  index = 0;

  correct = 0;

  wrong = 0;

  currentStreak = 0;

  mistakes = [];

  answer = "";

  locked = false;


  showScreen(game);


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


  updateBestDisplay();

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

function updateBestDisplay() {

  if (mode === "speed") {

    bestEl.textContent =
      speedBest === null

        ? "🏆 Best 10/10: Not set"

        : `🏆 Best 10/10: ${speedBest.toFixed(2)}s`;

  } else {

    if (practiceBest > 0) {

      bestEl.textContent =
        `🏆 Best streak: ${practiceBest} correct • ${practiceBestTime.toFixed(2)}s`;

    } else {

      bestEl.textContent =
        "🏆 Best streak: Not set";

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


  if (pool.length === 0) {

    if (
      mode === "practice"
    ) {

      pool =
        shuffle(
          questionSource === "custom"
            ? getCustomQuestions()
            : QUESTIONS.map(
                (q, i) => ({
                  id: `original-${i}`,
                  text: q[0],
                  answer: q[1]
                })
              )
        );

    }

  }


  current =
    pool.shift();


  index++;


  answer = "";

  locked = false;


  questionEl.textContent =
    current.text.replaceAll(
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


  updateBestDisplay();

}


// ==========================================
// ENTER NUMBER
// ==========================================

function enterDigit(digit) {

  if (locked) return;


  // Maximum 4 digits.
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
// SUBMIT ANSWER
// ==========================================

function submitAnswer() {

  if (locked) return;

  if (answer === "") return;


  locked = true;


  const entered =
    Number(answer);


  const correctAnswer =
    current.answer;


  if (
    entered === correctAnswer
  ) {

    correct++;

    currentStreak++;


    feedbackEl.textContent =
      "✓ Correct";


    nextQuestion();

    return;

  }


  // ----------------------------------------
  // WRONG ANSWER
  // ----------------------------------------

  wrong++;


  mistakes.push({

    question:
      current.text,

    yourAnswer:
      entered,

    correctAnswer:
      correctAnswer

  });


  feedbackEl.textContent =
    `✗ Correct answer: ${correctAnswer}`;


  // Practice mode ends immediately.
  if (
    mode === "practice"
  ) {

    finishPractice();

    return;

  }


  // Speed mode continues.
  nextQuestion();

}


// ==========================================
// FINISH SPEED MODE
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


  showScreen(results);


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
    "resultTime"
  ).textContent =
    totalTime.toFixed(2) + " s";


  document.getElementById(
    "resultBest"
  ).textContent =

    speedBest === null

      ? "🏆 Best 10/10: Not set"

      : `🏆 Best 10/10: ${speedBest.toFixed(2)} s`;


  displayMistakes();

}


// ==========================================
// FINISH PRACTICE MODE
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

    currentStreak ===
    practiceBest &&

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


  showScreen(results);


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
    "resultTime"
  ).textContent =
    streakTime.toFixed(2) + " s";


  document.getElementById(
    "resultBest"
  ).textContent =

    practiceBest > 0

      ? `🏆 Best streak: ${practiceBest} correct • ${practiceBestTime.toFixed(2)} s`

      : "🏆 Best streak: Not set";


  displayMistakes();

}


// ==========================================
// SHOW WRONG ANSWERS
// ==========================================

function displayMistakes() {

  if (!mistakesEl) return;


  if (
    mistakes.length === 0
  ) {

    mistakesEl.innerHTML =
      "<p>🎯 No mistakes!</p>";

    return;

  }


  let html =

    "<h3>Questions to review</h3>";


  mistakes.forEach(
    (mistake, i) => {

      html += `

        <div class="mistake">

          <strong>
            ${i + 1}. ${mistake.question}
          </strong>

          <br>

          ❌ Your answer:
          ${mistake.yourAnswer}

          <br>

          ✅ Correct answer:
          ${mistake.correctAnswer}

        </div>

      `;

    }
  );


  mistakesEl.innerHTML =
    html;

}


// ==========================================
// QUESTION BANK
// ==========================================

function renderQuestionBank() {

  showScreen(bankView);


  const list =
    document.getElementById(
      "questionList"
    );


  const custom =
    getCustomQuestions();


  document.getElementById(
    "bankCount"
  ).textContent =

    `Original: ${QUESTIONS.length} • My Questions: ${custom.length}`;


  let html = `

    <h3>
      Original 469 Questions
    </h3>

    <div class="question-grid">

  `;


  QUESTIONS.forEach(
    (question, i) => {

      html += `

        <div>

          ${i + 1}.
          ${escapeHtml(question[0])}
          =
          ${question[1]}

        </div>

      `;

    }
  );


  html += `

    </div>

    <h3>
      My Questions (${custom.length})
    </h3>

  `;


  if (
    custom.length === 0
  ) {

    html +=
      "<p>No custom questions yet.</p>";

  } else {

    html +=
      `<div class="question-grid">`;


    custom.forEach(
      (question, i) => {

        html += `

          <div>

            ${i + 1}.
            ${escapeHtml(question.text)}
            =
            ${question.answer}

            <button
              class="tiny danger"
              data-delete="${i}"
            >
              Delete
            </button>

          </div>

        `;

      }
    );


    html +=
      "</div>";

  }


  list.innerHTML =
    html;


  // Delete custom questions.
  list
    .querySelectorAll(
      "[data-delete]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const number =
              Number(
                button.dataset.delete
              );


            customQuestions.splice(
              number,
              1
            );


            saveCustomQuestions();


            renderQuestionBank();

          }
        );

      }
    );

}


// ==========================================
// ADD CUSTOM QUESTION
// ==========================================

function addCustomQuestion() {

  const questionInput =
    document.getElementById(
      "customQuestion"
    );


  const answerInput =
    document.getElementById(
      "customAnswer"
    );


  const question =
    questionInput.value.trim();


  const answerValue =
    answerInput.value.trim();


  if (
    !question ||
    answerValue === ""
  ) {

    alert(
      "Enter both the question and correct answer."
    );

    return;

  }


  const numericAnswer =
    Number(answerValue);


  if (
    !Number.isFinite(
      numericAnswer
    )
  ) {

    alert(
      "The correct answer must be a number."
    );

    return;

  }


  customQuestions.push({

    text:
      question,

    answer:
      numericAnswer

  });


  saveCustomQuestions();


  questionInput.value = "";

  answerInput.value = "";


  renderQuestionBank();

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHtml(value) {

  return String(value)
    .replace(
      /[&<>"']/g,
      character => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

      })[character]
    );

}


// ==========================================
// FAST IPHONE TOUCH BUTTONS
// ==========================================

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

}


// ==========================================
// NUMBER KEYPAD
// ==========================================

document
  .querySelectorAll(".key")
  .forEach(
    button => {

      fastButton(
        button,
        () => {

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
// BUTTONS
// ==========================================

fastButton(
  document.getElementById(
    "submitBtn"
  ),
  submitAnswer
);


fastButton(
  document.getElementById(
    "speedBtn"
  ),
  () => {

    startGame(
      "speed",
      "original"
    );

  }
);


fastButton(
  document.getElementById(
    "practiceBtn"
  ),
  () => {

    startGame(
      "practice",
      "original"
    );

  }
);


fastButton(
  document.getElementById(
    "customSpeedBtn"
  ),
  () => {

    startGame(
      "speed",
      "custom"
    );

  }
);


fastButton(
  document.getElementById(
    "customPracticeBtn"
  ),
  () => {

    startGame(
      "practice",
      "custom"
    );

  }
);


fastButton(
  document.getElementById(
    "bankBtn"
  ),
  renderQuestionBank
);


fastButton(
  document.getElementById(
    "addBtn"
  ),
  addCustomQuestion
);


fastButton(
  document.getElementById(
    "backBankBtn"
  ),
  () => {

    showScreen(home);

  }
);


fastButton(
  document.getElementById(
    "againBtn"
  ),
  () => {

    startGame(
      mode,
      questionSource
    );

  }
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

    showScreen(home);

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

    showScreen(home);

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

      enterDigit(
        event.key
      );

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
