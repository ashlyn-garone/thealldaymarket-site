const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const menuToggleIcon = menuToggle ? menuToggle.querySelector('img') : null;

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', isOpen);
    if (menuToggleIcon) {
      menuToggleIcon.src = isOpen ? 'images/icon-close.svg' : 'images/icon-menu.svg';
    }
  });
}

// --- Scroll-linked motion -------------------------------------------------
// The hero orbit now spins continuously on its own (see the `hero-orbit`
// CSS animation) instead of tracking scroll position. The mobile header
// hide/reveal is still scroll-driven, since showing/hiding is a discrete
// state that has to remember which way the user last scrolled.

const siteHeader = document.querySelector('.site-header');

const DESKTOP_BREAKPOINT = 960; // keep in sync with css/styles.css

let lastScrollY = window.scrollY;
let ticking = false;

function applyScrollEffects() {
  const scrollY = window.scrollY;

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

// --- Scroll reveal ---------------------------------------------------------
// Images marked `.reveal` fade and rise into place the first time they
// enter the viewport, then stay put (no re-triggering on scroll-up).

const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// --- Inquiry forms (request, support) --------------------------------------
// Both forms submit to Web3Forms' JSON API so the page never navigates: on
// success the form is swapped for an inline confirmation, and on failure an
// inline error plus a mailto fallback is shown so a lead is never lost.

document.querySelectorAll('.form').forEach((form) => {
  const submitBtn = form.querySelector('.form__submit');
  const defaultLabel = submitBtn ? submitBtn.textContent : '';
  const statusEl = document.getElementById(form.id + 'Status');
  const successEl = statusEl ? statusEl.querySelector('.form__success') : null;
  const failureEl = statusEl ? statusEl.querySelector('.form__failure') : null;

  function showStatus(el) {
    if (!el) return;
    el.hidden = false;
    // Force a reflow between un-hiding and adding the transition class so
    // the fade/rise actually animates instead of jumping straight to visible.
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  }

  form.querySelectorAll('[required]').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.removeAttribute('aria-invalid');
        const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
        if (errorEl) errorEl.classList.remove('is-visible');
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let hasError = false;
    form.querySelectorAll('[required]').forEach((field) => {
      const valid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!valid));
      const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
      if (errorEl) errorEl.classList.toggle('is-visible', !valid);
      if (!valid) hasError = true;
    });
    if (hasError) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Submission failed');
      }

      form.hidden = true;
      showStatus(successEl);
    } catch (err) {
      showStatus(failureEl);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = defaultLabel;
      }
    }
  });
});
