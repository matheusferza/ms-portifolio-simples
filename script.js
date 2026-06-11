const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const contactForm = document.querySelector("[data-contact-form]");
const skillChips = document.querySelectorAll(".skill-chip");
const experienceToggles = document.querySelectorAll(".timeline-toggle");
const themeImages = document.querySelectorAll("[data-light-src][data-dark-src]");

const getStoredTheme = () => {
  try {
    return window.localStorage?.getItem("theme");
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    window.localStorage?.setItem("theme", theme);
  } catch {
    // Theme still changes for the current session if storage is unavailable.
  }
};

const savedTheme = getStoredTheme();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

const updateThemeToggle = (theme) => {
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");

  themeImages.forEach((image) => {
    image.src = isDark ? image.dataset.darkSrc : image.dataset.lightSrc;
  });
};

document.documentElement.dataset.theme = initialTheme;
updateThemeToggle(initialTheme);

const syncDisclosureState = (trigger) => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  const panelId = trigger.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;

  panel?.setAttribute("aria-hidden", String(!isOpen));
};

if (window.lucide) {
  window.lucide.createIcons();
} else {
  window.addEventListener("load", () => window.lucide?.createIcons());
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  }
});

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  setStoredTheme(nextTheme);
  updateThemeToggle(nextTheme);
});

skillChips.forEach((chip) => {
  syncDisclosureState(chip);

  chip.addEventListener("click", () => {
    const isOpen = chip.getAttribute("aria-expanded") === "true";
    chip.setAttribute("aria-expanded", String(!isOpen));
    syncDisclosureState(chip);
  });
});

experienceToggles.forEach((toggle) => {
  syncDisclosureState(toggle);

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    syncDisclosureState(toggle);
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  const body = [
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Projeto: ${subject}`,
    "",
    `${message}`,
  ].join("\n");

  const mailto = `mailto:matheuzfsouza@gmail.com?subject=${encodeURIComponent(
    `Contato pelo portfólio — ${subject}`
  )}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
});
