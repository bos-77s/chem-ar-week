
document.addEventListener("DOMContentLoaded", () => {
  // قائمة التنقل في الجوال
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "إغلاق القائمة" : "فتح القائمة"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // المختبر الافتراضي
  const substanceA = document.getElementById("substanceA");
  const substanceB = document.getElementById("substanceB");
  const mixButton = document.getElementById("mixButton");
  const resetLab = document.getElementById("resetLab");
  const beaker = document.getElementById("beaker");
  const beakerLiquid = document.getElementById("beakerLiquid");
  const foam = document.getElementById("foam");
  const labParticles = document.getElementById("labParticles");
  const labVisualCaption = document.getElementById("labVisualCaption");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const resultNote = document.getElementById("resultNote");

  const substances = {
    vinegar: {
      name: "الخل المخفف",
      color: "rgba(235, 190, 94, 0.45)"
    },
    water: {
      name: "الماء",
      color: "rgba(22, 119, 255, 0.30)"
    },
    bakingSoda: {
      name: "بيكربونات الصوديوم",
      color: "rgba(235, 239, 244, 0.9)"
    },
    redCabbage: {
      name: "مستخلص الملفوف الأحمر",
      color: "rgba(145, 85, 195, 0.55)"
    }
  };

  function showLabResult(title, text, note, color, bubbles, caption) {
    resultTitle.textContent = title;
    resultText.textContent = text;
    resultNote.textContent = note;
    labVisualCaption.textContent = caption;

    beaker.classList.toggle("is-bubbling", bubbles);
    beakerLiquid.style.background = color;
    beakerLiquid.style.height = bubbles ? "55%" : "40%";
    labParticles.replaceChildren();

    if (bubbles) {
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("span");
        particle.className = "lab-particle";
        particle.style.left = `${20 + Math.random() * 60}%`;
        particle.style.animationDelay = `${Math.random() * 1.2}s`;
        particle.style.animationDuration = `${1 + Math.random()}s`;
        labParticles.appendChild(particle);
      }
    }
  }

  function runSimulation() {
    const a = substanceA.value;
    const b = substanceB.value;

    if (a === b) {
      showLabResult(
        "اختر مادتين مختلفتين",
        "اختر مادتين مختلفتين لتستكشف تفاعلهما في هذه المحاكاة.",
        "تغيير الاختيارات لا يسبب تفاعلًا حقيقيًا؛ هذه محاكاة رقمية.",
        substances[a].color,
        false,
        "بانتظار اختيار مادتين مختلفتين"
      );
      return;
    }

    const pair = [a, b].sort().join("+");

    if (pair === ["bakingSoda", "vinegar"].sort().join("+")) {
      showLabResult(
        "انطلاق غاز!",
        "عند تفاعل حمض الأسيتيك الموجود في الخل مع بيكربونات الصوديوم، يتكوّن ثاني أكسيد الكربون والماء وخلات الصوديوم. ظهور الفقاعات في الرسم يرمز إلى الغاز.",
        "المعادلة المبسطة: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. الرسم توضيحي وليس قياسًا لكمية الغاز.",
        "rgba(22, 163, 106, 0.45)",
        true,
        "فقاعات افتراضية تمثّل انطلاق CO₂"
      );
      return;
    }

    if (pair === ["redCabbage", "vinegar"].sort().join("+")) {
      showLabResult(
        "يتغير لون المؤشر",
        "مستخلص الملفوف الأحمر يحتوي على أصباغ تتغير ألوانها حسب درجة الحموضة. في الوسط الحمضي يميل اللون عادةً إلى الأحمر أو الوردي.",
        "اللون الفعلي يعتمد على تركيز المواد ودرجة الحموضة؛ اللون هنا تمثيل تعليمي.",
        "rgba(226, 80, 110, 0.55)",
        false,
        "تمثيل افتراضي لوسط حمضي"
      );
      return;
    }

    if (pair === ["bakingSoda", "redCabbage"].sort().join("+")) {
      showLabResult(
        "تغيّر لون متوقع",
        "بيكربونات الصوديوم مادة قاعدية ضعيفة، وقد يتغير لون مؤشر الملفوف الأحمر إلى الأزرق أو الأخضر المزرق حسب درجة الحموضة.",
        "المحاكاة لا تقيس قيمة pH الفعلية ولا تحدد اللون بدقة مخبرية.",
        "rgba(54, 164, 145, 0.55)",
        false,
        "تمثيل افتراضي لوسط قاعدي ضعيف"
      );
      return;
    }

    if (pair === ["redCabbage", "water"].sort().join("+")) {
      showLabResult(
        "مؤشر في وسط قريب من المتعادل",
        "الماء النقي قريب من التعادل، وقد يحتفظ مستخلص الملفوف بلون بنفسجي أو أرجواني. قد تتغير النتيجة بحسب الماء والمستخلص المستخدمين.",
        "هذا توقع تعليمي؛ لا يمكن تحديد درجة الحموضة الدقيقة من اللون وحده.",
        "rgba(139, 91, 194, 0.55)",
        false,
        "تمثيل افتراضي لمؤشر الملفوف"
      );
      return;
    }

    if (pair === ["vinegar", "water"].sort().join("+")) {
      showLabResult(
        "تخفيف الحمض",
        "عند مزج الخل بالماء يتخفف حمض الأسيتيك. لا نتوقع ظهور فقاعات غازية واضحة من هذا المزج وحده.",
        "التخفيف يقلل التركيز، لكنه لا يعني أن المحلول أصبح متعادلًا.",
        "rgba(226, 185, 104, 0.45)",
        false,
        "تمثيل افتراضي لمحلول مخفف"
      );
      return;
    }

    if (pair === ["bakingSoda", "water"].sort().join("+")) {
      showLabResult(
        "ذوبان جزئي",
        "بيكربونات الصوديوم تذوب في الماء بدرجة جيدة. لا يُتوقع انطلاق غاز ملحوظ من الماء وبيكربونات الصوديوم وحدهما في الظروف العادية.",
        "المشهد توضيحي؛ لا يمثل قياسًا للذوبانية أو سرعة الذوبان.",
        "rgba(190, 205, 222, 0.75)",
        false,
        "تمثيل افتراضي لمحلول بيكربونات"
      );
      return;
    }

    showLabResult(
      "مزيج دون تفاعل واضح",
      "لا تتوقع بالضرورة تفاعلًا كيميائيًا واضحًا من مجرد مزج المادتين. قد يحدث امتزاج أو استخلاص لبعض المكونات.",
      "التفاعل الحقيقي يعتمد على التركيز والظروف وخصائص المواد.",
      "rgba(133, 110, 190, 0.45)",
      false,
      "تمثيل افتراضي للمزيج"
    );
  }

  if (mixButton) {
    mixButton.addEventListener("click", runSimulation);
  }

  if (resetLab) {
    resetLab.addEventListener("click", () => {
      substanceA.value = "vinegar";
      substanceB.value = "bakingSoda";
      showLabResult(
        "جاهز للتجربة؟",
        "اختر مادتين واضغط على زر تشغيل المحاكاة.",
        "هذه محاكاة تعليمية مبسطة وليست قياسًا مخبريًا حقيقيًا.",
        "rgba(22, 119, 255, 0.35)",
        false,
        "بانتظار اختيار المواد..."
      );
    });
  }

  // تفاصيل التجارب التعليمية
  const experimentDetails = {
    vinegar: {
      title: "الخل وبيكربونات الصوديوم",
      text: "الفكرة العلمية: يتفاعل حمض الأسيتيك مع بيكربونات الصوديوم لينتج غاز ثاني أكسيد الكربون، الذي يظهر على هيئة فقاعات. يمكن تمثيل ذلك بالمعادلة: NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂. اسأل نفسك: ما الدليل على تكوّن الغاز؟ وهل تكوّن الفقاعات وحده يكفي لتحديد كمية الغاز؟"
    },
    indicator: {
      title: "ألوان الملفوف الأحمر",
      text: "يحتوي الملفوف الأحمر على أصباغ الأنثوسيانين، التي يتغير لونها مع تغير درجة الحموضة. تميل الألوان إلى الأحمر في الأوساط الحمضية، وقد تتحول إلى أزرق أو أخضر في أوساط أقل حموضة أو قاعدية. هذه الألوان تقريبية وتتأثر بالتركيز والمواد الموجودة."
    },
    solubility: {
      title: "الماء والذوبان",
      text: "الذوبان هو انتشار جسيمات مادة داخل مادة أخرى لتكوين مزيج متجانس. تعتمد الذوبانية على طبيعة المواد ودرجة الحرارة وعوامل أخرى. ليس كل ما يختلط بالماء يتفاعل كيميائيًا معه؛ فالذوبان والتفاعل الكيميائي عمليتان مختلفتان."
    }
  };

  const experimentDetail = document.getElementById("experimentDetail");
  const detailTitle = document.getElementById("detailTitle");
  const detailText = document.getElementById("detailText");
  const closeDetail = document.getElementById("closeDetail");

  document.querySelectorAll("[data-experiment]").forEach((button) => {
    button.addEventListener("click", () => {
      const detail = experimentDetails[button.dataset.experiment];
      if (!detail) return;

      detailTitle.textContent = detail.title;
      detailText.textContent = detail.text;
      experimentDetail.hidden = false;
      experimentDetail.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  if (closeDetail) {
    closeDetail.addEventListener("click", () => {
      experimentDetail.hidden = true;
    });
  }

  // المسابقة القصيرة
  const questions = [
    {
      question: "ما الغاز الذي ينتج عند تفاعل الخل مع بيكربونات الصوديوم؟",
      options: ["الأكسجين", "ثاني أكسيد الكربون", "الهيدروجين"],
      answer: 1,
      explanation: "صحيح! ينتج غاز ثاني أكسيد الكربون، وهو المسؤول عن الفقاعات."
    },
    {
      question: "ماذا نسمّي المادة التي تساعدنا على معرفة ما إذا كان الوسط حمضيًا أو قاعديًا بتغيّر لونها؟",
      options: ["مؤشر كيميائي", "مذيب فقط", "عنصر فلزي"],
      answer: 0,
      explanation: "صحيح! يتغير لون المؤشر بحسب خصائص الوسط الكيميائية."
    },
    {
      question: "أي عبارة تصف الذوبان وصفًا صحيحًا؟",
      options: [
        "كل ذوبان يعني حدوث تفاعل كيميائي",
        "الذوبان يحدث للغازات فقط",
        "يمكن أن تذوب مادة دون تكوين مادة جديدة"
      ],
      answer: 2,
      explanation: "أحسنت! الذوبان لا يعني بالضرورة حدوث تفاعل كيميائي."
    }
  ];

  const questionCounter = document.getElementById("questionCounter");
  const progressBar = document.getElementById("progressBar");
  const questionText = document.getElementById("questionText");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const nextQuestion = document.getElementById("nextQuestion");
  const quizFinal = document.getElementById("quizFinal");
  const finalScore = document.getElementById("finalScore");
  const finalMessage = document.getElementById("finalMessage");
  const restartQuiz = document.getElementById("restartQuiz");

  let questionIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const current = questions[questionIndex];

    questionCounter.textContent =
      `السؤال ${questionIndex + 1} من ${questions.length}`;
    progressBar.style.width =
      `${((questionIndex + 1) / questions.length) * 100}%`;
    questionText.textContent = current.question;
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";
    quizOptions.replaceChildren();
    quizOptions.hidden = false;
    nextQuestion.hidden = false;
    nextQuestion.disabled = true;
    nextQuestion.textContent =
      questionIndex === questions.length - 1 ? "عرض النتيجة" : "السؤال التالي ←";
    quizFinal.hidden = true;
    answered = false;

    current.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.dataset.answer = String(index);
      button.addEventListener("click", () => selectAnswer(index, button));
      quizOptions.appendChild(button);
    });
  }

  function selectAnswer(selectedIndex, selectedButton) {
    if (answered) return;
    answered = true;

    const current = questions[questionIndex];
    const buttons = quizOptions.querySelectorAll(".quiz-option");

    buttons.forEach((button) => {
      button.disabled = true;
      if (Number(button.dataset.answer) === current.answer) {
        button.classList.add("correct");
      }
    });

    if (selectedIndex === current.answer) {
      score++;
      quizFeedback.textContent = current.explanation;
      quizFeedback.className = "quiz-feedback success";
    } else {
      selectedButton.classList.add("wrong");
      quizFeedback.textContent =
        `ليس تمامًا. الإجابة الصحيحة: ${current.options[current.answer]}.`;
      quizFeedback.className = "quiz-feedback error";
    }

    nextQuestion.disabled = false;
  }

  function showFinalScore() {
    questionText.hidden = true;
    quizOptions.hidden = true;
    quizFeedback.hidden = true;
    nextQuestion.hidden = true;
    quizFinal.hidden = false;

    finalScore.textContent = `نتيجتك: ${score} من ${questions.length}`;
    finalMessage.textContent =
      score === questions.length
        ? "رائع! أجبت عن جميع الأسئلة بشكل صحيح."
        : score === 2
          ? "عمل جيد! راجع السؤال الذي أخطأت فيه لتثبيت المعلومة."
          : "بداية جيدة! أعد التحدي وتعلّم من التفسيرات.";
  }

  if (nextQuestion) {
    nextQuestion.addEventListener("click", () => {
      if (!answered) return;

      if (questionIndex < questions.length - 1) {
        questionIndex++;
        renderQuestion();
      } else {
        showFinalScore();
      }
    });
  }

  if (restartQuiz) {
    restartQuiz.addEventListener("click", () => {
      questionIndex = 0;
      score = 0;
      questionText.hidden = false;
      quizFeedback.hidden = false;
      renderQuestion();
      document.getElementById("quiz").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }

  renderQuestion();
});
