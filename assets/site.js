/* Progressive enhancement for the existing static website. No trackers or storage. */
(() => {
  'use strict';
  const nl = document.documentElement.lang === 'nl';
  const t = (en, dutch) => nl ? dutch : en;
  let smoothScroll;
  const menuBtn = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  if (menuBtn && mobile) {
    const setMenu = (open, restore = false) => {
      document.body.classList.toggle('menu-open', open);
      if (open) smoothScroll?.stop();
      else smoothScroll?.start();
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? t('Close menu', 'Menu sluiten') : t('Open menu', 'Menu openen'));
      mobile.inert = !open;
      if (main) main.inert = open;
      if (footer) footer.inert = open;
      if (restore) menuBtn.focus();
    };
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') { setMenu(false, true); return; }
      if (event.key === 'Tab') {
        const stops = [menuBtn, ...mobile.querySelectorAll('a')];
        const first = stops[0], last = stops[stops.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    document.addEventListener('click', event => {
      if (menuBtn.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false, true);
    });
    window.matchMedia('(min-width:971px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const header = document.querySelector('.site-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  const root = document.documentElement;
  const beginEntry = () => {
    root.classList.remove('motion-pending');
    if (reducedMotion.matches) return;
    root.classList.add('motion-ready', 'entry-in-progress');
    window.setTimeout(() => root.classList.remove('entry-in-progress'), 1600);
  };
  // Wait for the actual fonts before animating text; avoid a font swap mid-motion.
  Promise.all([document.fonts.load('600 64px Manrope'), document.fonts.load('italic 500 64px Cormorant')])
    .then(() => document.fonts.ready).catch(() => {}).then(beginEntry);
  // Reveal text and cards individually, rather than moving whole sections and their children twice.
  const revealCandidates = [...document.querySelectorAll('.section-heading,.section-head-row,.three-pillar article,.service-tile,.approach-layout>div:first-child,.about-teaser-text,.cta-inner,.detail-card,.method-list article,.values-grid article,.contact-info,.contact-panel,.approach-steps>div,.founding-note,.first-conversation,.editorial-heading,.focus-row,.team-copy,.workspace-copy,.compact-steps article')];
  const revealElements = revealCandidates.filter(element => !revealCandidates.some(parent => parent !== element && parent.contains(element)));
  document.querySelectorAll('.three-pillar,.services-grid,.approach-steps,.values-grid,.method-list,.engagement-principles,.focus-grid,.compact-steps').forEach(group => {
    [...group.children].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`));
  });
  let revealObserver;
  let warmObserver;
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    warmObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.classList.contains('reveal-pending')) entry.target.classList.add('motion-prepared');
      else if (!entry.isIntersecting) entry.target.classList.remove('motion-prepared');
    }), { rootMargin: '200px 0px' });
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-prepared');
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.02 });
    revealElements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) { element.classList.add('is-visible'); return; }
      element.classList.add('reveal','reveal-pending');
      warmObserver.observe(element);
      revealObserver.observe(element);
      element.addEventListener('transitionend', event => {
        if (event.target === element && event.propertyName === 'transform') {
          element.classList.remove('motion-prepared');
          warmObserver.unobserve(element);
        }
      });
    });
  }
  const showAll = () => revealElements.forEach(element => {
    element.classList.remove('reveal-pending', 'motion-prepared'); element.classList.add('is-visible');
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      root.classList.remove('motion-pending', 'entry-in-progress');
      showAll(); revealObserver?.disconnect(); warmObserver?.disconnect();
    }
  });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  // A single passive scroll update, with stable artwork and no per-frame layout reads.
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const progress = document.querySelector('.reading-progress span');
  let motionFrame = 0, scrollLimit = 0;
  const refreshMotion = () => {
    motionFrame = 0;
    if (document.hidden) return;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    const ratio = scrollLimit > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollLimit)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };
  const requestMotion = () => { if (!motionFrame) motionFrame = requestAnimationFrame(refreshMotion); };
  const measurePage = () => {
    scrollLimit = document.documentElement.scrollHeight - window.innerHeight;
    requestMotion();
  };
  window.addEventListener('scroll', requestMotion, { passive: true });
  window.addEventListener('resize', measurePage, { passive: true });
  window.addEventListener('pageshow', measurePage);
  if ('ResizeObserver' in window) new ResizeObserver(measurePage).observe(document.body);
  measurePage();

  // Lenis uses native scroll positions and time-based damping. Run its clock only
  // during actual wheel/anchor movement; leave touch, keyboard and nested controls native.
  let scrollFrame = 0, scrollClock = 0, lastScrollTime = 0;
  const advanceScroll = time => {
    scrollFrame = 0;
    if (!smoothScroll || document.hidden) return;
    // Keep the clock continuous across input, not across idle time. Otherwise
    // a long pause would be interpreted as one huge frame on the next wheel tick.
    scrollClock += lastScrollTime ? Math.min(32, Math.max(0, time - lastScrollTime)) : 0;
    lastScrollTime = time;
    smoothScroll.raf(scrollClock);
    if (smoothScroll.isScrolling === 'smooth') scrollFrame = requestAnimationFrame(advanceScroll);
    else lastScrollTime = 0;
  };
  const wakeScroll = () => {
    if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(advanceScroll);
  };
  const stopAtCurrentPosition = () => {
    cancelAnimationFrame(scrollFrame); scrollFrame = 0; lastScrollTime = 0;
    smoothScroll?.scrollTo(window.scrollY, { immediate: true, force: true });
  };
  const configureScroll = () => {
    stopAtCurrentPosition();
    smoothScroll?.destroy(); smoothScroll = undefined;
    scrollClock = 0;
    document.body.classList.toggle('motion-enhanced', !reducedMotion.matches && finePointer.matches);
    if (reducedMotion.matches || !finePointer.matches || typeof window.Lenis !== 'function') return;
    smoothScroll = new window.Lenis({
      autoRaf: false, lerp: 0.11, smoothWheel: true, syncTouch: false,
      stopInertiaOnNavigate: true, anchors: false,
      prevent: node => node.matches('textarea,select,input,[contenteditable],.mobile-nav,[data-native-scroll]')
    });
    smoothScroll.on('virtual-scroll', wakeScroll);
    if (document.body.classList.contains('menu-open')) smoothScroll.stop();
  };
  configureScroll();
  reducedMotion.addEventListener('change', configureScroll);
  finePointer.addEventListener('change', configureScroll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAtCurrentPosition();
    else { smoothScroll?.resize(); measurePage(); }
  });
  window.addEventListener('pagehide', stopAtCurrentPosition);
  window.addEventListener('pageshow', event => { if (event.persisted) smoothScroll?.resize(); });
  document.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)
        && !event.target.closest('input,textarea,select,[contenteditable]')) stopAtCurrentPosition();
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!smoothScroll || !link || event.defaultPrevented || event.button !== 0
        || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey
        || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, '', url.hash);
    // #top is the sticky header: its live rect stays at y=0 even at the footer.
    smoothScroll.scrollTo(id === 'top' ? 0 : target, {
      onStart: wakeScroll,
      onComplete: () => {
        // Keep anchor navigation useful for keyboard and screen reader users.
        const temporary = !target.hasAttribute('tabindex');
        if (temporary) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    });
  });

  const copy = document.querySelector('[data-copy-email]');
  if (copy) copy.addEventListener('click', async () => {
    const label = copy.querySelector('span');
    try { await navigator.clipboard.writeText('contact@mdihni.com'); label.textContent = t('Copied to clipboard', 'E-mailadres gekopieerd'); }
    catch { label.textContent = t('Email: contact@mdihni.com', 'E-mail: contact@mdihni.com'); }
  });
  const form = document.getElementById('inquiry-form');
  if (form) {
    const copyMessage = document.querySelector('.copy-message');
    const status = document.getElementById('form-status');
    let preparedMessage = '';
    copyMessage.hidden = false;
    // A previous copy confirmation should not remain after the enquiry changes.
    const clearStatus = () => { status.textContent = ''; };
    form.addEventListener('input', clearStatus);
    form.addEventListener('change', clearStatus);
    const prepare = () => {
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const topic = String(data.get('topic') || '').trim();
      const message = String(data.get('message') || '').trim();
      const subject = `${t('Mdihni Advisory enquiry', 'Vraag aan Mdihni Advisory')}: ${topic}`;
      const body = `${t('Name', 'Naam')}: ${name}\n${t('Email', 'E-mail')}: ${email}\n${t('Area of interest', 'Onderwerp')}: ${topic}\n\n${t('Message', 'Bericht')}:\n${message}`;
      preparedMessage = `${t('To', 'Aan')}: contact@mdihni.com\n${t('Subject', 'Onderwerp')}: ${subject}\n\n${body}`;
      return `mailto:contact@mdihni.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const mailto = prepare();
      status.textContent = t('Your email application should open. Send the prepared message from there. If it does not open, use “Copy enquiry instead” and paste it into your email service.', 'Je mailprogramma wordt geopend. Verstuur het klaargezette bericht vanuit je mailprogramma. Opent het niet? Gebruik dan “Kopieer je bericht” en plak het in je e-maildienst.');
      window.location.href = mailto;
    });
    copyMessage.addEventListener('click', async () => {
      if (!form.reportValidity()) return;
      prepare();
      try { await navigator.clipboard.writeText(preparedMessage); status.textContent = t('Enquiry copied. Paste it into your email service and send it to contact@mdihni.com.', 'Je bericht is gekopieerd. Plak het in je e-maildienst en verstuur het naar contact@mdihni.com.'); }
      catch { status.textContent = t('Copy is unavailable in this browser. Please email contact@mdihni.com directly using the details above.', 'Kopiëren is niet beschikbaar in deze browser. Mail rechtstreeks naar contact@mdihni.com met de gegevens hierboven.'); }
    });
  }
})();
