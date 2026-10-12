const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// --- Scroll-linked motion -------------------------------------------------
// Both the hero orbit and the marquee are pure functions of window.scrollY:
// no scrolling means no movement, and scrolling back up naturally reverses
// the motion (no separate "direction" state needed — it falls out of using
// scrollY directly). The mobile header hide/reveal is the one exception,
// since showing/hiding is a discrete state that has to remember which way
// the user last scrolled.

const heroFloaters = document.querySelector('.hero__floaters');
const marqueeTrack = document.getElementById('marqueeTrack');
const marqueeFirstCopy = marqueeTrack ? marqueeTrack.querySelector('.marquee__text') : null;
const siteHeader = document.querySelector('.site-header');

const DEG_PER_PX = 0.15; // hero orbit speed
const MARQUEE_PX_PER_PX = 0.6; // marquee speed, relative to scroll
const DESKTOP_BREAKPOINT = 960; // keep in sync with css/styles.css

let marqueeCopyWidth = 0;
let lastScrollY = window.scrollY;
let ticking = false;

function measureMarqueeCopyWidth() {
  if (marqueeFirstCopy) {
    marqueeCopyWidth = marqueeFirstCopy.getBoundingClientRect().width;
  }
}
measureMarqueeCopyWidth();
window.addEventListener('resize', measureMarqueeCopyWidth);

function applyScrollEffects() {
  const scrollY = window.scrollY;

  if (heroFloaters) {
    heroFloaters.style.setProperty('--hero-spin', scrollY * DEG_PER_PX + 'deg');
  }

  if (marqueeTrack && marqueeCopyWidth > 0) {
    const raw = scrollY * MARQUEE_PX_PER_PX;
    // Wrap into [0, marqueeCopyWidth) so the value stays small over a long
    // scroll, and lands on a pixel-identical frame every time it wraps
    // (the two copies are identical, so shifting by exactly one copy's
    // width is visually seamless).
    const wrapped = ((raw % marqueeCopyWidth) + marqueeCopyWidth) % marqueeCopyWidth;
    marqueeTrack.style.transform = `translateX(${-wrapped}px)`;
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
