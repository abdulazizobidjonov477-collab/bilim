// Shared dropdown + generic data-i18n text-swap logic for subject pages.
function initLangPage(translations, defaultLang, storageKey) {
  defaultLang = defaultLang || "en";
  if (storageKey) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && translations[saved]) defaultLang = saved;
    } catch (e) { /* localStorage unavailable, fall back silently */ }
  }
  function applyLanguage(lang) {
    const t = translations[lang];
    document.getElementById("langCurrent").textContent = t.code;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    document.documentElement.setAttribute("lang", lang);
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
      const chosen = item.getAttribute("data-lang");
      applyLanguage(chosen);
      if (storageKey) {
        try { localStorage.setItem(storageKey, chosen); } catch (e) {}
      }
      switcher.classList.remove("open");
      langBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", () => {
    switcher.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  });

  applyLanguage(defaultLang);
}