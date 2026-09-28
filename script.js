// ============ TRANSLATIONS ============
const translations = {
  en: {
    code: "EN",
    welcome: "Welcome",
    welcomeSub: "Everything you need for AP, DTM and Chemistry — in one place, for free.",
    cta: "Start learning",
    subjectsTitle: "Choose your subject",
    apDesc: "Advanced Placement courses & practice exams",
    dtmDesc: "National test prep with real past papers",
    chemistryTitle: "Chemistry",
    chemDesc: "From atoms to reactions, explained simply",
    openText: "Open folder →",
    adsTitle: "Sponsored",
    ad: "Advertisement",
    footerText: "Free, high-quality education for every student."
  },
  uz: {
    code: "UZ",
    welcome: "Xush kelibsiz",
    welcomeSub: "AP, DTM va Kimyo uchun kerak bo'lgan hamma narsa — bir joyda, bepul.",
    cta: "O'qishni boshlash",
    subjectsTitle: "Fanni tanlang",
    apDesc: "Advanced Placement kurslari va mashq testlari",
    dtmDesc: "Haqiqiy o'tgan yillar testlari bilan DTM tayyorgarligi",
    chemistryTitle: "Kimyo",
    chemDesc: "Atomlardan reaksiyalargacha, sodda tilda",
    openText: "Papkani ochish →",
    adsTitle: "Reklama",
    ad: "Reklama",
    footerText: "Har bir o'quvchi uchun bepul, sifatli ta'lim."
  }
};
 
let currentLang = "en";
 
function applyLanguage(lang) {
  const t = translations[lang];
  currentLang = lang;
 
  document.getElementById("langCurrent").textContent = t.code;
  document.getElementById("welcomeText").textContent = t.welcome;
  document.getElementById("welcomeSub").textContent = t.welcomeSub;
  document.getElementById("ctaText").textContent = t.cta;
  document.getElementById("subjectsTitle").textContent = t.subjectsTitle;
  document.getElementById("adsTitle").textContent = t.adsTitle;
  document.getElementById("adLabel1").textContent = t.ad;
  document.getElementById("adLabel2").textContent = t.ad;
  document.getElementById("adLabel3").textContent = t.ad;
  document.getElementById("footerText").textContent = t.footerText;
 
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });
 
  document.documentElement.setAttribute("lang", lang);
}
 
// ============ LANGUAGE DROPDOWN ============
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
    applyLanguage(item.getAttribute("data-lang"));
    switcher.classList.remove("open");
    langBtn.setAttribute("aria-expanded", "false");
  });
});
 
document.addEventListener("click", () => {
  switcher.classList.remove("open");
  langBtn.setAttribute("aria-expanded", "false");
});
 
// ============ INIT ============
applyLanguage("en");