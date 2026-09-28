(function () {
  const script = document.currentScript;
  const subjectPrefix = script.getAttribute("data-subject");   // e.g. "onatili"
  const titleUz = script.getAttribute("data-title-uz");
  const titleRu = script.getAttribute("data-title-ru");
  const crumbUz = script.getAttribute("data-crumb-uz");
  const crumbRu = script.getAttribute("data-crumb-ru");

  const T = {
    uz: {
      code: "UZ", crumbHome: "Bosh sahifa", crumbDtm: "DTM", crumbSubject: crumbUz,
      title: titleUz, subtitle: "30 tadan guruhlangan mashq to'plamlaridan birini tanlang.",
      mandatoryHeading: "Majburiy Fan", mandatorySub: "30 ta guruh — har birida 10 tadan savol",
      specialistHeading: "Mutaxassislik Fan", specialistSub: "30 ta guruh — har birida 30 tadan savol",
      groupWord: "guruh", questionsWord: "savol", startWord: "Boshlash"
    },
    ru: {
      code: "RU", crumbHome: "Главная", crumbDtm: "ДТМ", crumbSubject: crumbRu,
      title: titleRu, subtitle: "Выберите одну из 30 групп практических заданий.",
      mandatoryHeading: "Обязательный предмет", mandatorySub: "30 групп — по 10 вопросов в каждой",
      specialistHeading: "Профильный предмет", specialistSub: "30 групп — по 30 вопросов в каждой",
      groupWord: "группа", questionsWord: "вопросов", startWord: "Начать"
    }
  };

  let lang = "uz";
  try {
    const savedLang = localStorage.getItem("bilim_dtm_lang");
    if (savedLang && T[savedLang]) lang = savedLang;
  } catch (e) { /* localStorage unavailable, default stays uz */ }

  function renderRow(container, count, filePrefix, qCount, accentClass) {
    const t = T[lang];
    container.innerHTML = "";
    for (let i = 1; i <= count; i++) {
      const card = document.createElement("a");
      card.href = `quiz.html?data=data/dtm/${filePrefix}-${i}.json`;
      card.className = `group-card ${accentClass}`;
      card.innerHTML = `
        <span class="group-card-tab">${i}</span>
        <span class="group-card-num">${t.groupWord} ${i}</span>
        <span class="group-card-count">${qCount} ${t.questionsWord}</span>
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
    document.getElementById("mandatoryHeading").textContent = t.mandatoryHeading;
    document.getElementById("mandatorySub").textContent = t.mandatorySub;
    document.getElementById("specialistHeading").textContent = t.specialistHeading;
    document.getElementById("specialistSub").textContent = t.specialistSub;
    document.documentElement.setAttribute("lang", lang);

    renderRow(document.getElementById("mandatoryRow"), 30, `${subjectPrefix}-majburiy`, 10, "group-card-mandatory");
    renderRow(document.getElementById("specialistRow"), 30, `${subjectPrefix}-mutaxassislik`, 30, "group-card-specialist");
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

  renderAll();
})();