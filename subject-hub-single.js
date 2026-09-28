(function () {
  const script = document.currentScript;
  const subjectPrefix = script.getAttribute("data-subject");
  const titleUz = script.getAttribute("data-title-uz");
  const titleRu = script.getAttribute("data-title-ru");
  const iconChar = script.getAttribute("data-icon") || "📚";

  const T = {
    uz: {
      code: "UZ", crumbHome: "Bosh sahifa", crumbDtm: "DTM", crumbSubject: titleUz,
      title: titleUz, subtitle: "30 ta guruhdan birini tanlang — har birida 30 tadan savol.",
      heading: "Mashq guruhlari", sub: "30 ta guruh — har birida 30 tadan savol",
      groupWord: "guruh", questionsWord: "savol", startWord: "Boshlash"
    },
    ru: {
      code: "RU", crumbHome: "Главная", crumbDtm: "ДТМ", crumbSubject: titleRu,
      title: titleRu, subtitle: "Выберите одну из 30 групп — по 30 вопросов в каждой.",
      heading: "Группы практики", sub: "30 групп — по 30 вопросов в каждой",
      groupWord: "группа", questionsWord: "вопросов", startWord: "Начать"
    }
  };

  let lang = "uz";
  try {
    const savedLang = localStorage.getItem("bilim_dtm_lang");
    if (savedLang && T[savedLang]) lang = savedLang;
  } catch (e) { /* localStorage unavailable, default stays uz */ }

  function renderRow(container) {
    const t = T[lang];
    container.innerHTML = "";
    for (let i = 1; i <= 30; i++) {
      const card = document.createElement("a");
      card.href = `quiz.html?data=data/dtm/${subjectPrefix}-${i}.json`;
      card.className = "group-card group-card-single";
      card.innerHTML = `
        <span class="group-card-tab">${i}</span>
        <span class="group-card-num">${t.groupWord} ${i}</span>
        <span class="group-card-count">30 ${t.questionsWord}</span>
        <span class="group-card-cta">${t.startWord} →</span>`;
      container.appendChild(card);
    }
  }

  function renderAll() {
    const t = T[lang];
    document.getElementById("langCurrent").textContent = t.code;
    document.getElementById("crumbHome").textContent = t.crumbHome;
    document.getElementById("crumbDtm").textContent = t.crumbDtm;
    document.getElementById("crumbSubject").textContent = t.crumbSubject;
    document.getElementById("pageTitle").textContent = t.title;
    document.getElementById("pageSubtitle").textContent = t.subtitle;
    document.getElementById("singleHeading").textContent = t.heading;
    document.getElementById("singleSub").textContent = t.sub;
    document.documentElement.setAttribute("lang", lang);
    renderRow(document.getElementById("singleRow"));
  }

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
      lang = item.getAttribute("data-lang");
      try { localStorage.setItem("bilim_dtm_lang", lang); } catch (e) {}
      renderAll();
      switcher.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("click", () => {
    switcher.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  });

  document.getElementById("singleIcon").textContent = iconChar;
  renderAll();
})();