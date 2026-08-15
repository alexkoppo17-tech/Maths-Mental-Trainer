// ==========================================
// MATHS MEMORY TRAINER
// LEVEL SYSTEM + REVERSE ENTRY
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


QUESTIONS.push([
  "0-0",
  0
]);


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


// ==========================================
// LEVEL 1 SAFETY CHECK
// ==========================================

if (QUESTIONS.length !== 469) {

  throw new Error(
    "LEVEL 1 ERROR: Original question bank is not exactly 469 questions."
  );

}
// ==========================================
// LEVEL 2 — AUTOMATIC MATHS BANK
// DO NOT TOUCH LEVEL 1
// ==========================================

const LEVEL2_QUESTIONS = [];


// ------------------------------------------
// 2 DIGIT + 2 DIGIT
// ------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 10; b <= 99; b++) {

    LEVEL2_QUESTIONS.push({

      id: `level2-add2-${a}-${b}`,

      text: `${a}+${b}`,

      answer: a + b

    });

  }

}


// ------------------------------------------
// 2 DIGIT + 1 DIGIT
// ------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id: `level2-add1-${a}-${b}`,

      text: `${a}+${b}`,

      answer: a + b

    });

  }

}


// ------------------------------------------
// 2 DIGIT - 2 DIGIT
// POSITIVE ANSWERS ONLY
// ------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 10; b < a; b++) {

    LEVEL2_QUESTIONS.push({

      id: `level2-sub2-${a}-${b}`,

      text: `${a}-${b}`,

      answer: a - b

    });

  }

}


// ------------------------------------------
// 2 DIGIT - 1 DIGIT
// ------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id: `level2-sub1-${a}-${b}`,

      text: `${a}-${b}`,

      answer: a - b

    });

  }

}


// ------------------------------------------
// 2 DIGIT × 1 DIGIT
// ------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id: `level2-mult-${a}-${b}`,

      text: `${a}×${b}`,

      answer: a * b

    });

  }

}


// ------------------------------------------
// LEVEL 2 SAFETY CHECK
// ------------------------------------------

if (LEVEL2_QUESTIONS.length !== 14805) {

  throw new Error(
    `LEVEL 2 ERROR: Expected 14805 questions but generated ${LEVEL2_QUESTIONS.length}.`
  );

}

// ==========================================
// USER LEVELS
// ==========================================

let userLevels = [];

try {

  userLevels =
    JSON.parse(
      localStorage.getItem(
        "mathLevels"
      ) || "[]"
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
      localStorage.getItem(
        "mathLevelScores"
      ) || "{}"
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

let mixedMode = false;


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


// ==========================================
// SAVE SCORES
// ==========================================

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

  // ========================================
  // LEVEL 1 — ORIGINAL 469
  // ========================================

  if (Number(levelNumber) === 1) {

    return {

      id: 1,

      name: "Level 1",

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


  // ========================================
  // LEVEL 2 — AUTOMATIC BANK
  // ========================================

  if (Number(levelNumber) === 2) {

    return {

      id: 2,

      name: "Level 2",

      reverse: true,

      questions:
        LEVEL2_QUESTIONS

    };

  }


  // ========================================
  // LEVEL 3+
  // USER CREATED LEVELS
  // ========================================

  return userLevels.find(
    level =>
      Number(level.id) ===
      Number(levelNumber)
  );

}

// ==========================================
// GET ALL QUESTIONS FOR MIXED
// ==========================================

function getAllQuestions() {

  let all = [];


  const level1 =
    getLevel(1);


  all =
    all.concat(
      level1.questions
    );


  userLevels.forEach(
    level => {

      all =
        all.concat(
          level.questions
        );

    }
  );


  return all;

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
// SCREEN CONTROL
// ==========================================

function showScreen(screen) {

  home.classList.add("hidden");

  game.classList.add("hidden");

  results.classList.add("hidden");

  bankView.classList.add("hidden");

  screen.classList.remove("hidden");

}


// ==========================================
// SCORE KEY
// ==========================================

function scoreKey(
  levelNumber,
  scoreMode
) {

  if (
    levelNumber === "mixed"
  ) {

    return `mixed-${scoreMode}`;

  }


  return `${levelNumber}-${scoreMode}`;

}


// ==========================================
// LEVEL NAME
// ==========================================

function getLevelName(levelNumber) {

  if (
    levelNumber === "mixed"
  ) {

    return "Mixed";

  }


  const level =
    getLevel(levelNumber);


  return level
    ? level.name
    : `Level ${levelNumber}`;

}


// ==========================================
// START LEVEL
// ==========================================

function startLevel(
  levelNumber,
  selectedMode
) {

  let questions = [];


  if (
    levelNumber === "mixed"
  ) {

    questions =
      getAllQuestions();

    mixedMode = true;

  } else {

    const level =
      getLevel(levelNumber);


    if (!level) {

      alert(
        "That level does not exist."
      );

      return;

    }


    questions =
      level.questions;

    mixedMode = false;

  }


  if (
    !questions ||
    questions.length === 0
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
      questions
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
    elapsed.toFixed(2) +
    "s";

}


// ==========================================
// BEST DISPLAY
// ==========================================

function updateBestDisplay() {

  const key =
    scoreKey(
      currentLevel,
      mode
    );


  const best =
    levelScores[key];


  if (
    mode === "speed"
  ) {

    bestEl.textContent =

      best == null

        ? "🏆 Best 10/10: Not set"

        : `🏆 Best 10/10: ${Number(best).toFixed(2)}s`;

  } else {

    bestEl.textContent =

      best

        ? `🏆 Best streak: ${best.streak} correct • ${Number(best.time).toFixed(2)}s`

        : "🏆 Best streak: Not set";

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

    let refill = [];


    if (
      mixedMode
    ) {

      refill =
        getAllQuestions();

    } else {

      const level =
        getLevel(
          currentLevel
        );


      if (level) {

        refill =
          level.questions;

      }

    }


    pool =
      shuffle(
        refill
      );

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
      `${getLevelName(currentLevel)} • Question ${index} / 10`;

  } else {

    progressEl.textContent =
      `${getLevelName(currentLevel)} • Streak: ${currentStreak}`;

  }


  feedbackEl.textContent =
    "\u00a0";


  updateBestDisplay();

}


// ==========================================
// ENTER DIGIT
// ==========================================

function enterDigit(digit) {

  if (locked) return;


  if (
    answer.length >= 4
  ) return;


  let reverse = false;


  // ----------------------------------------
  // LEVEL 1 IS ALWAYS NORMAL
  // ----------------------------------------

  if (
    currentLevel !== 1 &&
    currentLevel !== "mixed"
  ) {

    const level =
      getLevel(
        currentLevel
      );


    if (level) {

      reverse =
        level.reverse === true;

    }

  }


  // ----------------------------------------
  // REVERSE ENTRY
  //
  // Example:
  //
  // Correct answer = 514
  //
  // Tap 4 → 4
  // Tap 1 → 14
  // Tap 5 → 514
  // ----------------------------------------

  if (reverse) {

    answer =
      String(digit) +
      answer;

  } else {

    // Normal Level 1 entry:
    //
    // 5 → 51 → 514

    answer +=
      String(digit);

  }


  answerDisplay.textContent =
    answer ||
    "\u00a0";

}


// ==========================================
// CLEAR LAST
// ==========================================

function clearLast() {

  if (locked) return;


  let reverse = false;


  if (
    currentLevel !== 1 &&
    currentLevel !== "mixed"
  ) {

    const level =
      getLevel(
        currentLevel
      );


    if (level) {

      reverse =
        level.reverse === true;

    }

  }


  if (reverse) {

    // Reverse entry:
    //
    // 514 → delete 5 → 14

    answer =
      answer.slice(1);

  } else {

    // Normal entry:
    //
    // 514 → delete 4 → 51

    answer =
      answer.slice(
        0,
        -1
      );

  }


  answerDisplay.textContent =
    answer ||
    "\u00a0";

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
// FINISH SPEED
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


  let newRecord = false;


  if (perfect) {

    const oldBest =
      levelScores[key];


    if (
      oldBest == null ||
      totalTime <
        Number(oldBest)
    ) {

      levelScores[key] =
        totalTime;


      saveScores();

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
    `${totalTime.toFixed(2)} s`;


  const best =
    levelScores[key];


  document.getElementById(
    "resultBest"
  ).textContent =

    best == null

      ? "🏆 Best 10/10: Not set"

      : `🏆 ${getLevelName(currentLevel)} Best: ${Number(best).toFixed(2)} s`;


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


  let newRecord = false;


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

    newRecord = true;

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

      ? `🏆 ${getLevelName(currentLevel)} Best: ${best.streak} correct • ${Number(best.time).toFixed(2)} s`

      : "🏆 Best streak: Not set";


  displayMistakes();

}


// ==========================================
// MISTAKES
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
// HOME SCREEN
// ==========================================

function renderHome() {

  showScreen(home);


  home.innerHTML = `

    <h1>Maths Memory Trainer</h1>

    <p class="subtitle">
      Choose a level
    </p>

    <div id="levelHomeList"></div>

  `;


  const list =
    document.getElementById(
      "levelHomeList"
    );


  // ----------------------------------------
  // LEVEL 1
  // ----------------------------------------

  const level1Button =
    document.createElement(
      "button"
    );


  level1Button.className =
    "primary";


  level1Button.textContent =
    "LEVEL 1";


  fastButton(
    level1Button,
    () =>
      showLevelMenu(1)
  );


  list.appendChild(
    level1Button
  );


  // ----------------------------------------
  // LEVEL 2+
  // ----------------------------------------

  userLevels.forEach(
    level => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "primary";


      button.textContent =
        `LEVEL ${level.id}`;


      fastButton(
        button,
        () =>
          showLevelMenu(
            level.id
          )
      );


      list.appendChild(
        button
      );

    }
  );


  // ----------------------------------------
  // CREATE NEW LEVEL
  // ----------------------------------------

  const createButton =
    document.createElement(
      "button"
    );


  createButton.className =
    "secondary";


  createButton.textContent =
    "➕ CREATE NEW LEVEL";


  fastButton(
    createButton,
    createNewLevel
  );


  list.appendChild(
    createButton
  );


  // ----------------------------------------
  // MIXED AT THE BOTTOM
  // ----------------------------------------

  const mixedButton =
    document.createElement(
      "button"
    );


  mixedButton.className =
    "secondary";


  mixedButton.textContent =
    "🔀 MIXED";


  fastButton(
    mixedButton,
    () =>
      showLevelMenu(
        "mixed"
      )
  );


  list.appendChild(
    mixedButton
  );

}


// ==========================================
// LEVEL MENU
// ==========================================

function showLevelMenu(
  levelNumber
) {

  const levelName =
    getLevelName(
      levelNumber
    );


  showScreen(bankView);


  let extra = "";


  if (
    levelNumber === "mixed"
  ) {

    extra = `

      <p>
        All levels combined
      </p>

    `;

  } else {

    const level =
      getLevel(
        levelNumber
      );


    extra = `

      <p>

        ${
          levelNumber === 1

            ? "🔒 Original 469 questions"

            : `${level.questions.length} questions`

        }

      </p>


      ${
        levelNumber !== 1

          ? `

            <p>

              ${
                level.reverse

                  ? "🔄 Reverse Entry enabled"

                  : "Normal Entry"

              }

            </p>

          `

          : ""

      }

    `;

  }


  bankView.innerHTML = `

    <button
      id="levelMenuBack"
      class="back"
    >
      ← Levels
    </button>


    <h2>
      ${escapeHtml(levelName)}
    </h2>


    ${extra}


    <button
      id="levelMenuSpeed"
      class="primary"
    >
      ⚡ 10 Questions
    </button>


    <button
      id="levelMenuPractice"
      class="primary"
    >
      🎯 Practice Mode
    </button>


    <button
      id="levelMenuQuestions"
      class="secondary"
    >
      📋 View Questions
    </button>


    ${
      levelNumber !== 1 &&
      levelNumber !== "mixed"

        ? `

          <button
            id="levelMenuAdd"
            class="secondary"
          >
            ➕ Add / Replace Questions
          </button>


          <button
            id="levelMenuSettings"
            class="secondary"
          >
            ⚙️ Level Settings
          </button>

        `

        : ""
    }

  `;


  fastButton(
    document.getElementById(
      "levelMenuBack"
    ),
    renderHome
  );


  fastButton(
    document.getElementById(
      "levelMenuSpeed"
    ),
    () =>
      startLevel(
        levelNumber,
        "speed"
      )
  );


  fastButton(
    document.getElementById(
      "levelMenuPractice"
    ),
    () =>
      startLevel(
        levelNumber,
        "practice"
      )
  );


  fastButton(
    document.getElementById(
      "levelMenuQuestions"
    ),
    () =>
      viewLevelQuestions(
        levelNumber
      )
  );


  if (
    levelNumber !== 1 &&
    levelNumber !== "mixed"
  ) {

    fastButton(
      document.getElementById(
        "levelMenuAdd"
      ),
      () =>
        importDeck(
          levelNumber
        )
    );


    fastButton(
      document.getElementById(
        "levelMenuSettings"
      ),
      () =>
        levelSettings(
          levelNumber
        )
    );

  }

}


// ==========================================
// CREATE NEW LEVEL
// ==========================================

function createNewLevel() {

  const nextId =

    userLevels.length === 0

      ? 2

      : Math.max(
          ...userLevels.map(
            level =>
              Number(level.id)
          )
        ) + 1;


  const name =
    prompt(
      `Name Level ${nextId}:`,
      `Level ${nextId}`
    );


  if (
    name === null
  ) return;


  const trimmed =
    name.trim();


  if (!trimmed) {

    alert(
      "Please enter a level name."
    );

    return;

  }


  const reverse =
    confirm(

      `How should answers be entered in ${trimmed}?

OK = REVERSE ENTRY
Units digit first

Example:
514 → 4 → 1 → 5

Cancel = NORMAL ENTRY
5 → 1 → 4`

    );


  const newLevel = {

    id:
      nextId,

    name:
      trimmed,

    reverse:
      reverse,

    questions:
      []

  };


  userLevels.push(
    newLevel
  );


  saveLevels();


  alert(
    `${trimmed} created.`
  );


  showLevelMenu(
    nextId
  );

}


// ==========================================
// IMPORT WHOLE DECK
// ==========================================

function importDeck(
  levelNumber
) {

  const level =
    getLevel(
      levelNumber
    );


  if (!level) return;


  const pasted =
    prompt(

      `Paste the whole question deck here.

One question per line.

Example:

169+345=514
427-183=244
58+27=85
96-48=48

The existing questions in ${level.name}
will be replaced.

Level 1 cannot be changed.`,

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
      "No valid questions found.\n\nUse:\n169+345=514"
    );

    return;

  }


  level.questions =
    imported;


  saveLevels();


  alert(
    `Imported ${imported.length} questions into ${level.name}.`
  );


  showLevelMenu(
    levelNumber
  );

}


// ==========================================
// PARSE QUESTION
// ==========================================

function parseQuestionLine(
  line
) {

  let cleaned =
    line.trim();


  cleaned =
    cleaned.replace(
      /^\d+[\).\s]+/,
      ""
    );


  cleaned =
    cleaned.replaceAll(
      ",",
      ""
    );


  const equals =
    cleaned.match(
      /^(.+?)\s*=\s*(-?\d+(?:\.\d+)?)$/
    );


  if (equals) {

    return {

      text:
        equals[1].trim(),

      answer:
        Number(
          equals[2]
        )

    };

  }


  const colon =
    cleaned.match(
      /^(.+?)\s*:\s*(-?\d+(?:\.\d+)?)$/
    );


  if (colon) {

    return {

      text:
        colon[1].trim(),

      answer:
        Number(
          colon[2]
        )

    };

  }


  return null;

}


// ==========================================
// VIEW QUESTIONS
// ==========================================

function viewLevelQuestions(
  levelNumber
) {

  let questions = [];


  if (
    levelNumber === "mixed"
  ) {

    questions =
      getAllQuestions();

  } else {

    const level =
      getLevel(
        levelNumber
      );


    if (!level) return;


    questions =
      level.questions;

  }


  showScreen(bankView);


  const levelName =
    getLevelName(
      levelNumber
    );


  const canEdit =
    levelNumber !== 1 &&
    levelNumber !== "mixed";


  let html = `

    <button
      id="questionBack"
      class="back"
    >
      ← ${escapeHtml(levelName)}
    </button>


    <h2>
      ${escapeHtml(levelName)} Questions
    </h2>


    <p>
      ${questions.length} questions
    </p>


    <div class="question-grid">

  `;


  questions.forEach(
    (question, i) => {

      html += `

        <div class="question-item">

          <strong>
            ${i + 1}.
          </strong>

          ${escapeHtml(question.text)}
          =
          ${question.answer}

          ${
            canEdit

              ? `

                <div class="question-actions">

                  <button
                    class="secondary edit-question"
                    data-index="${i}"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    class="secondary delete-question"
                    data-index="${i}"
                  >
                    🗑️ Delete
                  </button>

                </div>

              `

              : ""

          }

        </div>

      `;

    }
  );


  html +=
    "</div>";


  bankView.innerHTML =
    html;


  fastButton(
    document.getElementById(
      "questionBack"
    ),
    () =>
      showLevelMenu(
        levelNumber
      )
  );


  // ----------------------------------------
  // EDIT BUTTONS
  // ----------------------------------------

  document
    .querySelectorAll(
      ".edit-question"
    )
    .forEach(
      button => {

        fastButton(
          button,
          () => {

            editQuestion(
              levelNumber,
              Number(
                button.dataset.index
              )
            );

          }
        );

      }
    );


  // ----------------------------------------
  // DELETE BUTTONS
  // ----------------------------------------

  document
    .querySelectorAll(
      ".delete-question"
    )
    .forEach(
      button => {

        fastButton(
          button,
          () => {

            deleteQuestion(
              levelNumber,
              Number(
                button.dataset.index
              )
            );

          }
        );

      }
    );

}


// ==========================================
// EDIT QUESTION
// ==========================================

function editQuestion(
  levelNumber,
  questionIndex
) {

  // LEVEL 1 IS PROTECTED
  if (
    levelNumber === 1
  ) {

    alert(
      "Level 1 is protected. Its 469 original questions cannot be edited."
    );

    return;

  }


  const level =
    getLevel(
      levelNumber
    );


  if (!level) return;


  const question =
    level.questions[
      questionIndex
    ];


  if (!question) return;


  const newText =
    prompt(
      "Edit the question:",
      question.text
    );


  if (
    newText === null
  ) return;


  const trimmedText =
    newText.trim();


  if (!trimmedText) {

    alert(
      "The question cannot be empty."
    );

    return;

  }


  const newAnswer =
    prompt(
      "Edit the correct answer:",
      String(
        question.answer
      )
    );


  if (
    newAnswer === null
  ) return;


  const parsedAnswer =
    Number(
      newAnswer.trim()
    );


  if (
    !Number.isFinite(
      parsedAnswer
    )
  ) {

    alert(
      "Please enter a valid number."
    );

    return;

  }


  question.text =
    trimmedText;


  question.answer =
    parsedAnswer;


  saveLevels();


  viewLevelQuestions(
    levelNumber
  );

}


// ==========================================
// DELETE QUESTION
// ==========================================

function deleteQuestion(
  levelNumber,
  questionIndex
) {

  // LEVEL 1 IS PROTECTED
  if (
    levelNumber === 1
  ) {

    alert(
      "Level 1 is protected. Its 469 original questions cannot be deleted."
    );

    return;

  }


  const level =
    getLevel(
      levelNumber
    );


  if (!level) return;


  const question =
    level.questions[
      questionIndex
    ];


  if (!question) return;


  const confirmed =
    confirm(

      `Delete this question?

${question.text} = ${question.answer}

This cannot be undone.`

    );


  if (!confirmed) return;


  level.questions.splice(
    questionIndex,
    1
  );


  saveLevels();


  viewLevelQuestions(
    levelNumber
  );

}


// ==========================================
// LEVEL SETTINGS
// ==========================================

function levelSettings(
  levelNumber
) {

  const level =
    getLevel(
      levelNumber
    );


  if (
    !level ||
    levelNumber === 1
  ) {

    return;

  }


  const reverse =
    confirm(

      `Entry direction for ${level.name}:

OK = REVERSE ENTRY
Units digit first

Cancel = NORMAL ENTRY`

    );


  level.reverse =
    reverse;


  saveLevels();


  alert(

    reverse

      ? "Reverse Entry enabled."

      : "Normal Entry enabled."

  );


  showLevelMenu(
    levelNumber
  );

}


// ==========================================
// ESCAPE HTML
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
// FAST TOUCH BUTTON
// ==========================================

function fastButton(
  element,
  action
) {

  if (!element) return;


  element.style.touchAction =
    "manipulation";

  element.style.webkitTapHighlightColor =
    "transparent";

  element.style.userSelect =
    "none";

  element.style.webkitUserSelect =
    "none";


  let touchHandled = false;


  element.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();


      if (
        touchHandled
      ) return;


      touchHandled = true;


      action();

    },
    {
      passive: false
    }
  );


  element.addEventListener(
    "touchend",
    event => {

      event.preventDefault();


      setTimeout(
        () => {

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
    () => {

      touchHandled = false;

    }
  );


  element.addEventListener(
    "click",
    event => {

      event.preventDefault();


      if (
        touchHandled
      ) return;


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
// SUBMIT BUTTON
// ==========================================

fastButton(
  document.getElementById(
    "submitBtn"
  ),
  submitAnswer
);


// ==========================================
// GAME BACK
// ==========================================

fastButton(
  document.getElementById(
    "backBtn"
  ),
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle = null;

    renderHome();

  }
);


// ==========================================
// PLAY AGAIN
// ==========================================

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


// ==========================================
// RESULTS HOME
// ==========================================

fastButton(
  document.getElementById(
    "homeBtn"
  ),
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle = null;

    renderHome();

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


// ==========================================
// START
// ==========================================

renderHome();
