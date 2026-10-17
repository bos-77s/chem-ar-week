 
const questions = [
  {
    question: "ما الرمز الكيميائي للأكسجين؟",
    options: ["O", "Ox", "Og", "C"],
    answer: "O"
  },
  {
    question: "ما الصيغة الكيميائية للماء؟",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    answer: "H₂O"
  },
  {
    question: "ما الرمز الكيميائي للكربون؟",
    options: ["Ca", "Co", "C", "K"],
    answer: "C"
  },
  {
    question: "ما الرقم الهيدروجيني للمادة المتعادلة تقريبًا؟",
    options: ["1", "5", "7", "14"],
    answer: "7"
  },
  {
    question: "ما الغاز الذي تمتصه النباتات في البناء الضوئي؟",
    options: ["الأكسجين", "ثاني أكسيد الكربون", "النيتروجين", "الهيدروجين"],
    answer: "ثاني أكسيد الكربون"
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
  { symbol: "Ca", name: "الكالسيوم" }
];

const carbonActivities = [
  {
    text: "استخدام الطاقة الشمسية",
    good: true,
    explanation: "الطاقة الشمسية مصدر متجدد ويمكن أن تقلل الاعتماد على الوقود الأحفوري."
  },
  {
    text: "ترك الأنوار مضاءة دون حاجة",
    good: false,
    explanation: "إطفاء الأنوار غير الضرورية يساعد على تقليل استهلاك الكهرباء."
  },
  {
    text: "استخدام النقل الجماعي",
    good: true,
    explanation: "تقاسم وسائل النقل قد يقلل الانبعاثات لكل شخص."
  },
  {
    text: "حرق النفايات عشوائيًا",
    good: false,
    explanation: "حرق النفايات قد يطلق ملوثات وغازات ضارة."
  },
  {
    text: "زراعة الأشجار والعناية بها",
    good: true,
    explanation: "تمتص الأشجار ثاني أكسيد الكربون أثناء نموها."
  }
];

const $ = selector => document.querySelector(selector);

let playerName = localStorage.getItem("chemPlayerName") || "";
let currentQuestion = 0;
let quizScore = 0;
let answerLocked = false;
let elementScore = 0;
let carbonScore = 0;
let carbonIndex = 0;

let leaderboard = loadLeaderboard();

function loadLeaderboard() {
  try {
    const data = JSON.parse(
      localStorage.getItem("chemLeaderboard") || "[]"
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveLeaderboard() {
  localStorage.setItem(
    "chemLeaderboard",
    JSON.stringify(leaderboard)
  );
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function getPlayerName() {
  const input = $("#studentName");

  if (input && input.value.trim()) {
    playerName = input.value.trim().slice(0, 30);
    localStorage.setItem("chemPlayerName", playerName);
  }

  if (!playerName) {
    const enteredName = prompt("اكتب اسمك للبدء:");

    if (!enteredName || !enteredName.trim()) {
      return "";
    }

    playerName = enteredName.trim().slice(0, 30);
    localStorage.setItem("chemPlayerName", playerName);
  }

  return playerName;
}

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
    const firstRatio = a.score / Math.max(a.maxScore, 1);
    const secondRatio = b.score / Math.max(b.maxScore, 1);

    return secondRatio - firstRatio || b.score - a.score;
  });

  leaderboard = leaderboard.slice(0, 20);

  saveLeaderboard();
  renderLeaderboard();
}

function saveName(event) {
  event.preventDefault();

  const input = $("#studentName");
  const message = $("#nameMessage");

  if (!input || !input.value.trim()) {
    if (message) {
      message.textContent = "اكتب اسمك أولًا.";
    }
    return;
  }

  playerName = input.value.trim().slice(0, 30);
  localStorage.setItem("chemPlayerName", playerName);

  if (message) {
    message.textContent = "أهلًا " + playerName + "، تم حفظ اسمك على هذا الجهاز.";
  }
}

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
        ${item.options.map((option, index) => `
          <button class="answer-btn" type="button" data-index="${index}">
            ${escapeHTML(option)}
          </button>
        `).join("")}
      </div>

      <p class="feedback" id="quizFeedback" aria-live="polite"></p>

      <div class="quiz-footer">
        <span>النقاط: ${quizScore}</span>
        <button class="button button-primary" id="nextQuestion" type="button" disabled>
          ${currentQuestion === questions.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
        </button>
      </div>
    </div>
  `;

  container.querySelectorAll(".answer-btn").forEach(button => {
    button.addEventListener("click", () => {
      checkAnswer(Number(button.dataset.index));
    });
  });

  $("#nextQuestion").addEventListener("click", () => {
    if (answerLocked) {
      currentQuestion++;
      showQuestion();
    }
  });
}

function checkAnswer(selectedIndex) {
  if (answerLocked) return;

  answerLocked = true;

  const item = questions[currentQuestion];
  const buttons = document.querySelectorAll("#quizContainer .answer-btn");
  const feedback = $("#quizFeedback");

  const selected = item.options[selectedIndex];
  const isCorrect = selected === item.answer;

  if (isCorrect) {
    quizScore++;
    feedback.textContent = "إجابة صحيحة! أحسنت.";
  } else {
    feedback.textContent = "الإجابة الصحيحة هي: " + item.answer;
  }

  buttons.forEach(button => {
    button.disabled = true;

    const option = item.options[Number(button.dataset.index)];

    if (option === item.answer) {
      button.classList.add("correct");
    } else if (option === selected) {
      button.classList.add("incorrect");
    }
  });

  $("#nextQuestion").disabled = false;
  $("#nextQuestion").focus();
}

function finishQuiz() {
  const container = $("#quizContainer");

  if (!container) return;

  saveScore("تحدي الكيمياء", quizScore, questions.length);

  container.innerHTML = `
    <div class="result-card">
      <div class="start-symbol">✳</div>
      <h3>أحسنت يا ${escapeHTML(playerName)}!</h3>
      <div class="result-score">${quizScore} / ${questions.length}</div>
      <p>
        ${quizScore === questions.length
          ? "درجة كاملة! أنت مستكشف كيميائي متميز."
          : "واصل التعلم، فكل تجربة تقربك من المعرفة."}
      </p>
      <button class="button button-primary" id="restartQuiz" type="button">
        أعد الاختبار
      </button>
    </div>
  `;

  $("#restartQuiz").addEventListener("click", startQuiz);
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function startElementGame() {
  const container = $("#extraGamePanel");

  if (!container) return;

  if (!getPlayerName()) return;

  elementScore = 0;

  const shuffledElements = shuffle(elements);
  let index = 0;

  function showElement() {
    if (index >= shuffledElements.length) {
      container.innerHTML = `
        <div class="result-card">
          <h3>انتهت رحلة العناصر!</h3>
          <div class="result-score">${elementScore} / ${shuffledElements.length}</div>
          <p>تعلمت اليوم رموزًا كيميائية جديدة.</p>
          <button class="button button-primary" id="restartElements" type="button">
            العب مرة أخرى
          </button>
        </div>
      `;

      saveScore("اكتشف العنصر", elementScore, shuffledElements.length);
      $("#restartElements").addEventListener("click", startElementGame);
      return;
    }

    const current = shuffledElements[index];
    const choices = shuffle([
      current,
      ...shuffle(elements.filter(item => item.symbol !== current.symbol)).slice(0, 3)
    ]);

    container.innerHTML = `
      <div class="question-card">
        <span class="question-progress">العنصر ${index + 1} من ${shuffledElements.length}</span>
        <h3>ما اسم هذا العنصر؟</h3>
        <div class="element-symbol">${current.symbol}</div>

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
          <button class="button button-primary" id="nextElement" type="button" disabled>
            التالي
          </button>
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
          feedback.textContent = "صحيح! أحسنت.";
        } else {
          feedback.textContent = "الإجابة الصحيحة: " + current.name;
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

function startCarbonGame() {
  const container = $("#extraGamePanel");

  if (!container) return;

  if (!getPlayerName()) return;

  carbonScore = 0;
  carbonIndex = 0;

  showCarbonActivity();
}

function showCarbonActivity() {
  const container = $("#extraGamePanel");

  if (carbonIndex >= carbonActivities.length) {
    container.innerHTML = `
      <div class="result-card">
        <h3>أكملت مهمة الكربون!</h3>
        <div class="result-score">${carbonScore} / ${carbonActivities.length}</div>
        <p>المعرفة العلمية تساعدنا على اتخاذ قرارات أفضل للبيئة.</p>
        <button class="button button-primary" id="restartCarbon" type="button">
          أعد المهمة
        </button>
      </div>
    `;

    saveScore("أمسك ما لا تراه", carbonScore, carbonActivities.length);
    $("#restartCarbon").addEventListener("click", startCarbonGame);
    return;
  }

  const activity = carbonActivities[carbonIndex];

  container.innerHTML = `
    <div class="question-card">
      <span class="question-progress">
        الموقف ${carbonIndex + 1} من ${carbonActivities.length}
      </span>

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
        <button class="button button-primary" id="nextCarbon" type="button" disabled>
          التالي
        </button>
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
      feedback.textContent = "إجابة صحيحة! " + activity.explanation;
    } else {
      feedback.textContent = "تذكّر: " + activity.explanation;
    }

    $("#carbonYes").disabled = true;
    $("#carbonNo").disabled = true;

    $("#carbonYes").classList.toggle("correct", activity.good);
    $("#carbonNo").classList.toggle("correct", !activity.good);

    $("#nextCarbon").disabled = false;
  }

  $("#carbonYes").addEventListener("click", () => answer(true));
  $("#carbonNo").addEventListener("click", () => answer(false));

  $("#nextCarbon").addEventListener("click", () => {
    carbonIndex++;
    showCarbonActivity();
  });
}

function renderLeaderboard() {
  const board = $("#leaderboard");

  if (!board) return;

  if (leaderboard.length === 0) {
    board.innerHTML = `
      <p class="empty-state">لا توجد نتائج بعد. كن أول المتنافسين!</p>
    `;
    return;
  }

  board.innerHTML = leaderboard.map((entry, index) => `
    <div class="leaderboard-row">
      <span>
        ${index + 1}. ${escapeHTML(entry.name)}
        <small style="display:block;color:#68766F">
          ${escapeHTML(entry.game || "تحدي الكيمياء")}
        </small>
      </span>
      <strong>${entry.score} / ${entry.maxScore}</strong>
    </div>
  `).join("");
}

function clearResults() {
  const confirmed = confirm("هل تريد مسح جميع النتائج المحفوظة على هذا الجهاز؟");

  if (!confirmed) return;

  leaderboard = [];
  localStorage.removeItem("chemLeaderboard");
  renderLeaderboard();
}

function setupNavigation() {
  const toggle = $("#menuToggle");
  const nav = $("#mainNav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

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
      $("#extraGames").scrollIntoView({ behavior: "smooth" });
    });
  }

  const carbonButton = $("#openCarbonGame");
  if (carbonButton) {
    carbonButton.addEventListener("click", () => {
      startCarbonGame();
      $("#extraGames").scrollIntoView({ behavior: "smooth" });
    });
  }

  const clearButton = $("#clearResults");
  if (clearButton) {
    clearButton.addEventListener("click", clearResults);
  }

  setupNavigation();
  renderLeaderboard();
});
