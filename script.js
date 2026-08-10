// ==========================================
// MATHS MEMORY TRAINER
// LEVEL SYSTEM VERSION
//
// LEVEL 1 = ORIGINAL 469 QUESTIONS
// LEVEL 2+ = USER CREATED DECKS
// ==========================================


// ==========================================
// LEVEL 1 — ORIGINAL 469 QUESTIONS
// DO NOT MODIFY
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


// ------------------------------------------
// LEVEL 1 SAFETY CHECK
// ------------------------------------------

if (QUESTIONS.length !== 469) {

  throw new Error(
    "LEVEL 1 ERROR: Original question bank is not exactly 469 questions."
  );

}


// ==========================================
// USER LEVELS
// ==========================================

let userLevels = [];

try {

  userLevels =
    JSON.parse(
      localStorage.getItem("mathLevels") || "[]"
    );

} catch (error) {

  userLevels = [];

}


// ==========================================
// HIGH SCORES
// ==========================================

let levelScores = {};

try {

  levelScores =
    JSON.parse(
      localStorage.getItem("mathLevelScores") || "{}"
    );

} catch (error) {

  levelScores = {};

}


// ==========================================
// GAME STATE
// ==========================================

let mode = "speed";

let currentLevel = 1;

let pool = [];

let current = null;

let answer = "";

let index = 0;

let correct = 0;

let currentStreak = 0;

let startedAt = 0;

let streakStartedAt = 0;

let timerHandle = null;

let locked = false;

let mistakes = [];


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
// SAVE LEVELS
// ==========================================

function saveLevels() {

  localStorage.setItem(
    "mathLevels",
    JSON.stringify(userLevels)
  );

}


function saveScores() {

  localStorage.setItem(
    "mathLevelScores",
    JSON.stringify(levelScores)
  );

}


// ==========================================
// GET LEVEL
// ==========================================

function getLevel(levelNumber) {

  if (levelNumber === 1) {

    return {

      id: 1,

      name: "Level 1 — Original 469",

      reverse: false,

      questions:
        QUESTIONS.map(
          (q, i) => ({

            id:
              `level1-${i}`,

            text:
              q[0],

            answer:
              q[1]

          })
        )

    };

  }


  return userLevels.find(
    level =>
      level.id === levelNumber
  );

}


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
// LEVEL SCORE KEY
// ==========================================

function scoreKey(
  levelNumber,
  scoreMode
) {

  return `${levelNumber}-${scoreMode}`;

}


// ==========================================
// START LEVEL
// ==========================================

function startLevel(
  levelNumber,
  selectedMode
) {

  const level =
    getLevel(levelNumber);


  if (!level) {

    alert(
      "That level does not exist."
    );

    return;

  }


  if (
    !level.questions ||
    level.questions.length === 0
  ) {

    alert(
      "This level has no questions yet."
    );

    return;

  }


  currentLevel =
    levelNumber;

  mode =
    selectedMode;


  pool =
    shuffle(
      level.questions
    );


  index = 0;

  correct = 0;

  currentStreak = 0;

  mistakes = [];

  answer = "";

  locked = false;


  showScreen(game);


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

  const speedKey =
    scoreKey(
      currentLevel,
      "speed"
    );

  const practiceKey =
    scoreKey(
      currentLevel,
      "practice"
    );


  if (
    mode === "speed"
  ) {

    const best =
      levelScores[speedKey];


    bestEl.textContent =

      best == null

        ? "🏆 Best 10/10: Not set"

        : `🏆 Best 10/10: ${Number(best).toFixed(2)}s`;

  } else {

    const best =
      levelScores[practiceKey];


    if (best) {

      bestEl.textContent =
        `🏆 Best streak: ${best.streak} correct • ${Number(best.time).toFixed(2)}s`;

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


  if (
    pool.length === 0
  ) {

    const level =
      getLevel(currentLevel);


    if (
      mode === "practice" &&
      level
    ) {

      pool =
        shuffle(
          level.questions
        );

    }

  }


  current =
    pool.shift();


  index++;


  answer = "";

  locked = false;


  questionEl.textContent =
    String(
      current.text
    ).replaceAll(
      "-",
      "−"
    );


  answerDisplay.textContent =
    "\u00a0";


  if (
    mode === "speed"
  ) {

    progressEl.textContent =
      `Level ${currentLevel} • Question ${index} / 10`;

  } else {

    progressEl.textContent =
      `Level ${currentLevel} • Streak: ${currentStreak}`;

  }


  feedbackEl.textContent =
    "\u00a0";


  updateBestDisplay();

}


// ==========================================
// ENTER DIGIT
// ==========================================

function enterDigit(
  digit
) {

  if (locked) return;


  if (
    answer.length >= 4
  ) return;


  const level =
    getLevel(currentLevel);


  // LEVEL 1 stays normal.
  //
  // Level 2+ can use reverse entry.
  if (
    level &&
    level.reverse
  ) {

    answer =
      String(digit) +
      answer;

  } else {

    answer +=
      String(digit);

  }


  answerDisplay.textContent =
    answer;

}


// ==========================================
// DELETE LAST DIGIT
// ==========================================

function clearLast() {

  if (locked) return;


  const level =
    getLevel(currentLevel);


  if (
    level &&
    level.reverse
  ) {

    // Reverse mode:
    // remove the first digit because
    // that was the most recently entered.
    answer =
      answer.slice(1);

  } else {

    answer =
      answer.slice(0, -1);

  }


  answerDisplay.textContent =
    answer || "\u00a0";

}


// ==========================================
// CLEAR ALL
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

  if (
    answer === ""
  ) return;


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


  // WRONG ANSWER

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


  if (
    mode === "practice"
  ) {

    finishPractice();

    return;

  }


  nextQuestion();

}


// ==========================================
// FINISH SPEED MODE
// ==========================================

function finishSpeed() {

  clearInterval(
    timerHandle
  );

  timerHandle = null;


  const totalTime =
    (
      performance.now() -
      startedAt
    ) / 1000;


  const perfect =
    correct === 10;


  const key =
    scoreKey(
      currentLevel,
      "speed"
    );


  let newRecord =
    false;


  if (perfect) {

    const oldBest =
      levelScores[key];


    if (
      oldBest == null ||
      totalTime < Number(oldBest)
    ) {

      levelScores[key] =
        totalTime;


      saveScores();

      newRecord =
        true;

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
    `${totalTime.toFixed(2)} s`;


  const best =
    levelScores[key];


  document.getElementById(
    "resultBest"
  ).textContent =

    best == null

      ? "🏆 Best 10/10: Not set"

      : `🏆 Level ${currentLevel} Best: ${Number(best).toFixed(2)} s`;


  displayMistakes();

}


// ==========================================
// FINISH PRACTICE
// ==========================================

function finishPractice() {

  clearInterval(
    timerHandle
  );

  timerHandle = null;


  const streakTime =
    (
      performance.now() -
      streakStartedAt
    ) / 1000;


  const key =
    scoreKey(
      currentLevel,
      "practice"
    );


  const oldBest =
    levelScores[key];


  let newRecord =
    false;


  if (
    !oldBest ||
    currentStreak >
      Number(oldBest.streak) ||
    (
      currentStreak ===
        Number(oldBest.streak) &&
      streakTime <
        Number(oldBest.time)
    )
  ) {

    levelScores[key] = {

      streak:
        currentStreak,

      time:
        streakTime

    };


    saveScores();

    newRecord =
      true;

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
    `${streakTime.toFixed(2)} s`;


  const best =
    levelScores[key];


  document.getElementById(
    "resultBest"
  ).textContent =

    best

      ? `🏆 Level ${currentLevel} Best: ${best.streak} correct • ${Number(best.time).toFixed(2)} s`

      : "🏆 Best streak: Not set";


  displayMistakes();

}


// ==========================================
// WRONG ANSWERS
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
            ${i + 1}. ${escapeHtml(mistake.question)}
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
// LEVEL MANAGER
// ==========================================

function renderLevelManager() {

  showScreen(bankView);


  bankView.innerHTML = `

    <button
      id="levelHomeButton"
      class="back"
    >
      ← Home
    </button>

    <h2>📚 Levels</h2>

    <p>
      Level 1 is protected.
      Create separate decks for Level 2+
    </p>

    <div id="levelList"></div>

    <div class="add-card">

      <h3>➕ Create New Level</h3>

      <input
        id="newLevelName"
        placeholder="Example: Level 2 — Addition"
      >

      <p>
        Entry direction
      </p>

      <select
        id="newLevelReverse"
        style="
          width:100%;
          height:52px;
          border-radius:12px;
          padding:0 10px;
          font-size:18px;
          margin-bottom:10px;
        "
      >

        <option value="false">
          Normal Entry — left to right
        </option>

        <option value="true">
          Reverse Entry — last digit first
        </option>

      </select>

      <button
        id="createLevelButton"
        class="submit small-submit"
      >
        CREATE LEVEL
      </button>

    </div>

  `;


  document
    .getElementById(
      "levelHomeButton"
    )
    .addEventListener(
      "click",
      () => showScreen(home)
    );


  document
    .getElementById(
      "createLevelButton"
    )
    .addEventListener(
      "click",
      createLevel
    );


  renderLevels();

}


// ==========================================
// RENDER LEVELS
// ==========================================

function renderLevels() {

  const list =
    document.getElementById(
      "levelList"
    );


  if (!list) return;


  let html = `

    <div class="add-card">

      <h3>
        🔒 Level 1 — Original 469
      </h3>

      <p>
        Protected original question bank.
      </p>

      <button
        id="level1Speed"
        class="primary"
      >
        ⚡ Level 1 — 10 Questions
      </button>

      <button
        id="level1Practice"
        class="primary"
      >
        🎯 Level 1 — Practice
      </button>

      <button
        id="viewLevel1"
        class="secondary"
      >
        👁 View Level 1 Questions
      </button>

    </div>

  `;


  if (
    userLevels.length === 0
  ) {

    html += `

      <div class="add-card">

        <strong>
          No new levels yet.
        </strong>

        <p>
          Create Level 2 below.
        </p>

      </div>

    `;

  }


  userLevels.forEach(
    level => {

      const speed =
        levelScores[
          scoreKey(
            level.id,
            "speed"
          )
        ];


      const practice =
        levelScores[
          scoreKey(
            level.id,
            "practice"
          )
        ];


      html += `

        <div class="add-card">

          <h3>
            ${escapeHtml(level.name)}
          </h3>

          <p>
            ${level.questions.length}
            questions
            •
            ${
              level.reverse
                ? "🔄 Reverse Entry"
                : "Normal Entry"
            }
          </p>

          <p>
            ${
              speed == null
                ? "⚡ Best 10/10: Not set"
                : `⚡ Best 10/10: ${Number(speed).toFixed(2)}s`
            }
          </p>

          <p>
            ${
              practice
                ? `🎯 Best streak: ${practice.streak} • ${Number(practice.time).toFixed(2)}s`
                : "🎯 Best streak: Not set"
            }
          </p>

          <button
            class="primary level-speed"
            data-level="${level.id}"
          >
            ⚡ 10 Question Mode
          </button>

          <button
            class="primary level-practice"
            data-level="${level.id}"
          >
            🎯 Practice Mode
          </button>

          <button
            class="secondary level-import"
            data-level="${level.id}"
          >
            📋 Paste / Replace Deck
          </button>

          <button
            class="secondary level-view"
            data-level="${level.id}"
          >
            👁 View Questions
          </button>

          <button
            class="secondary level-settings"
            data-level="${level.id}"
          >
            ⚙️ Level Settings
          </button>

        </div>

      `;

    }
  );


  list.innerHTML =
    html;


  // Level 1

  document
    .getElementById(
      "level1Speed"
    )
    .addEventListener(
      "click",
      () =>
        startLevel(
          1,
          "speed"
        )
    );


  document
    .getElementById(
      "level1Practice"
    )
    .addEventListener(
      "click",
      () =>
        startLevel(
          1,
          "practice"
        )
    );


  document
    .getElementById(
      "viewLevel1"
    )
    .addEventListener(
      "click",
      () =>
        viewLevelQuestions(
          1
        )
    );


  // User levels

  list
    .querySelectorAll(
      ".level-speed"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            startLevel(
              Number(
                button.dataset.level
              ),
              "speed"
            );

          }
        );

      }
    );


  list
    .querySelectorAll(
      ".level-practice"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            startLevel(
              Number(
                button.dataset.level
              ),
              "practice"
            );

          }
        );

      }
    );


  list
    .querySelectorAll(
      ".level-import"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            importDeck(
              Number(
                button.dataset.level
              )
            );

          }
        );

      }
    );


  list
    .querySelectorAll(
      ".level-view"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            viewLevelQuestions(
              Number(
                button.dataset.level
              )
            );

          }
        );

      }
    );


  list
    .querySelectorAll(
      ".level-settings"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            levelSettings(
              Number(
                button.dataset.level
              )
            );

          }
        );

      }
    );

}


// ==========================================
// CREATE LEVEL
// ==========================================

function createLevel() {

  const nameInput =
    document.getElementById(
      "newLevelName"
    );


  const reverseInput =
    document.getElementById(
      "newLevelReverse"
    );


  const name =
    nameInput.value.trim();


  if (!name) {

    alert(
      "Give the level a name first."
    );

    return;

  }


  const nextId =
    userLevels.length === 0

      ? 2

      : Math.max(
          ...userLevels.map(
            level =>
              Number(level.id)
          )
        ) + 1;


  const newLevel = {

    id:
      nextId,

    name:
      name,

    reverse:
      reverseInput.value === "true",

    questions:
      []

  };


  userLevels.push(
    newLevel
  );


  saveLevels();


  alert(
    `${name} created. Now paste your question deck into it.`
  );


  renderLevelManager();


  setTimeout(
    () => {

      importDeck(
        nextId
      );

    },
    50
  );

}


// ==========================================
// IMPORT WHOLE DECK
// ==========================================

function importDeck(
  levelNumber
) {

  const level =
    getLevel(levelNumber);


  if (!level) return;


  const instructions = `

Paste your entire question deck below.

One question per line.

Accepted examples:

169+345=514
25-7=18
12×8=96

You can also use:

169 + 345 = 514
25 - 7 = 18
12 x 8 = 96

This will REPLACE the current questions
in ${level.name}.

  `;


  const pasted =
    prompt(
      instructions,
      ""
    );


  if (
    pasted === null
  ) return;


  const lines =
    pasted
      .split(/\r?\n/)
      .map(
        line =>
          line.trim()
      )
      .filter(
        line =>
          line.length > 0
      );


  const imported = [];


  for (
    const line of lines
  ) {

    const parsed =
      parseQuestionLine(
        line
      );


    if (parsed) {

      imported.push({

        id:
          `level-${levelNumber}-${Date.now()}-${imported.length}`,

        text:
          parsed.text,

        answer:
          parsed.answer

      });

    }

  }


  if (
    imported.length === 0
  ) {

    alert(
      "I couldn't find any valid questions. Use this format: 169+345=514"
    );

    return;

  }


  const invalid =
    lines.length -
    imported.length;


  level.questions =
    imported;


  saveLevels();


  let message =
    `Imported ${imported.length} questions into ${level.name}.`;


  if (invalid > 0) {

    message +=
      `\n\n${invalid} lines were skipped because they were not in a recognised format.`;

  }


  alert(
    message
  );


  renderLevelManager();

}


// ==========================================
// PARSE QUESTION
// ==========================================

function parseQuestionLine(
  line
) {

  let cleaned =
    line.trim();


  // Remove leading numbering.
  cleaned =
    cleaned.replace(
      /^\d+[\).\s]+/,
      ""
    );


  // Remove commas from answers.
  cleaned =
    cleaned.replaceAll(
      ",",
      ""
    );


  // Look for = answer.
  const equals =
    cleaned.match(
      /^(.+?)\s*=\s*(-?\d+(?:\.\d+)?)$/
    );


  if (equals) {

    const text =
      equals[1].trim();

    const answerValue =
      Number(
        equals[2]
      );


    if (
      text &&
      Number.isFinite(
        answerValue
      )
    ) {

      return {

        text:
          text,

        answer:
          answerValue

      };

    }

  }


  // Also accept "question : answer".
  const colon =
    cleaned.match(
      /^(.+?)\s*:\s*(-?\d+(?:\.\d+)?)$/
    );


  if (colon) {

    const text =
      colon[1].trim();

    const answerValue =
      Number(
        colon[2]
      );


    if (
      text &&
      Number.isFinite(
        answerValue
      )
    ) {

      return {

        text:
          text,

        answer:
          answerValue

      };

    }

  }


  return null;

}


// ==========================================
// VIEW QUESTIONS
// ==========================================

function viewLevelQuestions(
  levelNumber
) {

  const level =
    getLevel(levelNumber);


  if (!level) return;


  showScreen(bankView);


  let html = `

    <button
      id="questionBack"
      class="back"
    >
      ← Levels
    </button>

    <h2>
      ${escapeHtml(level.name)}
    </h2>

    <p>
      ${
        levelNumber === 1
          ? "🔒 Protected original deck"
          : level.reverse
            ? "🔄 Reverse Entry"
            : "Normal Entry"
      }
    </p>

    <p>
      ${level.questions.length} questions
    </p>

    <div class="question-grid">

  `;


  level.questions.forEach(
    (question, i) => {

      html += `

        <div>

          ${i + 1}.
          ${escapeHtml(question.text)}
          =
          ${question.answer}

        </div>

      `;

    }
  );


  html +=
    "</div>";


  bankView.innerHTML =
    html;


  document
    .getElementById(
      "questionBack"
    )
    .addEventListener(
      "click",
      renderLevelManager
    );

}


// ==========================================
// LEVEL SETTINGS
// ==========================================

function levelSettings(
  levelNumber
) {

  const level =
    getLevel(levelNumber);


  if (
    !level ||
    levelNumber === 1
  ) {

    alert(
      "Level 1 is protected and cannot be changed."
    );

    return;

  }


  const reverse =
    confirm(
      `Entry direction for ${level.name}:

OK = Reverse Entry (last digit first)
Cancel = Normal Entry`
    );


  level.reverse =
    reverse;


  saveLevels();


  alert(
    reverse
      ? "Reverse Entry enabled."
      : "Normal Entry enabled."
  );


  renderLevelManager();

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHtml(
  value
) {

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
// FAST TOUCH INPUT
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
// KEYPAD
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

            enterDigit(
              key
            );

          }

        }
      );

    }
  );


// ==========================================
// HOME BUTTONS
// ==========================================

// Level 1 buttons remain exactly
// where they already are.

fastButton(
  document.getElementById(
    "speedBtn"
  ),
  () =>
    startLevel(
      1,
      "speed"
    )
);


fastButton(
  document.getElementById(
    "practiceBtn"
  ),
  () =>
    startLevel(
      1,
      "practice"
    )
);


// The old "My Questions" buttons now
// open the separate level system.

fastButton(
  document.getElementById(
    "customSpeedBtn"
  ),
  renderLevelManager
);


fastButton(
  document.getElementById(
    "customPracticeBtn"
  ),
  renderLevelManager
);


fastButton(
  document.getElementById(
    "bankBtn"
  ),
  renderLevelManager
);


// ==========================================
// GAME BUTTONS
// ==========================================

fastButton(
  document.getElementById(
    "submitBtn"
  ),
  submitAnswer
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


fastButton(
  document.getElementById(
    "againBtn"
  ),
  () =>
    startLevel(
      currentLevel,
      mode
    )
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
