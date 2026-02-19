(function () {
  'use strict';

  const VANTA_CONTAINER_ID = 'vanta-container';
  const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
  const DESKTOP_ONLY_QUERY = '(min-width: 768px)';

  /** Switch background: 'dots' or 'clouds' */
  const VANTA_BACKGROUND = 'dots';

  let vantaEffect = null;

  function prefersReducedMotion() {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  function isDesktop() {
    return window.matchMedia(DESKTOP_ONLY_QUERY).matches;
  }

  function initVanta() {
    const el = document.getElementById(VANTA_CONTAINER_ID);
    if (!el || typeof VANTA === 'undefined') return;
    if (prefersReducedMotion()) return;

    destroyVanta();

    if (VANTA_BACKGROUND === 'clouds' && typeof VANTA.CLOUDS === 'function') {
      vantaEffect = VANTA.CLOUDS({
        el: '#' + VANTA_CONTAINER_ID,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200
      });
      return;
    }

    if (typeof VANTA.DOTS === 'function') {
      vantaEffect = VANTA.DOTS({
        el: '#' + VANTA_CONTAINER_ID,
        mouseControls: true,
        touchControls: true,
        gyroControls: true,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x292929,
        color2: 0xb0b0b0,
        backgroundColor: 0xffffff,
        size: 1.4,
        spacing: 21,
        showLines: false
      });
    }
  }

  function destroyVanta() {
    if (vantaEffect && typeof vantaEffect.destroy === 'function') {
      vantaEffect.destroy();
      vantaEffect = null;
    }
  }

  function revealHero() {
    document.querySelectorAll('.hero .reveal').forEach(function (node) {
      node.classList.add('revealed');
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeDrawer();
        }
      });
    });
  }

  function setupNavDrawer() {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      drawer.classList.toggle('open');
      drawer.setAttribute('aria-hidden', expanded);
    });
  }

  function closeDrawer() {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('nav-drawer');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  }

  function renderProjectCard(project, index) {
    const card = document.createElement('article');
    card.className = 'project-card animate-in';
    card.setAttribute('role', 'listitem');

    const url = project.url || '#';
    const linkHtml =
      '<a href="' +
      escapeHtml(url) +
      '" target="_blank" rel="noopener noreferrer" class="project-card-open"><i data-lucide="external-link" aria-hidden="true"></i> Open</a>';

    card.innerHTML =
      '<h3 class="project-card-title">' +
      escapeHtml(project.title) +
      '</h3>' +
      '<p class="project-card-desc">' +
      escapeHtml(project.description) +
      '</p>' +
      '<div class="project-card-links">' +
      linkHtml +
      '</div>';

    card.style.transitionDelay = (index * 0.05) + 's';
    return card;
  }

  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderProjects(gridEl) {
    if (!gridEl || typeof PROJECTS === 'undefined') return;

    PROJECTS.forEach(function (project, index) {
      gridEl.appendChild(renderProjectCard(project, index));
    });

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    setupCardsObserver(gridEl);
  }

  function setupCardsObserver(gridEl) {
    if (!gridEl || !('IntersectionObserver' in window)) {
      gridEl.querySelectorAll('.project-card').forEach(function (c) { c.classList.add('revealed'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });

    gridEl.querySelectorAll('.project-card').forEach(function (card) {
      observer.observe(card);
    });
  }

  function setupProjectsSectionObserver() {
    const section = document.getElementById('projects');
    if (!section || !('IntersectionObserver' in window)) {
      section.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0 });

    observer.observe(section);
  }

  function onResize() {
    if (!isDesktop() && vantaEffect) {
      destroyVanta();
    } else if (isDesktop() && !prefersReducedMotion() && !vantaEffect && document.getElementById(VANTA_CONTAINER_ID)) {
      initVanta();
    }
  }

  function init() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    initVanta();
    setupSmoothScroll();
    setupNavDrawer();
    setupProjectsSectionObserver();

    renderProjects(document.querySelector('.projects-grid'));

    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(function () {
        requestAnimationFrame(revealHero);
      });
    } else {
      setTimeout(revealHero, 100);
    }

    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
