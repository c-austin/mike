const HOME_SECTIONS = [
    'home'
];

const SITE_SECTIONS = [
    'tour',
    'bio',
    'contact'
];

function handleLocation() {
    var section = window.location.href.split('#')[1];
    if (SITE_SECTIONS.includes(section)) {
        document.querySelector("header").classList.remove("home");
        show(SITE_SECTIONS);
        hide(HOME_SECTIONS);
    } else {
        document.querySelector("header").classList.add("home");
        show(HOME_SECTIONS);
        hide(SITE_SECTIONS);
    }
}

function show(ids) {
    ids.forEach(id => {
        document.getElementById(id).classList.remove('hide');
    });
}

function hide(ids) {
    ids.forEach(id => {
        document.getElementById(id).classList.add('hide');
    });
}

window.addEventListener('load', handleLocation);
window.addEventListener('popstate', handleLocation);

const navToggle = document.querySelector('[aria-controls="primary-nav"]');
const primaryNav = document.querySelector('nav');

const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => link.addEventListener('click', toggleAriaExpanded))

navToggle.addEventListener('click', toggleAriaExpanded);

function toggleAriaExpanded() {
    const classes = Array.from(document.querySelector('header').classList);
    if (classes && classes.includes("home")) {
        return;
    }
    const isNavOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', isNavOpen ? 'false' : 'true');
}

document.getElementById('main-link').addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');

});
