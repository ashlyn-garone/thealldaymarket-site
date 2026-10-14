const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// --- Scroll-linked motion -------------------------------------------------
// The hero orbit is a pure function of window.scrollY: no scrolling means
// no movement, and scrolling back up naturally reverses the rotation (no
// separate "direction" state needed — it falls out of using scrollY
// directly). The mobile header hide/reveal is the one exception, since
// showing/hiding is a discrete state that has to remember which way the
// user last scrolled.

const heroFloaters = document.querySelector('.hero__floaters');
const siteHeader = document.querySelector('.site-header');

const DEG_PER_PX = 0.15; // hero orbit speed
const DESKTOP_BREAKPOINT = 960; // keep in sync with css/styles.css

let lastScrollY = window.scrollY;
let ticking = false;

function applyScrollEffects() {
  const scrollY = window.scrollY;

  if (heroFloaters) {
    heroFloaters.style.setProperty('--hero-spin', scrollY * DEG_PER_PX + 'deg');
  }

  if (siteHeader) {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) {
      siteHeader.classList.remove('site-header--hidden');
    } else {
      const delta = scrollY - lastScrollY;
      const headerHeight = siteHeader.offsetHeight;
      if (scrollY <= headerHeight) {
        siteHeader.classList.remove('site-header--hidden');
      } else if (delta > 0) {
        siteHeader.classList.add('site-header--hidden');
      } else if (delta < 0) {
        siteHeader.classList.remove('site-header--hidden');
      }
    }
  }

  lastScrollY = scrollY;
  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(applyScrollEffects);
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
applyScrollEffects();
