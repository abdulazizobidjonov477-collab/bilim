const mathText = {
  uz: {
    code: "UZ",
    crumbHome: "Bosh sahifa",
    crumbDtm: "DTM",
    crumbMath: "Matematika",
    title: "Matematika",
    subtitle: "30 tadan guruhlangan mashq to'plamlaridan birini tanlang.",
    mandatoryHeading: "Majburiy Fan",
    mandatorySub: "30 ta guruh — har birida 10 tadan savol",
    specialistHeading: "Mutaxassislik Fan",
    specialistSub: "30 ta guruh — har birida 30 tadan savol",
    groupWord: "guruh",
    questionsWord: "savol",
    startWord: "Boshlash"
  },
  ru: {
    code: "RU",
    crumbHome: "Главная",
    crumbDtm: "ДТМ",
    crumbMath: "Математика",
    title: "Математика",
    subtitle: "Выберите одну из 30 групп практических заданий.",
    mandatoryHeading: "Обязательный предмет",
    mandatorySub: "30 групп — по 10 вопросов в каждой",
    specialistHeading: "Профильный предмет",
    specialistSub: "30 групп — по 30 вопросов в каждой",
    groupWord: "группа",
    questionsWord: "вопросов",
    startWord: "Начать"
  }
};

let mathLang = "uz";
try {
  const savedLang = localStorage.getItem("bilim_dtm_lang");
  if (savedLang && mathText[savedLang]) mathLang = savedLang;
} catch (e) { /* localStorage unavailable, default stays uz */ }

function renderGroupRow(container, count, filePrefix, questionsPerGroup, accentClass) {
  const t = mathText[mathLang];
  container.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const card = document.createElement("a");
    card.href = `quiz.html?data=data/dtm/${filePrefix}-${i}.json`;
    card.className = `group-card ${accentClass}`;
    card.innerHTML = `
      <span class="group-card-tab">${i}</span>
      <span class="group-card-num">${t.groupWord} ${i}</span>
      <span class="group-card-count">${questionsPerGroup} ${t.questionsWord}</span>
      <span class="group-card-cta">${t.startWord} →</span>
    `;
    container.appendChild(card);
  }
}

function renderAll() {
  const t = mathText[mathLang];
  document.getElementById("langCurrent").textContent = t.code;
  document.getElementById("crumbHome").textContent = t.crumbHome;
  document.getElementById("crumbDtm").textContent = t.crumbDtm;
  document.getElementById("crumbMath").textContent = t.crumbMath;
  document.getElementById("mathTitle").textContent = t.title;
  document.getElementById("mathSubtitle").textContent = t.subtitle;
  document.getElementById("mandatoryHeading").textContent = t.mandatoryHeading;
  document.getElementById("mandatorySub").textContent = t.mandatorySub;
  document.getElementById("specialistHeading").textContent = t.specialistHeading;
  document.getElementById("specialistSub").textContent = t.specialistSub;
  document.documentElement.setAttribute("lang", mathLang);

  renderGroupRow(document.getElementById("mandatoryRow"), 30, "math-majburiy", 10, "group-card-mandatory");
  renderGroupRow(document.getElementById("specialistRow"), 30, "math-mutaxassislik", 30, "group-card-specialist");
}

// Language dropdown wiring (same interaction pattern as other pages)
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
    mathLang = item.getAttribute("data-lang");
    try { localStorage.setItem("bilim_dtm_lang", mathLang); } catch (e) {}
    renderAll();
    switcher.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", () => {
  switcher.classList.remove("open");
  langBtn.setAttribute("aria-expanded", "false");
});

renderAll();