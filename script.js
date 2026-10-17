
"use strict";

/* =====================================
   أسبوع الكيمياء العربي
   الأسئلة والألعاب والنتائج
===================================== */

const $ = (selector) => document.querySelector(selector);

const questions = [
  {
    question: "ما الرمز الكيميائي للأكسجين؟",
    options: ["O", "Ox", "Og", "C"],
    answer: "O",
    explanation: "الرمز O هو رمز عنصر الأكسجين."
  },
  {
    question: "ما الصيغة الكيميائية للماء؟",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    answer: "H₂O",
    explanation: "يتكون جزيء الماء من ذرتي هيدروجين وذرة أكسجين."
  },
  {
    question: "ما الرمز الكيميائي للكربون؟",
    options: ["Ca", "Co", "C", "K"],
    answer: "C",
    explanation: "يرمز C إلى الكربون، بينما Co يرمز إلى الكوبالت."
  },
  {
    question: "ما الرقم الهيدروجيني للمادة المتعادلة تقريبًا عند 25°C؟",
    options: ["1", "5", "7", "14"],
    answer: "7",
    explanation: "تكون قيمة pH للماء النقي نحو 7 عند 25 درجة مئوية."
  },
  {
    question: "ما الغاز الذي تمتصه النباتات في البناء الضوئي؟",
    options: [
      "الأكسجين",
      "ثاني أكسيد الكربون",
      "النيتروجين",
      "الهيدروجين"
    ],
    answer: "ثاني أكسيد الكربون",
    explanation: "تستخدم النباتات ثاني أكسيد الكربون والماء والضوء لصنع السكريات."
  },
  {
    question: "ما الصيغة الكيميائية لغاز الأكسجين؟",
    options: ["O", "O₂", "CO₂", "H₂"],
    answer: "O₂",
    explanation: "يتكون جزيء الأكسجين المعتاد من ذرتين من الأكسجين."
  },
  {
    question: "أي المواد التالية حمض شائع؟",
    options: [
      "عصير الليمون",
      "محلول الصابون",
      "الماء النقي",
      "محلول بيكربونات الصوديوم"
    ],
    answer: "عصير الليمون",
    explanation: "يحتوي الليمون على حمض الستريك."
  }
];

const elements = [
  { symbol: "H", name: "الهيدروجين" },
  { symbol: "O", name: "الأكسجين" },
  { symbol: "C", name: "الكربون" },
  { symbol: "Na", name: "الصوديوم" },
  { symbol: "Fe", name: "الحديد" },
  { symbol: "Au", name: "الذهب" },
  { symbol: "He", name: "الهيليوم" },
  { symbol: "Ca", name: "الكالسيوم" },
  { symbol: "N", name: "النيتروجين" },
  { symbol: "Ag", name: "الفضة" }
];

const carbonActivities = [
  {
    text: "استخدام الطاقة الشمسية",
    good: true,
    explanation:
      "الطاقة الشمسية مصدر متجدد وقد تقلل الاعتماد على الوقود الأحفوري."
  },
  {
    text: "ترك الأنوار مضاءة دون حاجة",
    good: false,
    explanation:
      "إطفاء الأنوار غير الضرورية يساعد على تقليل استهلاك الكهرباء."
  },
  {
    text: "استخدام النقل الجماعي",
    good: true,
    explanation:
      "قد يقلل النقل الجماعي الانبعاثات لكل شخص."
  },
  {
    text: "حرق النفايات عشوائيًا",
    good: false,
    explanation:
      "قد يؤدي حرق النفايات إلى إطلاق ملوثات وغازات ضارة."
  },
  {
    text: "زراعة الأشجار والعناية بها",
    good: true,
    explanation:
      "تمتص الأشجار ثاني أكسيد الكربون أثناء نموها."
  }
];

/* =====================================
   التخزين
===================================== */

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // يستمر الموقع بالعمل حتى لو تعذر التخزين.
  }
}

function loadLeaderboard() {
  try {
    const data = JSON.parse(readStorage("chemLeaderboard", "[]"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let playerName = readStorage("chemPlayerName", "");
let leaderboard = loadLeaderboard();

let currentQuestion = 0;
let quizScore = 0;
let answerLocked = false;

let elementScore = 0;
let carbonScore = 0;
let carbonIndex = 0;

/* =====================================
   أدوات مساعدة
===================================== */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function scrollToGames() {
  const section = $("#extraGames");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function getPlayerName() {
  const input = $("#studentName");

  if (input && input.value.trim()) {
    playerName = input.value.trim().slice(0, 30);
    writeStorage("chemPlayerName", playerName);
  }

  if (!playerName) {
    const enteredName = prompt("اكتب اسمك للبدء:");

    if (!enteredName || !enteredName.trim()) {
      return "";
    }

    playerName = enteredName.trim().slice(0, 30);
    writeStorage("chemPlayerName", playerName);

    if (input) input.value = playerName;
  }

  return playerName;
}

/* =====================================
   حفظ اسم الطالب
===================================== */

function saveName(event) {
  event.preventDefault();

  const input = $("#studentName");
  const message = $("#nameMessage");

  if (!input || !input.value.trim()) {
    if (message) message.textContent = "اكتب اسمك أولًا.";
    return;
  }

  playerName = input.value.trim().slice(0, 30);
  const saved = writeStorage("chemPlayerName", playerName);

  if (message) {
    message.textContent = saved
      ? `أهلًا ${playerName}، تم حفظ اسمك على هذا الجهاز.`
      : `أهلًا ${playerName}، تعذر حفظ الاسم في المتصفح.`;
  }
}

/* =====================================
   لوحة المتصدرين
===================================== */

function saveScore(game, score, maxScore) {
  const name = getPlayerName();
  if (!name) return;

  leaderboard.push({
    name,
    game,
    score,
    maxScore,
    date: new Date().toLocaleDateString("ar-SA"),
    timestamp: Date.now()
  });

  leaderboard.sort((a, b) => {
    const ratioA = a.score / Math.max(a.maxScore, 1);
    const ratioB = b.score / Math.max(b.maxScore, 1);

    return ratioB - ratioA || b.score - a.score;
  });

  leaderboard = leaderboard.slice(0, 20);

  const saved = writeStorage(
    "chemLeaderboard",
    JSON.stringify(leaderboard)
  );

  renderLeaderboard();

  if (!saved) {
    alert("تعذر حفظ النتائج في هذا المتصفح.");
  }
}

function renderLeaderboard() {
  const board = $("#leaderboard");
  if (!board) return;

  if (leaderboard.length === 0) {
    board.innerHTML = `
      <p class="empty-state">
        لا توجد نتائج بعد. كن أول المتنافسين!
      </p>
    `;
    return;
  }

  board.innerHTML = leaderboard.map((entry, index) => `
    <div class="leaderboard-row">
      <span>
        ${index + 1}. ${escapeHTML(entry.name)}
        <small style="display:block;color:#586783">
          ${escapeHTML(entry.game || "تحدي الكيمياء")}
          ${entry.date ? ` · ${escapeHTML(entry.date)}` : ""}
        </small>
      </span>
      <strong>
        ${Number(entry.score) || 0} / ${Number(entry.maxScore) || 0}
      </strong>
    </div>
  `).join("");
}

function clearResults() {
  if (!confirm("هل تريد مسح جميع النتائج المحفوظة على هذا الجهاز؟")) {
    return;
  }

  leaderboard = [];
  removeStorage("chemLeaderboard");
  renderLeaderboard();
}

/* =====================================
   تحدي الكيمياء
===================================== */

function startQuiz() {
  if (!getPlayerName()) return;

  currentQuestion = 0;
  quizScore = 0;
  answerLocked = false;

  showQuestion();
}

function showQuestion() {
  const container = $("#quizContainer");
  if (!container) return;

  if (currentQuestion >= questions.length) {
    finishQuiz();
    return;
  }

  answerLocked = false;

  const item = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const shuffledOptions = shuffle(item.options);

  container.innerHTML = `
    <div class="question-card">
      <span class="question-progress">
        السؤال ${currentQuestion + 1} من ${questions.length}
      </span>

      <div class="progress-track">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>

      <h3>${escapeHTML(item.question)}</h3>

      <div class="answer-options">
        ${shuffledOptions.map((option, index) => `
          <button class="answer-btn" type="button" data-index="${index}">
            ${escapeHTML(option)}
          </button>
        `).join("")}
      </div>

      <p class="feedback" id="quizFeedback" aria-live="polite"></p>

      <div class="quiz-footer">
        <span>النقاط: <strong id="quizScore">${quizScore}</strong></span>
        <button class="button button-primary" id="nextQuestion"
          type="button" disabled>
          ${currentQuestion === questions.length - 1
            ? "عرض النتيجة"
            : "السؤال التالي"}
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll(".answer-btn").forEach(button => {
    button.addEventListener("click", () => {
      checkAnswer(shuffledOptions[Number(button.dataset.index)]);
    });
  });

  $("#nextQuestion").addEventListener("click", () => {
    if (!answerLocked) return;
    currentQuestion++;
    showQuestion();
  });
}

function checkAnswer(selected) {
  if (answerLocked) return;

  answerLocked = true;

  const item = questions[currentQuestion];
  const isCorrect = selected === item.answer;
  const feedback = $("#quizFeedback");

  if (isCorrect) {
    quizScore++;
    feedback.textContent = `إجابة صحيحة! ${item.explanation}`;
  } else {
    feedback.textContent =
      `الإجابة الصحيحة: ${item.answer}. ${item.explanation}`;
  }

  document.querySelectorAll("#quizContainer .answer-btn").forEach(button => {
    button.disabled = true;

    const option = button.textContent.trim();

    if (option === item.answer) {
      button.classList.add("correct");
    } else if (option === selected) {
      button.classList.add("incorrect");
    }
  });

  const scoreDisplay = $("#quizScore");
  if (scoreDisplay) scoreDisplay.textContent = quizScore;

  $("#nextQuestion").disabled = false;
}

function finishQuiz() {
  const container = $("#quizContainer");
  if (!container) return;

  saveScore("تحدي الكيمياء", quizScore, questions.length);

  const percentage = Math.round(
    quizScore / questions.length * 100
  );

  container.innerHTML = `
    <div class="result-card">
      <div class="start-symbol">✳</div>
      <h3>أحسنت يا ${escapeHTML(playerName)}!</h3>
      <div class="result-score">${quizScore} / ${questions.length}</div>
      <p>نسبة الإجابات الصحيحة: ${percentage}%</p>
      <p>
        ${quizScore === questions.length
          ? "درجة كاملة! أجبت عن جميع الأسئلة بشكل صحيح."
          : quizScore >= Math.ceil(questions.length * 0.6)
            ? "أداء جيد! واصل استكشاف عالم الكيمياء."
            : "كل محاولة فرصة للتعلم. جرّب مرة أخرى!"}
      </p>
      <button class="button button-primary" id="restartQuiz" type="button">
        أعد الاختبار
      </button>
    </div>
  `;

  $("#restartQuiz").addEventListener("click", startQuiz);
}

/* =====================================
   لعبة اكتشف العنصر
===================================== */

function startElementGame() {
  const container = $("#extraGamePanel");
  if (!container || !getPlayerName()) return;

  elementScore = 0;

  const shuffledElements = shuffle(elements);
  let index = 0;

  function showElement() {
    if (index >= shuffledElements.length) {
      container.innerHTML = `
        <div class="result-card">
          <div class="start-symbol">⚗</div>
          <h3>انتهت رحلة العناصر!</h3>
          <div class="result-score">
            ${elementScore} / ${shuffledElements.length}
          </div>
          <p>تعلمت اليوم رموزًا كيميائية جديدة.</p>
          <button class="button button-primary" id="restartElements"
            type="button">العب مرة أخرى</button>
        </div>
      `;

      saveScore("اكتشف العنصر", elementScore, shuffledElements.length);
      $("#restartElements").addEventListener("click", startElementGame);
      return;
    }

    const current = shuffledElements[index];
    const choices = shuffle([
      current,
      ...shuffle(
        elements.filter(item => item.symbol !== current.symbol)
      ).slice(0, 3)
    ]);

    container.innerHTML = `
      <div class="question-card">
        <span class="question-progress">
          العنصر ${index + 1} من ${shuffledElements.length}
        </span>

        <h3>ما اسم هذا العنصر؟</h3>
        <div class="element-symbol">${escapeHTML(current.symbol)}</div>

        <div class="answer-options">
          ${choices.map((item, choiceIndex) => `
            <button class="answer-btn" type="button" data-index="${choiceIndex}">
              ${escapeHTML(item.name)}
            </button>
          `).join("")}
        </div>

        <p class="feedback" id="elementFeedback" aria-live="polite"></p>

        <div class="quiz-footer">
          <span>النقاط: ${elementScore}</span>
          <button class="button button-primary" id="nextElement"
            type="button" disabled>التالي</button>
        </div>
      </div>
    `;

    let answered = false;

    container.querySelectorAll(".answer-btn").forEach(button => {
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;

        const selected = choices[Number(button.dataset.index)];
        const feedback = $("#elementFeedback");

        if (selected.symbol === current.symbol) {
          elementScore++;
          feedback.textContent = `صحيح! ${current.name} هو اسم العنصر.`;
        } else {
          feedback.textContent =
            `الإجابة الصحيحة: ${current.name} (${current.symbol}).`;
        }

        container.querySelectorAll(".answer-btn").forEach(optionButton => {
          optionButton.disabled = true;

          const option = choices[Number(optionButton.dataset.index)];

          if (option.symbol === current.symbol) {
            optionButton.classList.add("correct");
          } else if (option.symbol === selected.symbol) {
            optionButton.classList.add("incorrect");
          }
        });

        $("#nextElement").disabled = false;
      });
    });

    $("#nextElement").addEventListener("click", () => {
      index++;
      showElement();
    });
  }

  showElement();
}

/* =====================================
   لعبة أمسك ما لا تراه
===================================== */

function startCarbonGame() {
  const container = $("#extraGamePanel");
  if (!container || !getPlayerName()) return;

  carbonScore = 0;
  carbonIndex = 0;

  showCarbonActivity();
}

function showCarbonActivity() {
  const container = $("#extraGamePanel");
  if (!container) return;

  if (carbonIndex >= carbonActivities.length) {
    container.innerHTML = `
      <div class="result-card">
        <div class="start-symbol">🌱</div>
        <h3>أكملت مهمة الكربون!</h3>
        <div class="result-score">
          ${carbonScore} / ${carbonActivities.length}
        </div>
        <p>المعرفة العلمية تساعدنا على اتخاذ قرارات أفضل للبيئة.</p>
        <button class="button button-primary" id="restartCarbon"
          type="button">أعد المهمة</button>
      </div>
    `;

    saveScore("أمسك ما لا تراه", carbonScore, carbonActivities.length);
    $("#restartCarbon").addEventListener("click", startCarbonGame);
    return;
  }

  const activity = carbonActivities[carbonIndex];
  const progress = ((carbonIndex + 1) / carbonActivities.length) * 100;

  container.innerHTML = `
    <div class="question-card">
      <span class="question-progress">
        الموقف ${carbonIndex + 1} من ${carbonActivities.length}
      </span>

      <div class="progress-track">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>

      <h3>${escapeHTML(activity.text)}</h3>
      <p class="game-subtitle">
        هل يساعد هذا التصرف في تقليل الانبعاثات أو الحد من آثارها؟
      </p>

      <div class="answer-options">
        <button class="answer-btn" id="carbonYes" type="button">نعم</button>
        <button class="answer-btn" id="carbonNo" type="button">لا</button>
      </div>

      <p class="feedback" id="carbonFeedback" aria-live="polite"></p>

      <div class="quiz-footer">
        <span>النقاط: ${carbonScore}</span>
        <button class="button button-primary" id="nextCarbon"
          type="button" disabled>التالي</button>
      </div>
    </div>
  `;

  let answered = false;

  function answer(choice) {
    if (answered) return;
    answered = true;

    const feedback = $("#carbonFeedback");
    const correct = choice === activity.good;

    if (correct) {
      carbonScore++;
      feedback.textContent = `إجابة صحيحة! ${activity.explanation}`;
    } else {
      feedback.textContent = `تذكّر: ${activity.explanation}`;
    }

    $("#carbonYes").disabled = true;
    $("#carbonNo").disabled = true;

    const correctButton = activity.good ? $("#carbonYes") : $("#carbonNo");
    const selectedButton = choice ? $("#carbonYes") : $("#carbonNo");

    correctButton.classList.add("correct");

    if (!correct) {
      selectedButton.classList.add("incorrect");
    }

    $("#nextCarbon").disabled = false;
  }

  $("#carbonYes").addEventListener("click", () => answer(true));
  $("#carbonNo").addEventListener("click", () => answer(false));

  $("#nextCarbon").addEventListener("click", () => {
    carbonIndex++;
    showCarbonActivity();
  });
}

/* =====================================
   قائمة الجوال
===================================== */

function setupNavigation() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "فتح القائمة");
    });
  });
}

/* =====================================
   بدء الموقع
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = $("#studentName");

  if (nameInput) {
    nameInput.value = playerName;
  }

  const nameForm = $("#nameForm");
  if (nameForm) {
    nameForm.addEventListener("submit", saveName);
  }

  const quizButton = $("#startQuiz");
  if (quizButton) {
    quizButton.addEventListener("click", startQuiz);
  }

  const elementButton = $("#openElementGame");
  if (elementButton) {
    elementButton.addEventListener("click", () => {
      startElementGame();
      scrollToGames();
    });
  }

  const carbonButton = $("#openCarbonGame");
  if (carbonButton) {
    carbonButton.addEventListener("click", () => {
      startCarbonGame();
      scrollToGames();
    });
  }

  const clearButton = $("#clearResults");
  if (clearButton) {
    clearButton.addEventListener("click", clearResults);
  }

  setupNavigation();
  renderLeaderboard();
});
