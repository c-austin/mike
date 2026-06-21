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
    // On the single page, shift the beige theme accent to the album-art yellow
    document.body.classList.toggle("single-view", inSite && id === "single");

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

  // ----- Promo video modal (musician home only; no-ops elsewhere) -----
  const promoOpen = document.getElementById("single-cover");
  const promoModal = document.getElementById("promo-modal");
  const promoClose = document.getElementById("promo-close");
  const promoFrame = document.getElementById("promo-frame");
  // nocookie domain + an explicit referrerpolicy avoids YouTube embed
  // "Error 153" (player config error when the referrer is missing/stripped)
  const PROMO_SRC =
    "https://www.youtube-nocookie.com/embed/0MFHKo-oGxU?autoplay=1&rel=0&playsinline=1";

  function openPromo() {
    promoFrame.innerHTML =
      '<iframe src="' +
      PROMO_SRC +
      '" title="The East Coast Eats Cars — promo video"' +
      ' referrerpolicy="strict-origin-when-cross-origin"' +
      ' allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    promoModal.classList.add("open");
    promoModal.setAttribute("aria-hidden", "false");
  }

  function closePromo() {
    promoModal.classList.remove("open");
    promoModal.setAttribute("aria-hidden", "true");
    promoFrame.innerHTML = ""; // unload the player to stop playback
  }

  if (promoOpen && promoModal && promoFrame) {
    promoOpen.addEventListener("click", openPromo);
    promoModal.addEventListener("click", function (e) {
      if (e.target === promoModal) closePromo();
    });
    if (promoClose) promoClose.addEventListener("click", closePromo);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && promoModal.classList.contains("open")) {
        closePromo();
      }
    });
  }

  window.addEventListener("hashchange", render);
  render();
})();
