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

    // The promo plays inline in #single — stop it when navigating away
    if (id !== "single") stopPromo();

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

  // ----- Inline promo TV (single page only; no-ops elsewhere) -----
  // The CRT sits in the page. Standby shows the album cover + play button;
  // clicking powers on the tube and plays the self-hosted promo in the screen.
  const tv = document.getElementById("single-tv");
  const tvPlay = document.getElementById("tv-play");
  const promoFrame = document.getElementById("promo-frame");
  // A native <video> has no player chrome at all (no title, logo, or controls).
  const PROMO_SRC = "assets/WEBSITE.mp4";

  function startPromo() {
    if (tv.classList.contains("playing")) return;
    const video = document.createElement("video");
    video.src = PROMO_SRC;
    video.setAttribute("playsinline", ""); // play inline, not iOS native fullscreen
    video.preload = "auto";
    video.setAttribute("aria-label", "The East Coast Eats Cars — promo video");
    // No on-screen controls, so let a click on the picture pause/resume.
    video.addEventListener("click", function () {
      if (video.paused) video.play();
      else video.pause();
    });
    // When it finishes, switch the tube back to the standby cover + play button.
    video.addEventListener("ended", stopPromo);
    promoFrame.innerHTML = "";
    promoFrame.appendChild(video);
    tv.classList.add("playing"); // triggers the power-on; hides cover + button
    // Triggered by a click, so unmuted autoplay is allowed; if a browser still
    // blocks it, fall back to muted playback so the picture isn't frozen.
    const played = video.play();
    if (played && played.catch) {
      played.catch(function () {
        video.muted = true;
        video.play();
      });
    }
  }

  function stopPromo() {
    if (!tv || !promoFrame) return; // no promo TV on this page
    tv.classList.remove("playing");
    promoFrame.innerHTML = ""; // removes the <video> and stops playback
  }

  if (tv && tvPlay && promoFrame) {
    tvPlay.addEventListener("click", startPromo);
  }

  window.addEventListener("hashchange", render);
  render();
})();
