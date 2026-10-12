/* Shared behaviour for both pages.
   - Hash routing with a home/site header toggle (`.home` on <header>).
   - Tabbed sections: only the section matching the hash is shown; no hash = home.
   - Hamburger menu (site mode only) + active-link highlighting. */
(function () {
  const header = document.querySelector("header");
  const navToggle = document.querySelector('[aria-controls="primary-nav"]');
  const sections = Array.from(document.querySelectorAll("main > .section"));
  const navLinks = Array.from(document.querySelectorAll("nav a"));
  // Landing section when there's no hash — per page via <body data-home>.
  // Producer omits it (defaults to "home"); the musician page uses "ep".
  const HOME = document.body.dataset.home || "home";

  function currentId() {
    return decodeURIComponent(window.location.hash.replace("#", ""));
  }

  function render() {
    const id = currentId() || HOME;
    const target =
      sections.find((s) => s.id === id) ||
      sections.find((s) => s.id === HOME) ||
      sections[0];
    if (!target) return;

    // Big overlay header only for the literal "home" landing (producer side)
    header.classList.toggle("home", target.id === "home");

    sections.forEach((s) => s.classList.toggle("hide", s !== target));

    // First time the landing is shown: type out its title
    if (typeTitle && target.contains(typed)) typeTitle();

    // Highlight the current section's link — except on the producer's
    // "home" splash, where the big overlay nav has no active state
    navLinks.forEach((link) => {
      const hash = (link.getAttribute("href") || "").split("#")[1];
      link.classList.toggle(
        "active",
        Boolean(hash) && hash === target.id && target.id !== "home"
      );
    });

    closeNav();
  }

  function closeNav() {
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleNav() {
    if (header.classList.contains("home")) return;
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", open ? "false" : "true");
  }

  if (navToggle) navToggle.addEventListener("click", toggleNav);
  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  // ----- Release-day copy swap (artist page only; no-ops elsewhere) -----
  // Once <body data-release> has passed, elements with data-after-release
  // show that text instead (e.g. PRE-ORDER → LISTEN NOW).
  const release = Date.parse(document.body.dataset.release || "");
  if (Date.now() >= release) {
    document.querySelectorAll("[data-after-release]").forEach((el) => {
      el.textContent = el.dataset.afterRelease;
    });
  }

  // ----- Typewriter title (artist landing) -----
  // Splits [data-typewriter] into per-letter spans (hidden, but each keeps
  // its space, so nothing reflows), then a block cursor walks across
  // revealing them. A caret blinks at the end, then the plain title is put
  // back. Runs the first time its section is shown (see render()). Screen
  // readers get the full title via aria-label throughout.
  const typed = document.querySelector("[data-typewriter]");
  let typeTitle = null;
  if (typed && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const text = typed.textContent.trim();
    typed.setAttribute("aria-label", text);
    typed.textContent = "";
    const chars = Array.from(text).map((ch) => {
      const span = document.createElement("span");
      span.className = "tw-char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      return typed.appendChild(span);
    });
    typed.classList.add("typing");

    typeTitle = function () {
      typeTitle = null; // only ever once
      let i = 0;
      const step = () => {
        if (i > 0) chars[i - 1].className = "tw-char tw-on";
        if (i < chars.length) {
          chars[i++].className = "tw-char tw-cursor";
          setTimeout(step, 70);
          return;
        }
        const caret = document.createElement("span");
        caret.className = "tw-caret";
        caret.setAttribute("aria-hidden", "true");
        typed.appendChild(caret);
        setTimeout(() => {
          typed.classList.remove("typing");
          typed.removeAttribute("aria-label");
          typed.textContent = text;
        }, 2500);
      };
      setTimeout(step, 500);
    };
  }

  window.addEventListener("hashchange", render);
  render();
})();
