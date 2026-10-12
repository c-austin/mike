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

    navLinks.forEach((link) => {
      const hash = (link.getAttribute("href") || "").split("#")[1];
      link.classList.toggle(
        "active",
        Boolean(hash) && hash === target.id && target.id !== HOME
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

  window.addEventListener("hashchange", render);
  render();
})();
