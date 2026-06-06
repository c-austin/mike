/* Shared behaviour for both pages.
   - Hash routing with a home/site header toggle (`.home` on <header>).
   - Tabbed sections: only the section matching the hash is shown; no hash = home.
   - Hamburger menu (site mode only) + active-link highlighting. */
(function () {
  const header = document.querySelector("header");
  const navToggle = document.querySelector('[aria-controls="primary-nav"]');
  const sections = Array.from(document.querySelectorAll("main > .section"));
  const navLinks = Array.from(document.querySelectorAll("nav a"));
  const HOME = "home";

  function currentId() {
    return decodeURIComponent(window.location.hash.replace("#", ""));
  }

  function render() {
    const id = currentId();
    const target = sections.find((s) => s.id === id && s.id !== HOME);
    const inSite = Boolean(target);

    header.classList.toggle("home", !inSite);

    sections.forEach((s) => {
      const visible = inSite ? s === target : s.id === HOME;
      s.classList.toggle("hide", !visible);
    });

    navLinks.forEach((link) => {
      const hash = (link.getAttribute("href") || "").split("#")[1];
      link.classList.toggle("active", inSite && hash === id);
    });

    if (!inSite) closeNav();
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

  window.addEventListener("hashchange", render);
  render();
})();
