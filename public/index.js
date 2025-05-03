const HOME_SECTIONS = [
    'home'
];

const SITE_SECTIONS = [
    'tour',
    'bio',
    'contact'
];

function handleLocation() {
    console.log("location");
    var section = window.location.href.split('#')[1];
    console.log(section);
    if (SITE_SECTIONS.includes(section)) {
        console.log("site");
        show(SITE_SECTIONS);
        hide(HOME_SECTIONS);
    } else {
        console.log("home");
        show(HOME_SECTIONS);
        hide(SITE_SECTIONS);
    }
}

function show(ids) {
    ids.forEach(id => {
        document.getElementById(id).removeAttribute('hidden');
    });
}

function hide(ids) {
    ids.forEach(id => {
        document.getElementById(id).setAttribute('hidden', true);
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
    console.log("click");
    const isNavOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', isNavOpen ? 'false' : 'true');
}
