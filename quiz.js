// ============================================================
// Generic Quiz Engine
// Works for ANY subject/topic — just point it at a different
// JSON file. Add new quizzes without touching this file.
// ============================================================

const uiText = {
  en: {
    loading: "Loading questions…",
    error: "Couldn't load this quiz. Please try again later.",
    question: "Question",
    of: "of",
    check: "Check answer",
    next: "Next question",
    finish: "See results",
    correct: "Correct!",
    incorrect: "Not quite.",
    resultsTitle: "Quiz complete",
    scoreLabel: "You scored",
    retry: "Try again",
    backHome: "Back to DTM"
  },
  uz: {
    loading: "Savollar yuklanmoqda…",
    error: "Testni yuklab bo'lmadi. Keyinroq urinib ko'ring.",
    question: "Savol",
    of: "/",
    check: "Javobni tekshirish",
    next: "Keyingi savol",
    finish: "Natijani ko'rish",
    correct: "To'g'ri!",
    incorrect: "Noto'g'ri.",
    resultsTitle: "Test yakunlandi",
    scoreLabel: "Sizning natijangiz",
    retry: "Qayta urinish",
    backHome: "DTM sahifasiga qaytish"
  },
  ru: {
    loading: "Загрузка вопросов…",
    error: "Не удалось загрузить тест. Попробуйте позже.",
    question: "Вопрос",
    of: "из",
    check: "Проверить ответ",
    next: "Следующий вопрос",
    finish: "Посмотреть результат",
    correct: "Правильно!",
    incorrect: "Неверно.",
    resultsTitle: "Тест завершён",
    scoreLabel: "Ваш результат",
    retry: "Попробовать снова",
    backHome: "Вернуться к ДТМ"
  }
};

let currentLang = "en";
let langLocked = false;
let questions = [];
let currentIndex = 0;
let score = 0;
let selectedOption = null;
let answered = false;

const root = document.getElementById("quizRoot");

function t(key) {
  return uiText[currentLang][key];
}

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const dataFile = params.get("data"); // e.g. data/dtm/math-algebra.json

  // DTM content is Uzbek/Russian only: hide the English option and
  // open in whichever language the student already chose on DTM pages.
  if (dataFile && dataFile.includes("data/dtm/")) {
    langLocked = true;
    currentLang = "uz";
    try {
      const savedLang = localStorage.getItem("bilim_dtm_lang");
      if (savedLang === "uz" || savedLang === "ru") currentLang = savedLang;
    } catch (e) { /* localStorage unavailable, default stays uz */ }
    document.getElementById("langCurrent").textContent = currentLang.toUpperCase();
    const enOption = document.querySelector('#langMenu li[data-lang="en"]');
    if (enOption) enOption.style.display = "none";
    document.documentElement.setAttribute("lang", currentLang);
  }

  if (!dataFile) {
    root.innerHTML = `<p class="quiz-error">${t("error")}</p>`;
    return;
  }

  root.innerHTML = `<p class="quiz-loading">${t("loading")}</p>`;

  try {
    const res = await fetch(dataFile);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    questions = data.questions;
    document.getElementById("quizTopicTitle").textContent = data.topic || "";
    renderQuestion();
  } catch (err) {
    root.innerHTML = `<p class="quiz-error">${t("error")}</p>`;
    console.error(err);
  }
}

function renderQuestion() {
  answered = false;
  selectedOption = null;
  const q = questions[currentIndex];
  const progressPct = Math.round((currentIndex / questions.length) * 100);
  const letters = ["A", "B", "C", "D"];

  root.innerHTML = `
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${progressPct}%"></div>
    </div>
    <p class="quiz-counter">${t("question")} ${currentIndex + 1} ${t("of")} ${questions.length}</p>
    <h2 class="quiz-prompt">${q.prompt[currentLang]}</h2>
    <div class="quiz-options" id="quizOptions">
      ${q.options[currentLang].map((opt, i) => `
        <button class="quiz-option" data-index="${i}">
          <span class="quiz-option-letter">${letters[i] || i + 1}</span>
          <span class="quiz-option-text">${opt}</span>
        </button>
      `).join("")}
    </div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <button class="quiz-action-btn" id="quizActionBtn" disabled>${t("check")}</button>
  `;

  document.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (answered) return;
      document.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedOption = parseInt(btn.getAttribute("data-index"));
      document.getElementById("quizActionBtn").disabled = false;
    });
  });

  document.getElementById("quizActionBtn").addEventListener("click", handleAction);
}

function handleAction() {
  if (!answered) {
    checkAnswer();
  } else {
    goToNext();
  }
}

function checkAnswer() {
  answered = true;
  const q = questions[currentIndex];
  const isCorrect = selectedOption === q.correct;
  if (isCorrect) score++;

  document.querySelectorAll(".quiz-option").forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === q.correct) btn.classList.add("correct");
    else if (i === selectedOption) btn.classList.add("incorrect");
  });

  const feedbackEl = document.getElementById("quizFeedback");
  feedbackEl.className = "quiz-feedback show " + (isCorrect ? "is-correct" : "is-incorrect");
  feedbackEl.innerHTML = `
    <strong>${isCorrect ? t("correct") : t("incorrect")}</strong>
    <p>${q.explanation[currentLang]}</p>
  `;

  const actionBtn = document.getElementById("quizActionBtn");
  actionBtn.disabled = false;
  actionBtn.textContent = (currentIndex === questions.length - 1) ? t("finish") : t("next");
}

function goToNext() {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    renderResults();
  }
}

function renderResults() {
  const pct = Math.round((score / questions.length) * 100);
  const params = new URLSearchParams(window.location.search);
  const dataFile = params.get("data") || "";
  const fileName = dataFile.split("/").pop() || "";
  let backHref = "dtm.html";
  if (fileName.startsWith("math-")) backHref = "math.html";
  else if (fileName.startsWith("onatili-")) backHref = "onatili.html";
  else if (fileName.startsWith("tarix-")) backHref = "tarix.html";
  else if (fileName.startsWith("fizika-")) backHref = "fizika.html";
  else if (fileName.startsWith("biologiya-")) backHref = "biologiya.html";
  else if (fileName.startsWith("kimyo-")) backHref = "kimyo.html";
  else if (fileName.startsWith("ingliztili-")) backHref = "ingliztili.html";

  root.innerHTML = `
    <div class="quiz-results">
      <div class="quiz-results-score">${pct}%</div>
      <h2>${t("resultsTitle")}</h2>
      <p>${t("scoreLabel")}: ${score} / ${questions.length}</p>
      <div class="quiz-results-actions">
        <button class="quiz-action-btn" id="retryBtn">${t("retry")}</button>
        <a href="${backHref}" class="quiz-back-link">${t("backHome")}</a>
      </div>
    </div>
  `;
  document.getElementById("retryBtn").addEventListener("click", () => {
    currentIndex = 0;
    score = 0;
    renderQuestion();
  });
}

// Language switching reuses the same dropdown markup as other pages
function applyQuizLanguage(lang) {
  currentLang = lang;
  document.getElementById("langCurrent").textContent = lang.toUpperCase();
  document.documentElement.setAttribute("lang", lang);
  if (langLocked) {
    try { localStorage.setItem("bilim_dtm_lang", lang); } catch (e) {}
  }
  if (questions.length) {
    // Re-render current state in the new language without losing progress
    if (currentIndex < questions.length) renderQuestion();
    else renderResults();
  }
}

function initQuizLangSwitcher() {
  const switcher = document.getElementById("langSwitcher");
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");

  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = switcher.classList.toggle("open");
    langBtn.setAttribute("aria-expanded", isOpen);
  });

  langMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
      applyQuizLanguage(item.getAttribute("data-lang"));
      switcher.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => {
    switcher.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  });
}

// Language switcher always initializes; loadQuiz() may have already
// hidden the English option and set the default to Uzbek for DTM content.
loadQuiz().then(() => {
  initQuizLangSwitcher();
});