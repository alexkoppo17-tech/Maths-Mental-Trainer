// ============================================================
// MATHS MEMORY TRAINER
// COMPLETE LEVEL 1–5 BUILD
// SECTION 1 — LEVEL 1 + LEVEL 2 QUESTION BANKS
// ============================================================


// ============================================================
// LEVEL 1 — ORIGINAL 469 QUESTIONS
// 🔒 DO NOT MODIFY
// ============================================================

const QUESTIONS = [];


// ------------------------------------------------------------
// SUBTRACTION
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// MULTIPLICATION 0–12
// ------------------------------------------------------------

for (let a = 0; a <= 12; a++) {

  for (let b = 0; b <= 12; b++) {

    QUESTIONS.push([
      `${a}×${b}`,
      a * b
    ]);

  }

}


// ------------------------------------------------------------
// ADDITION
// ------------------------------------------------------------

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


// ============================================================
// LEVEL 1 SAFETY CHECK
// 🔒 ORIGINAL BANK MUST REMAIN EXACTLY 469
// ============================================================

if (QUESTIONS.length !== 469) {

  throw new Error(
    "LEVEL 1 ERROR: Original question bank is not exactly 469 questions."
  );

}


// ============================================================
// LEVEL 2 — COMPLETE AUTOMATIC BANK
// ============================================================
//
// Level 2 contains:
//
// • Every 2 digit + 2 digit combination
// • Every 2 digit + 1 digit combination
// • Every 2 digit - 2 digit combination
//   where the answer is positive
// • Every 2 digit - 1 digit combination
// • Every 2 digit × 1 digit combination
//
// Answers use REVERSE ENTRY:
// Units → Tens → Hundreds
//
// Example:
// 169 + 345 = 514
//
// Tap:
// 4 → 1 → 5
//
// Display:
// 4 → 14 → 514
// ============================================================

const LEVEL2_QUESTIONS = [];


// ------------------------------------------------------------
// 2 DIGIT + 2 DIGIT
// ------------------------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 10; b <= 99; b++) {

    LEVEL2_QUESTIONS.push({

      id:
        `level2-add2-${a}-${b}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      level:
        2,

      input:
        "reverse",

      type:
        "keypad"

    });

  }

}


// ------------------------------------------------------------
// 2 DIGIT + 1 DIGIT
// ------------------------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id:
        `level2-add1-${a}-${b}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      level:
        2,

      input:
        "reverse",

      type:
        "keypad"

    });

  }

}


// ------------------------------------------------------------
// 2 DIGIT - 2 DIGIT
// POSITIVE ANSWERS ONLY
// ------------------------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 10; b < a; b++) {

    LEVEL2_QUESTIONS.push({

      id:
        `level2-sub2-${a}-${b}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      level:
        2,

      input:
        "reverse",

      type:
        "keypad"

    });

  }

}


// ------------------------------------------------------------
// 2 DIGIT - 1 DIGIT
// ------------------------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id:
        `level2-sub1-${a}-${b}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      level:
        2,

      input:
        "reverse",

      type:
        "keypad"

    });

  }

}


// ------------------------------------------------------------
// 2 DIGIT × 1 DIGIT
// ------------------------------------------------------------

for (let a = 10; a <= 99; a++) {

  for (let b = 0; b <= 9; b++) {

    LEVEL2_QUESTIONS.push({

      id:
        `level2-mult-${a}-${b}`,

      text:
        `${a}×${b}`,

      answer:
        a * b,

      level:
        2,

      input:
        "reverse",

      type:
        "keypad"

    });

  }

}


// ============================================================
// LEVEL 2 SAFETY CHECK
// ============================================================

if (LEVEL2_QUESTIONS.length !== 14805) {

  throw new Error(
    `LEVEL 2 ERROR: Expected 14805 questions but generated ${LEVEL2_QUESTIONS.length}.`
  );

}
// ============================================================
// SECTION 2 — STORAGE, GAME STATE & GENERATORS
// ============================================================


// ------------------------------------------------------------
// USER LEVELS (LEVEL 6+ ONLY)
// ------------------------------------------------------------

let userLevels = [];

try {

  userLevels =
    JSON.parse(
      localStorage.getItem("mathLevels") || "[]"
    );

} catch {

  userLevels = [];

}

userLevels =
  userLevels.filter(
    level => Number(level.id) > 5
  );


// ------------------------------------------------------------
// HIGH SCORES
// ------------------------------------------------------------

let levelScores = {};

try {

  levelScores =
    JSON.parse(
      localStorage.getItem("mathLevelScores") || "{}"
    );

} catch {

  levelScores = {};

}


// ------------------------------------------------------------
// GAME STATE
// ------------------------------------------------------------

let mode = "speed";
let currentLevel = 1;
let mixedMode = false;

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


// ------------------------------------------------------------
// HTML ELEMENTS
// ------------------------------------------------------------

const home = document.getElementById("home");
const game = document.getElementById("game");
const results = document.getElementById("results");
const bankView = document.getElementById("bankView");

const questionEl = document.getElementById("question");
const answerDisplay = document.getElementById("answerDisplay");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const bestEl = document.getElementById("best");
const feedbackEl = document.getElementById("feedback");
const mistakesEl = document.getElementById("mistakes");

const keypad = document.querySelector(".keypad");
const submitBtn = document.getElementById("submitBtn");


// ------------------------------------------------------------
// SAVE FUNCTIONS
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// RANDOM HELPERS
// ------------------------------------------------------------

function randomInt(min, max) {

  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;

}

function shuffle(array) {

  const copy = array.slice();

  for (let i = copy.length - 1; i > 0; i--) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [copy[i], copy[j]] =
    [copy[j], copy[i]];

  }

  return copy;

}


// ------------------------------------------------------------
// LEVEL 3 RANDOM QUESTION GENERATOR
// ------------------------------------------------------------

function generateLevel3Question() {

  const type = randomInt(1, 5);

  if (type === 1) {

    const a = randomInt(100, 999);
    const b = randomInt(100, 999);

    return {
      id: `level3-add33-${Date.now()}`,
      text: `${a}+${b}`,
      answer: a + b,
      input: "reverse",
      type: "keypad"
    };

  }

  if (type === 2) {

    const a = randomInt(100, 999);
    const b = randomInt(10, 99);

    return {
      id: `level3-add32-${Date.now()}`,
      text: `${a}+${b}`,
      answer: a + b,
      input: "reverse",
      type: "keypad"
    };

  }

  if (type === 3) {

    let a, b;

    do {

      a = randomInt(100, 999);
      b = randomInt(100, 999);

    } while (a <= b);

    return {
      id: `level3-sub33-${Date.now()}`,
      text: `${a}-${b}`,
      answer: a - b,
      input: "reverse",
      type: "keypad"
    };

  }

  if (type === 4) {

    let a, b;

    do {

      a = randomInt(100, 999);
      b = randomInt(10, 99);

    } while (a <= b);

    return {
      id: `level3-sub32-${Date.now()}`,
      text: `${a}-${b}`,
      answer: a - b,
      input: "reverse",
      type: "keypad"
    };

  }

  const a = randomInt(10, 99);
  const b = randomInt(10, 99);

  return {
    id: `level3-mult22-${Date.now()}`,
    text: `${a}×${b}`,
    answer: a * b,
    input: "reverse",
    type: "keypad"
  };

}
// ============================================================
// SECTION 3 — LEVEL 4 & LEVEL 5 GENERATORS
// ============================================================


// ============================================================
// LEVEL 4 — RANDOM QUESTION GENERATOR
// ============================================================
//
// Level 4:
//
// • 4 digit + 4 digit
// • 4 digit + 3 digit
// • 4 digit - 4 digit, positive answer
// • 4 digit - 3 digit
// • 3 digit × 3 digit
//
// Addition/subtraction:
// REVERSE ENTRY
//
// 3 × 3 multiplication:
// MULTIPLE CHOICE
// ============================================================

function generateLevel4Question() {

  const type =
    randomInt(1, 5);


  // ----------------------------------------------------------
  // 4 DIGIT + 4 DIGIT
  // ----------------------------------------------------------

  if (type === 1) {

    const a =
      randomInt(1000, 9999);

    const b =
      randomInt(1000, 9999);

    return {

      id:
        `level4-add44-${Date.now()}-${Math.random()}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      input:
        "reverse",

      type:
        "keypad"

    };

  }


  // ----------------------------------------------------------
  // 4 DIGIT + 3 DIGIT
  // ----------------------------------------------------------

  if (type === 2) {

    const a =
      randomInt(1000, 9999);

    const b =
      randomInt(100, 999);

    return {

      id:
        `level4-add43-${Date.now()}-${Math.random()}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      input:
        "reverse",

      type:
        "keypad"

    };

  }


  // ----------------------------------------------------------
  // 4 DIGIT - 4 DIGIT
  // POSITIVE ANSWER ONLY
  // ----------------------------------------------------------

  if (type === 3) {

    let a;
    let b;

    do {

      a =
        randomInt(1000, 9999);

      b =
        randomInt(1000, 9999);

    } while (
      a <= b
    );

    return {

      id:
        `level4-sub44-${Date.now()}-${Math.random()}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      input:
        "reverse",

      type:
        "keypad"

    };

  }


  // ----------------------------------------------------------
  // 4 DIGIT - 3 DIGIT
  // ----------------------------------------------------------

  if (type === 4) {

    const a =
      randomInt(1000, 9999);

    const b =
      randomInt(100, 999);

    return {

      id:
        `level4-sub43-${Date.now()}-${Math.random()}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      input:
        "reverse",

      type:
        "keypad"

    };

  }


  // ----------------------------------------------------------
  // 3 DIGIT × 3 DIGIT
  // MULTIPLE CHOICE
  // ----------------------------------------------------------

  const a =
    randomInt(100, 999);

  const b =
    randomInt(100, 999);

  return {

    id:
      `level4-mult33-${Date.now()}-${Math.random()}`,

    text:
      `${a}×${b}`,

    answer:
      a * b,

    input:
      "multipleChoice",

    type:
      "multipleChoice"

  };

}


// ============================================================
// LEVEL 5 — RANDOM QUESTION GENERATOR
// ============================================================
//
// Level 5:
//
// ADDITION
// • 4 digit + 4 digit
// • 5 digit + 5 digit
// • 6 digit + 6 digit
//
// SUBTRACTION
// • 4 digit - 4 digit
// • 5 digit - 5 digit
// • 6 digit - 6 digit
//
// MULTIPLICATION
// • 4 digit × 4 digit
// • 5 digit × 5 digit
// • 6 digit × 6 digit
//
// ALL LEVEL 5 ANSWERS:
// MULTIPLE CHOICE
// ============================================================

function generateLevel5Question() {

  const type =
    randomInt(1, 9);


  // ----------------------------------------------------------
  // 4 DIGIT ADDITION
  // ----------------------------------------------------------

  if (type === 1) {

    const a =
      randomInt(1000, 9999);

    const b =
      randomInt(1000, 9999);

    return {

      id:
        `level5-add4-${Date.now()}-${Math.random()}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 5 DIGIT ADDITION
  // ----------------------------------------------------------

  if (type === 2) {

    const a =
      randomInt(10000, 99999);

    const b =
      randomInt(10000, 99999);

    return {

      id:
        `level5-add5-${Date.now()}-${Math.random()}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 6 DIGIT ADDITION
  // ----------------------------------------------------------

  if (type === 3) {

    const a =
      randomInt(100000, 999999);

    const b =
      randomInt(100000, 999999);

    return {

      id:
        `level5-add6-${Date.now()}-${Math.random()}`,

      text:
        `${a}+${b}`,

      answer:
        a + b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 4 DIGIT SUBTRACTION
  // POSITIVE ANSWER ONLY
  // ----------------------------------------------------------

  if (type === 4) {

    let a;
    let b;

    do {

      a =
        randomInt(1000, 9999);

      b =
        randomInt(1000, 9999);

    } while (
      a <= b
    );

    return {

      id:
        `level5-sub4-${Date.now()}-${Math.random()}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 5 DIGIT SUBTRACTION
  // POSITIVE ANSWER ONLY
  // ----------------------------------------------------------

  if (type === 5) {

    let a;
    let b;

    do {

      a =
        randomInt(10000, 99999);

      b =
        randomInt(10000, 99999);

    } while (
      a <= b
    );

    return {

      id:
        `level5-sub5-${Date.now()}-${Math.random()}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 6 DIGIT SUBTRACTION
  // POSITIVE ANSWER ONLY
  // ----------------------------------------------------------

  if (type === 6) {

    let a;
    let b;

    do {

      a =
        randomInt(100000, 999999);

      b =
        randomInt(100000, 999999);

    } while (
      a <= b
    );

    return {

      id:
        `level5-sub6-${Date.now()}-${Math.random()}`,

      text:
        `${a}-${b}`,

      answer:
        a - b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 4 DIGIT × 4 DIGIT
  // ----------------------------------------------------------

  if (type === 7) {

    const a =
      randomInt(1000, 9999);

    const b =
      randomInt(1000, 9999);

    return {

      id:
        `level5-mult4-${Date.now()}-${Math.random()}`,

      text:
        `${a}×${b}`,

      answer:
        a * b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 5 DIGIT × 5 DIGIT
  // ----------------------------------------------------------

  if (type === 8) {

    const a =
      randomInt(10000, 99999);

    const b =
      randomInt(10000, 99999);

    return {

      id:
        `level5-mult5-${Date.now()}-${Math.random()}`,

      text:
        `${a}×${b}`,

      answer:
        a * b,

      input:
        "multipleChoice",

      type:
        "multipleChoice"

    };

  }


  // ----------------------------------------------------------
  // 6 DIGIT × 6 DIGIT
  // ----------------------------------------------------------

  const a =
    randomInt(100000, 999999);

  const b =
    randomInt(100000, 999999);

  return {

    id:
      `level5-mult6-${Date.now()}-${Math.random()}`,

    text:
      `${a}×${b}`,

    answer:
      a * b,

    input:
      "multipleChoice",

    type:
      "multipleChoice"

  };

}
// ============================================================
// SECTION 4 — LEVEL DEFINITIONS + QUESTION SELECTION
// ============================================================


// ============================================================
// GET LEVEL
// ============================================================

function getLevel(levelNumber) {

  const n =
    Number(levelNumber);


  // ----------------------------------------------------------
  // LEVEL 1 — PROTECTED
  // ----------------------------------------------------------

  if (n === 1) {

    return {

      id:
        1,

      name:
        "Level 1",

      input:
        "normal",

      questions:
        QUESTIONS.map(
          (q, i) => ({

            id:
              `level1-${i}`,

            text:
              q[0],

            answer:
              q[1],

            level:
              1,

            input:
              "normal",

            type:
              "keypad"

          })
        )

    };

  }


  // ----------------------------------------------------------
  // LEVEL 2
  // ----------------------------------------------------------

  if (n === 2) {

    return {

      id:
        2,

      name:
        "Level 2",

      input:
        "reverse",

      questions:
        LEVEL2_QUESTIONS

    };

  }


  // ----------------------------------------------------------
  // LEVEL 3
  // ----------------------------------------------------------

  if (n === 3) {

    return {

      id:
        3,

      name:
        "Level 3",

      input:
        "reverse",

      generated:
        true,

      categories: [

        "3 digit + 3 digit",

        "3 digit + 2 digit",

        "3 digit − 3 digit",

        "3 digit − 2 digit",

        "2 digit × 2 digit"

      ]

    };

  }


  // ----------------------------------------------------------
  // LEVEL 4
  // ----------------------------------------------------------

  if (n === 4) {

    return {

      id:
        4,

      name:
        "Level 4",

      input:
        "mixed",

      generated:
        true,

      categories: [

        "4 digit + 4 digit",

        "4 digit + 3 digit",

        "4 digit − 4 digit",

        "4 digit − 3 digit",

        "3 digit × 3 digit — Multiple Choice"

      ]

    };

  }


  // ----------------------------------------------------------
  // LEVEL 5
  // ----------------------------------------------------------

  if (n === 5) {

    return {

      id:
        5,

      name:
        "Level 5",

      input:
        "multipleChoice",

      generated:
        true,

      categories: [

        "4 digit addition",

        "5 digit addition",

        "6 digit addition",

        "4 digit subtraction",

        "5 digit subtraction",

        "6 digit subtraction",

        "4 digit multiplication",

        "5 digit multiplication",

        "6 digit multiplication"

      ]

    };

  }


  // ----------------------------------------------------------
  // USER-CREATED LEVELS 6+
  // ----------------------------------------------------------

  return userLevels.find(
    level =>
      Number(level.id) === n
  );

}


// ============================================================
// GET LEVEL NAME
// ============================================================

function getLevelName(levelNumber) {

  if (
    levelNumber === "mixed"
  ) {

    return "Mixed";

  }

  const level =
    getLevel(
      levelNumber
    );

  return level
    ? level.name
    : `Level ${levelNumber}`;

}


// ============================================================
// SCORE KEY
// ============================================================

function scoreKey(
  levelNumber,
  scoreMode
) {

  return (
    `${levelNumber}-${scoreMode}`
  );

}


// ============================================================
// GET QUESTIONS FOR A LEVEL
// ============================================================

function getQuestionsForLevel(
  levelNumber,
  count
) {

  const n =
    Number(levelNumber);


  // ----------------------------------------------------------
  // LEVEL 1
  // ----------------------------------------------------------

  if (n === 1) {

    return shuffle(
      getLevel(1).questions
    );

  }


  // ----------------------------------------------------------
  // LEVEL 2
  // ----------------------------------------------------------

  if (n === 2) {

    return shuffle(
      LEVEL2_QUESTIONS
    );

  }


  // ----------------------------------------------------------
  // LEVEL 3
  // ----------------------------------------------------------

  if (n === 3) {

    const questions = [];

    for (
      let i = 0;
      i < count;
      i++
    ) {

      questions.push(
        generateLevel3Question()
      );

    }

    return questions;

  }


  // ----------------------------------------------------------
  // LEVEL 4
  // ----------------------------------------------------------

  if (n === 4) {

    const questions = [];

    for (
      let i = 0;
      i < count;
      i++
    ) {

      questions.push(
        generateLevel4Question()
      );

    }

    return questions;

  }


  // ----------------------------------------------------------
  // LEVEL 5
  // ----------------------------------------------------------

  if (n === 5) {

    const questions = [];

    for (
      let i = 0;
      i < count;
      i++
    ) {

      questions.push(
        generateLevel5Question()
      );

    }

    return questions;

  }


  // ----------------------------------------------------------
  // USER-CREATED LEVELS 6+
  // ----------------------------------------------------------

  const level =
    getLevel(n);

  if (
    level &&
    level.questions
  ) {

    return shuffle(
      level.questions
    );

  }


  return [];

}


// ============================================================
// MIXED MODE
// ============================================================
//
// 10 QUESTION MODE:
//
// 3 questions from Level 1
// 2 questions from Level 2
// 2 questions from Level 3
// 2 questions from Level 4
// 1 question from Level 5
//
// This gives:
//
// Level 1 = 30%
// Levels 2–5 = 70%
//
// The ten questions are then completely shuffled.
//
// Each question keeps its own input type, so:
//
// Level 1 → normal keypad
// Level 2 → reverse keypad
// Level 3 → reverse keypad
// Level 4 +/− → reverse keypad
// Level 4 multiplication → multiple choice
// Level 5 → multiple choice
// ============================================================

function generateMixedQuestions(
  selectedMode
) {

  // ----------------------------------------------------------
  // SPEED MODE
  // ----------------------------------------------------------

  if (
    selectedMode === "speed"
  ) {

    const questions = [];


    // 3 × LEVEL 1

    questions.push(
      ...shuffle(
        getLevel(1).questions
      ).slice(0, 3)
    );


    // 2 × LEVEL 2

    questions.push(
      ...shuffle(
        LEVEL2_QUESTIONS
      ).slice(0, 2)
    );


    // 2 × LEVEL 3

    questions.push(
      generateLevel3Question(),
      generateLevel3Question()
    );


    // 2 × LEVEL 4

    questions.push(
      generateLevel4Question(),
      generateLevel4Question()
    );


    // 1 × LEVEL 5

    questions.push(
      generateLevel5Question()
    );


    // Mix all ten together

    return shuffle(
      questions
    );

  }


  // ----------------------------------------------------------
  // PRACTICE MODE
  // ----------------------------------------------------------
  //
  // Practice continuously generates questions.
  //
  // 30% Level 1
  // 70% Levels 2–5
  // ----------------------------------------------------------

  const questions = [];

  for (
    let i = 0;
    i < 1000;
    i++
  ) {

    const roll =
      Math.random();


    // LEVEL 1 — 30%

    if (
      roll < 0.30
    ) {

      const bank =
        getLevel(1).questions;

      questions.push(
        bank[
          randomInt(
            0,
            bank.length - 1
          )
        ]
      );

    }


    // LEVEL 2 — 17.5%

    else if (
      roll < 0.475
    ) {

      questions.push(
        LEVEL2_QUESTIONS[
          randomInt(
            0,
            LEVEL2_QUESTIONS.length - 1
          )
        ]
      );

    }


    // LEVEL 3 — 17.5%

    else if (
      roll < 0.65
    ) {

      questions.push(
        generateLevel3Question()
      );

    }


    // LEVEL 4 — 17.5%

    else if (
      roll < 0.825
    ) {

      questions.push(
        generateLevel4Question()
      );

    }


    // LEVEL 5 — 17.5%

    else {

      questions.push(
        generateLevel5Question()
      );

    }

  }

  return questions;

}
// ============================================================
// SECTION 5 — GAME START, TIMER & QUESTION FLOW
// ============================================================


// ============================================================
// SCREEN CONTROL
// ============================================================

function showScreen(screen) {

  home.classList.add("hidden");

  game.classList.add("hidden");

  results.classList.add("hidden");

  bankView.classList.add("hidden");

  screen.classList.remove("hidden");

}


// ============================================================
// START LEVEL
// ============================================================

function startLevel(
  levelNumber,
  selectedMode
) {

  currentLevel =
    levelNumber;

  mode =
    selectedMode;

  mixedMode =
    levelNumber === "mixed";


  // ----------------------------------------------------------
  // BUILD QUESTION POOL
  // ----------------------------------------------------------

  if (
    mixedMode
  ) {

    pool =
      generateMixedQuestions(
        selectedMode
      );

  } else {

    pool =
      getQuestionsForLevel(
        Number(levelNumber),
        selectedMode === "speed"
          ? 10
          : 1000
      );

  }


  // ----------------------------------------------------------
  // SAFETY CHECK
  // ----------------------------------------------------------

  if (
    !pool ||
    pool.length === 0
  ) {

    alert(
      "This level has no questions yet."
    );

    return;

  }


  // ----------------------------------------------------------
  // RESET GAME
  // ----------------------------------------------------------

  index =
    0;

  correct =
    0;

  currentStreak =
    0;

  mistakes =
    [];

  answer =
    "";

  locked =
    false;


  // ----------------------------------------------------------
  // SHOW GAME
  // ----------------------------------------------------------

  showScreen(
    game
  );


  // ----------------------------------------------------------
  // START TIMER
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // FIRST QUESTION
  // ----------------------------------------------------------

  nextQuestion();

}


// ============================================================
// TIMER
// ============================================================

function updateTimer() {

  if (
    !startedAt
  ) {

    return;

  }


  const elapsed =
    (
      performance.now() -
      startedAt
    ) / 1000;


  timerEl.textContent =
    elapsed.toFixed(2) +
    "s";

}


// ============================================================
// BEST SCORE DISPLAY
// ============================================================

function updateBestDisplay() {

  const key =
    scoreKey(
      currentLevel,
      mode
    );


  const best =
    levelScores[key];


  // ----------------------------------------------------------
  // SPEED
  // ----------------------------------------------------------

  if (
    mode === "speed"
  ) {

    bestEl.textContent =

      best == null

        ? "🏆 Best 10/10: Not set"

        : `🏆 Best 10/10: ${Number(best).toFixed(2)}s`;

    return;

  }


  // ----------------------------------------------------------
  // PRACTICE
  // ----------------------------------------------------------

  bestEl.textContent =

    best

      ? `🏆 Best streak: ${best.streak} correct • ${Number(best.time).toFixed(2)}s`

      : "🏆 Best streak: Not set";

}


// ============================================================
// CURRENT INPUT TYPE
// ============================================================
//
// Every question carries its own input type.
//
// normal:
// Level 1
//
// reverse:
// Levels 2 and 3
// Level 4 addition/subtraction
//
// multipleChoice:
// Level 4 multiplication
// All Level 5
//
// This is especially important in MIXED mode.
// ============================================================

function currentInputType() {

  if (
    !current
  ) {

    return "normal";

  }


  return (
    current.input ||
    "normal"
  );

}


// ============================================================
// REVERSE ENTRY CHECK
// ============================================================

function usesReverseEntry() {

  return (
    currentInputType() ===
    "reverse"
  );

}


// ============================================================
// NEXT QUESTION
// ============================================================

function nextQuestion() {

  // ----------------------------------------------------------
  // SPEED MODE — STOP AFTER 10
  // ----------------------------------------------------------

  if (
    mode === "speed" &&
    index >= 10
  ) {

    finishSpeed();

    return;

  }


  // ----------------------------------------------------------
  // REFILL POOL IF NECESSARY
  // ----------------------------------------------------------

  if (
    pool.length === 0
  ) {

    if (
      mixedMode
    ) {

      pool =
        generateMixedQuestions(
          mode
        );

    } else {

      pool =
        getQuestionsForLevel(
          Number(currentLevel),
          mode === "speed"
            ? 10
            : 1000
        );

    }

  }


  // ----------------------------------------------------------
  // GET NEXT QUESTION
  // ----------------------------------------------------------

  current =
    pool.shift();


  index++;


  answer =
    "";

  locked =
    false;


  // ----------------------------------------------------------
  // DISPLAY QUESTION
  // ----------------------------------------------------------

  questionEl.textContent =
    String(
      current.text
    ).replaceAll(
      "-",
      "−"
    );


  answerDisplay.textContent =
    "\u00a0";


  feedbackEl.textContent =
    "\u00a0";


  // ----------------------------------------------------------
  // PROGRESS
  // ----------------------------------------------------------

  if (
    mode === "speed"
  ) {

    progressEl.textContent =
      `${getLevelName(currentLevel)} • Question ${index} / 10`;

  } else {

    progressEl.textContent =
      `${getLevelName(currentLevel)} • Streak: ${currentStreak}`;

  }


  // ----------------------------------------------------------
  // UPDATE ANSWER CONTROLS
  // ----------------------------------------------------------

  renderAnswerControls();


  updateBestDisplay();

}
// ============================================================
// SECTION 6 — ANSWER INPUT & CHECKING
// ============================================================


// ============================================================
// RENDER ANSWER CONTROLS
// ============================================================

function renderAnswerControls() {

  const input =
    currentInputType();


  // ----------------------------------------------------------
  // MULTIPLE CHOICE
  // ----------------------------------------------------------

  if (
    input === "multipleChoice"
  ) {

    if (keypad) {

      keypad.classList.add(
        "hidden"
      );

    }

    if (submitBtn) {

      submitBtn.classList.add(
        "hidden"
      );

    }

    renderMultipleChoice();

    return;

  }


  // ----------------------------------------------------------
  // KEYPAD
  // ----------------------------------------------------------

  if (keypad) {

    keypad.classList.remove(
      "hidden"
    );

  }

  if (submitBtn) {

    submitBtn.classList.remove(
      "hidden"
    );

  }


  // Remove multiple-choice buttons
  // if the previous question used them.

  const existing =
    document.getElementById(
      "multipleChoice"
    );

  if (
    existing
  ) {

    existing.remove();

  }

}


// ============================================================
// ENTER DIGIT
// ============================================================
//
// NORMAL:
//
// 5 → 51 → 514
//
// REVERSE:
//
// 4 → 14 → 514
//
// The input type comes from the current question,
// so Mixed automatically handles Level 1 and Level 2
// differently.
// ============================================================

function enterDigit(digit) {

  if (
    locked
  ) {

    return;

  }


  // Maximum answer length.
  // Level 5 uses multiple choice, so keypad
  // answers only need up to six digits.

  if (
    answer.length >= 6
  ) {

    return;

  }


  // ----------------------------------------------------------
  // REVERSE ENTRY
  // ----------------------------------------------------------

  if (
    usesReverseEntry()
  ) {

    answer =
      String(digit) +
      answer;

  }


  // ----------------------------------------------------------
  // NORMAL ENTRY
  // ----------------------------------------------------------

  else {

    answer +=
      String(digit);

  }


  answerDisplay.textContent =
    answer ||
    "\u00a0";

}


// ============================================================
// CLEAR LAST DIGIT
// ============================================================
//
// NORMAL:
// 514 → 51
//
// REVERSE:
// 514 → 14
// ============================================================

function clearLast() {

  if (
    locked
  ) {

    return;

  }


  if (
    usesReverseEntry()
  ) {

    answer =
      answer.slice(1);

  }

  else {

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


// ============================================================
// CLEAR ALL
// ============================================================

function clearAll() {

  if (
    locked
  ) {

    return;

  }


  answer =
    "";


  answerDisplay.textContent =
    "\u00a0";

}


// ============================================================
// SUBMIT KEYPAD ANSWER
// ============================================================

function submitAnswer() {

  if (
    locked
  ) {

    return;

  }


  if (
    answer === ""
  ) {

    return;

  }


  locked =
    true;


  const entered =
    Number(answer);


  const correctAnswer =
    Number(
      current.answer
    );


  // ----------------------------------------------------------
  // CORRECT
  // ----------------------------------------------------------

  if (
    entered ===
    correctAnswer
  ) {

    correct++;

    currentStreak++;


    feedbackEl.textContent =
      "✓ Correct";


    nextQuestion();


    return;

  }


  // ----------------------------------------------------------
  // WRONG
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // PRACTICE ENDS ON FIRST WRONG ANSWER
  // ----------------------------------------------------------

  if (
    mode === "practice"
  ) {

    finishPractice();

    return;

  }


  // ----------------------------------------------------------
  // SPEED MODE CONTINUES
  // ----------------------------------------------------------

  nextQuestion();

}


// ============================================================
// MULTIPLE CHOICE
// ============================================================

function renderMultipleChoice() {

  // Remove old buttons first.

  const old =
    document.getElementById(
      "multipleChoice"
    );

  if (
    old
  ) {

    old.remove();

  }


  const container =
    document.createElement(
      "div"
    );


  container.id =
    "multipleChoice";


  container.className =
    "multiple-choice";


  // Generate four answer choices.

  const choices =
    makeChoices(
      current.answer
    );


  choices.forEach(
    value => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "key primary";


      button.textContent =
        String(value);


      fastButton(
        button,
        () =>
          submitMultipleChoice(
            value
          )
      );


      container.appendChild(
        button
      );

    }
  );


  game.appendChild(
    container
  );

}


// ============================================================
// MULTIPLE CHOICE OPTIONS
// ============================================================

function makeChoices(
  correctAnswer
) {

  const choices =
    new Set();


  const correctNumber =
    Number(
      correctAnswer
    );


  choices.add(
    correctNumber
  );


  while (
    choices.size < 4
  ) {

    const magnitude =
      Math.max(
        1,
        Math.abs(
          correctNumber
        )
      );


    const offset =
      randomInt(
        1,
        Math.max(
          9,
          Math.floor(
            magnitude * 0.15
          )
        )
      );


    const sign =
      Math.random() < 0.5
        ? -1
        : 1;


    const candidate =
      correctNumber +
      sign * offset;


    if (
      candidate >= 0
    ) {

      choices.add(
        candidate
      );

    }

  }


  return shuffle(
    Array.from(
      choices
    )
  );

}


// ============================================================
// SUBMIT MULTIPLE CHOICE
// ============================================================

function submitMultipleChoice(
  value
) {

  if (
    locked
  ) {

    return;

  }


  locked =
    true;


  const selected =
    Number(
      value
    );


  const correctAnswer =
    Number(
      current.answer
    );


  // ----------------------------------------------------------
  // CORRECT
  // ----------------------------------------------------------

  if (
    selected ===
    correctAnswer
  ) {

    correct++;

    currentStreak++;


    feedbackEl.textContent =
      "✓ Correct";


    nextQuestion();


    return;

  }


  // ----------------------------------------------------------
  // WRONG
  // ----------------------------------------------------------

  mistakes.push({

    question:
      current.text,

    yourAnswer:
      selected,

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
// ============================================================
// SECTION 7 — RESULTS, HIGH SCORES & MISTAKE REVIEW
// ============================================================


// ============================================================
// FINISH SPEED MODE
// ============================================================

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


  const key =
    scoreKey(
      currentLevel,
      "speed"
    );


  let newRecord =
    false;


  // ----------------------------------------------------------
  // SAVE PERFECT SCORE
  // ----------------------------------------------------------

  if (
    perfect
  ) {

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


      newRecord =
        true;

    }

  }


  // ----------------------------------------------------------
  // SHOW RESULTS
  // ----------------------------------------------------------

  showScreen(
    results
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


// ============================================================
// FINISH PRACTICE MODE
// ============================================================
//
// Practice ends when the user gets a question wrong.
//
// The score is:
//
// Number of consecutive correct answers
//
// If the user beats the previous streak,
// it becomes the new high score.
// ============================================================

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


  const key =
    scoreKey(
      currentLevel,
      "practice"
    );


  const oldBest =
    levelScores[key];


  let newRecord =
    false;


  // ----------------------------------------------------------
  // SAVE NEW PRACTICE RECORD
  // ----------------------------------------------------------

  if (

    !oldBest ||

    currentStreak >
      Number(
        oldBest.streak
      ) ||

    (
      currentStreak ===
        Number(
          oldBest.streak
        ) &&

      streakTime <
        Number(
          oldBest.time
        )
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


  // ----------------------------------------------------------
  // SHOW RESULTS
  // ----------------------------------------------------------

  showScreen(
    results
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


// ============================================================
// DISPLAY MISTAKES
// ============================================================

function displayMistakes() {

  if (
    !mistakesEl
  ) {

    return;

  }


  // ----------------------------------------------------------
  // NO MISTAKES
  // ----------------------------------------------------------

  if (
    mistakes.length === 0
  ) {

    mistakesEl.innerHTML =
      "<p>🎯 No mistakes!</p>";

    return;

  }


  // ----------------------------------------------------------
  // BUILD REVIEW LIST
  // ----------------------------------------------------------

  let html =
    "<h3>Questions to review</h3>";


  mistakes.forEach(
    (mistake, i) => {

      html += `

        <div class="mistake">

          <strong>
            ${i + 1}.
            ${escapeHtml(
              mistake.question
            )}
          </strong>

          <br>

          ❌ Your answer:
          ${escapeHtml(
            mistake.yourAnswer
          )}

          <br>

          ✅ Correct answer:
          ${escapeHtml(
            mistake.correctAnswer
          )}

        </div>

      `;

    }
  );


  mistakesEl.innerHTML =
    html;

}
// ============================================================
// SECTION 8 — HOME SCREEN, LEVEL MENUS & LEVEL CREATION
// ============================================================


// ============================================================
// HOME SCREEN
// ============================================================

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


  // ----------------------------------------------------------
  // LEVELS 1–5
  // ----------------------------------------------------------

  for (
    let levelNumber = 1;
    levelNumber <= 5;
    levelNumber++
  ) {

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "primary";


    button.textContent =
      `LEVEL ${levelNumber}`;


    fastButton(
      button,
      () =>
        showLevelMenu(
          levelNumber
        )
    );


    list.appendChild(
      button
    );

  }


  // ----------------------------------------------------------
  // USER-CREATED LEVELS 6+
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // CREATE NEW LEVEL
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // MIXED
  // ALWAYS AT THE BOTTOM
  // ----------------------------------------------------------

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


// ============================================================
// LEVEL MENU
// ============================================================

function showLevelMenu(
  levelNumber
) {

  const isMixed =
    levelNumber === "mixed";


  const level =
    isMixed
      ? null
      : getLevel(
          levelNumber
        );


  // ----------------------------------------------------------
  // SAFETY CHECK
  // ----------------------------------------------------------

  if (
    !isMixed &&
    !level
  ) {

    alert(
      "That level does not exist."
    );

    return;

  }


  const levelName =
    getLevelName(
      levelNumber
    );


  showScreen(
    bankView
  );


  let description =
    "";


  // ----------------------------------------------------------
  // MIXED DESCRIPTION
  // ----------------------------------------------------------

  if (
    isMixed
  ) {

    description = `

      <p>
        30% Level 1
      </p>

      <p>
        70% Levels 2–5
      </p>

      <p>
        Each question automatically uses
        the correct answer method.
      </p>

    `;

  }


  // ----------------------------------------------------------
  // LEVEL 1
  // ----------------------------------------------------------

  else if (
    Number(levelNumber) === 1
  ) {

    description = `

      <p>
        🔒 Original 469 questions
      </p>

      <p>
        Normal Entry
      </p>

    `;

  }


  // ----------------------------------------------------------
  // LEVEL 2
  // ----------------------------------------------------------

  else if (
    Number(levelNumber) === 2
  ) {

    description = `

      <p>
        ${LEVEL2_QUESTIONS.length.toLocaleString()}
        questions
      </p>

      <p>
        🔄 Reverse Entry
      </p>

    `;

  }


  // ----------------------------------------------------------
  // LEVEL 3
  // ----------------------------------------------------------

  else if (
    Number(levelNumber) === 3
  ) {

    description = `

      <p>
        Questions generated automatically
      </p>

      <p>
        🔄 Reverse Entry
      </p>

    `;

  }


  // ----------------------------------------------------------
  // LEVEL 4
  // ----------------------------------------------------------

  else if (
    Number(levelNumber) === 4
  ) {

    description = `

      <p>
        Questions generated automatically
      </p>

      <p>
        🔄 Reverse Entry for addition/subtraction
      </p>

      <p>
        🔘 Multiple Choice for multiplication
      </p>

    `;

  }


  // ----------------------------------------------------------
  // LEVEL 5
  // ----------------------------------------------------------

  else if (
    Number(levelNumber) === 5
  ) {

    description = `

      <p>
        4, 5 and 6 digit calculations
      </p>

      <p>
        🔘 Multiple Choice
      </p>

    `;

  }


  // ----------------------------------------------------------
  // USER LEVELS 6+
  // ----------------------------------------------------------

  else {

    description = `

      <p>
        ${
          level.questions
            ? level.questions.length
            : 0
        }
        questions
      </p>

      <p>
        ${
          level.reverse
            ? "🔄 Reverse Entry"
            : "Normal Entry"
        }
      </p>

    `;

  }


  // ----------------------------------------------------------
  // BUILD MENU
  // ----------------------------------------------------------

  bankView.innerHTML = `

    <button
      id="levelMenuBack"
      class="back"
    >
      ← Levels
    </button>


    <h2>
      ${escapeHtml(
        levelName
      )}
    </h2>


    ${description}


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

  `;


  // ----------------------------------------------------------
  // BACK
  // ----------------------------------------------------------

  fastButton(
    document.getElementById(
      "levelMenuBack"
    ),
    renderHome
  );


  // ----------------------------------------------------------
  // SPEED
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // PRACTICE
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // QUESTION LIST
  // ----------------------------------------------------------

  fastButton(
    document.getElementById(
      "levelMenuQuestions"
    ),
    () =>
      viewLevelQuestions(
        levelNumber
      )
  );

}


// ============================================================
// CREATE NEW LEVEL
// ============================================================
//
// Levels 1–5 are built into the app.
//
// New user-created levels begin at Level 6.
// ============================================================

function createNewLevel() {

  const nextId =

    userLevels.length === 0

      ? 6

      : Math.max(
          5,
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
  ) {

    return;

  }


  const trimmed =
    name.trim();


  if (
    !trimmed
  ) {

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

Cancel = NORMAL ENTRY`

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


  renderHome();

}
// ============================================================
// SECTION 9 — QUESTION LISTS, HTML SAFETY & FAST TOUCH
// ============================================================


// ============================================================
// VIEW QUESTIONS
// ============================================================

function viewLevelQuestions(
  levelNumber
) {

  showScreen(
    bankView
  );


  const levelName =
    getLevelName(
      levelNumber
    );


  let html = `

    <button
      id="questionBack"
      class="back"
    >
      ← ${escapeHtml(
        levelName
      )}
    </button>

    <h2>
      ${escapeHtml(
        levelName
      )} Questions
    </h2>

  `;


  // ==========================================================
  // LEVEL 1
  // ==========================================================
  //
  // Show all 469 original questions.
  // ==========================================================

  if (
    Number(levelNumber) === 1
  ) {

    const questions =
      getLevel(1).questions;


    html += `

      <p>
        🔒 469 original questions
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

            ${escapeHtml(
              question.text
            )}

            =

            ${escapeHtml(
              question.answer
            )}

          </div>

        `;

      }
    );


    html += `

      </div>

    `;

  }


  // ==========================================================
  // LEVEL 2
  // ==========================================================
  //
  // Level 2 contains 14,805 questions.
  //
  // We don't put all 14,805 elements into the iPhone DOM
  // at once because that can make Safari/Home Screen slow.
  //
  // Instead we show 100 randomly selected examples.
  // ==========================================================

  else if (
    Number(levelNumber) === 2
  ) {

    const sample =
      shuffle(
        LEVEL2_QUESTIONS
      ).slice(
        0,
        100
      );


    html += `

      <p>

        ${LEVEL2_QUESTIONS.length.toLocaleString()}
        total questions.

      </p>

      <p>
        Showing 100 random examples.
      </p>

      <div class="question-grid">

    `;


    sample.forEach(
      (question, i) => {

        html += `

          <div class="question-item">

            <strong>
              ${i + 1}.
            </strong>

            ${escapeHtml(
              question.text
            )}

            =

            ${escapeHtml(
              question.answer
            )}

          </div>

        `;

      }
    );


    html += `

      </div>

    `;

  }


  // ==========================================================
  // LEVELS 3–5
  // ==========================================================
  //
  // These levels generate questions on demand rather than
  // storing enormous question banks.
  // ==========================================================

  else if (
    Number(levelNumber) >= 3 &&
    Number(levelNumber) <= 5
  ) {

    const level =
      getLevel(
        levelNumber
      );


    html += `

      <p>
        Questions are generated automatically.
      </p>

      <p>
        The level contains:
      </p>

      <ul>

    `;


    if (
      level &&
      level.categories
    ) {

      level.categories.forEach(
        category => {

          html += `

            <li>
              ${escapeHtml(
                category
              )}
            </li>

          `;

        }
      );

    }


    html += `

      </ul>

    `;

  }


  // ==========================================================
  // USER CREATED LEVELS 6+
  // ==========================================================

  else {

    const level =
      getLevel(
        levelNumber
      );


    const questions =
      level &&
      level.questions
        ? level.questions
        : [];


    html += `

      <p>
        ${questions.length}
        questions
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

            ${escapeHtml(
              question.text
            )}

            =

            ${escapeHtml(
              question.answer
            )}

          </div>

        `;

      }
    );


    html += `

      </div>

    `;

  }


  // ==========================================================
  // DISPLAY LIST
  // ==========================================================

  bankView.innerHTML =
    html;


  // ==========================================================
  // BACK BUTTON
  // ==========================================================

  fastButton(
    document.getElementById(
      "questionBack"
    ),
    () =>
      showLevelMenu(
        levelNumber
      )
  );

}


// ============================================================
// HTML ESCAPE
// ============================================================
//
// Protects the app when displaying question text or answers.
// ============================================================

function escapeHtml(
  value
) {

  return String(
    value
  ).replace(
    /[&<>"']/g,
    character => ({

      "&":
        "&amp;",

      "<":
        "&lt;",

      ">":
        "&gt;",

      '"':
        "&quot;",

      "'":
        "&#039;"

    })[character]
  );

}


// ============================================================
// FAST TOUCH BUTTON
// ============================================================
//
// Makes buttons respond quickly on iPhone/Safari/Home Screen.
// ============================================================

function fastButton(
  element,
  action
) {

  if (
    !element
  ) {

    return;

  }


  element.style.touchAction =
    "manipulation";


  element.style.webkitTapHighlightColor =
    "transparent";


  element.style.userSelect =
    "none";


  element.style.webkitUserSelect =
    "none";


  let touchHandled =
    false;


  // ----------------------------------------------------------
  // TOUCH START
  // ----------------------------------------------------------

  element.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();


      if (
        touchHandled
      ) {

        return;

      }


      touchHandled =
        true;


      action();

    },
    {
      passive: false
    }
  );


  // ----------------------------------------------------------
  // TOUCH END
  // ----------------------------------------------------------

  element.addEventListener(
    "touchend",
    event => {

      event.preventDefault();


      setTimeout(
        () => {

          touchHandled =
            false;

        },
        80
      );

    },
    {
      passive: false
    }
  );


  // ----------------------------------------------------------
  // TOUCH CANCEL
  // ----------------------------------------------------------

  element.addEventListener(
    "touchcancel",
    () => {

      touchHandled =
        false;

    }
  );


  // ----------------------------------------------------------
  // NORMAL CLICK
  // ----------------------------------------------------------

  element.addEventListener(
    "click",
    event => {

      event.preventDefault();


      if (
        touchHandled
      ) {

        return;

      }


      action();

    },
    {
      passive: false
    }
  );

}
// ============================================================
// SECTION 10 — KEYPAD, BUTTONS & APP START
// ============================================================


// ============================================================
// KEYPAD BUTTONS
// ============================================================

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

          }

          else if (
            key === "clearAll"
          ) {

            clearAll();

          }

          else {

            enterDigit(
              key
            );

          }

        }
      );

    }
  );


// ============================================================
// SUBMIT BUTTON
// ============================================================

fastButton(
  submitBtn,
  submitAnswer
);


// ============================================================
// GAME BACK BUTTON
// ============================================================

fastButton(
  document.getElementById(
    "backBtn"
  ),
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle =
      null;


    renderHome();

  }
);


// ============================================================
// PLAY AGAIN
// ============================================================

fastButton(
  document.getElementById(
    "againBtn"
  ),
  () => {

    startLevel(
      currentLevel,
      mode
    );

  }
);


// ============================================================
// RESULTS HOME BUTTON
// ============================================================

fastButton(
  document.getElementById(
    "homeBtn"
  ),
  () => {

    clearInterval(
      timerHandle
    );

    timerHandle =
      null;


    renderHome();

  }
);


// ============================================================
// PHYSICAL KEYBOARD
// ============================================================
//
// This also allows a normal keyboard to be used when testing
// the app on a computer.
// ============================================================

document.addEventListener(
  "keydown",
  event => {

    // --------------------------------------------------------
    // NUMBER KEYS
    // --------------------------------------------------------

    if (
      event.key >= "0" &&
      event.key <= "9"
    ) {

      enterDigit(
        event.key
      );

    }


    // --------------------------------------------------------
    // BACKSPACE
    // --------------------------------------------------------

    else if (
      event.key === "Backspace"
    ) {

      clearLast();

    }


    // --------------------------------------------------------
    // ESCAPE
    // --------------------------------------------------------

    else if (
      event.key === "Escape"
    ) {

      clearAll();

    }


    // --------------------------------------------------------
    // ENTER
    // --------------------------------------------------------

    else if (
      event.key === "Enter"
    ) {

      // Multiple choice questions don't use
      // the normal submit button.

      if (
        currentInputType() ===
        "multipleChoice"
      ) {

        return;

      }


      submitAnswer();

    }

  }
);


// ============================================================
// START APPLICATION
// ============================================================

renderHome();


// ============================================================
// END OF SCRIPT
// ============================================================
