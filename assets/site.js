/* Progressive enhancement for the existing static website. No trackers or storage. */
(() => {
  'use strict';
  const nl = document.documentElement.lang === 'nl';
  const t = (en, dutch) => nl ? dutch : en;
  const menuBtn = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobile-menu');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  if (menuBtn && mobile) {
    const setMenu = (open, restore = false) => {
      document.body.classList.toggle('menu-open', open);
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
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => { header?.classList.toggle('is-scrolled', window.scrollY > 12); scrollPending = false; });
  }, { passive: true });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
  const revealElements = [...document.querySelectorAll('.section-heading,.section-head-row,.three-pillar article,.service-tile,.approach-layout,.about-teaser-grid,.cta-inner,.detail-card,.method-list article,.values-grid article,.contact-info,.contact-panel,.approach-steps>div,.engagement-principles article,.founding-note,.first-conversation')];
  document.querySelectorAll('.three-pillar,.services-grid,.approach-steps,.values-grid,.method-list,.engagement-principles').forEach(group => {
    [...group.children].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`));
  });
  let revealObserver;
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.classList.remove('reveal-pending');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealElements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) { element.classList.add('is-visible'); return; }
      element.classList.add('reveal','reveal-pending');
      revealObserver.observe(element);
    });
  }
  const showAll = () => revealElements.forEach(element => {
    element.classList.remove('reveal-pending'); element.classList.add('is-visible');
  });
  reducedMotion.addEventListener('change', event => { if (event.matches) { showAll(); revealObserver?.disconnect(); } });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  const scene = document.querySelector('.perspective-scene');
  if (scene) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => scene.classList.toggle('scene-inactive', !entries[0].isIntersecting)).observe(scene);
    }
    document.addEventListener('visibilitychange', () => scene.classList.toggle('scene-inactive', document.hidden));
  }
  // Motion responds to real input. No idle animation loop, no scroll hijacking.
  const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
  const hero = document.querySelector('.home-hero-dark');
  const media = document.querySelector('.about-media');
  const progress = document.querySelector('.reading-progress');
  let motionFrame = 0;
  const refreshMotion = () => {
    motionFrame = 0;
    if (document.hidden) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
    const heroRect = hero?.getBoundingClientRect();
    const mediaRect = media?.getBoundingClientRect();
    const enabled = !reducedMotion.matches && finePointer.matches;
    progress?.style.setProperty('--read-progress', ratio.toFixed(4));
    document.body.classList.toggle('motion-enhanced', enabled);
    if (scene) {
      const offset = enabled && heroRect && heroRect.bottom > 0 ? Math.min(18, Math.max(0, -heroRect.top * .04)) : 0;
      scene.style.setProperty('--scene-scroll', `${offset.toFixed(2)}px`);
    }
    if (media && mediaRect) {
      const visible = mediaRect.top < window.innerHeight && mediaRect.bottom > 0;
      const shift = enabled && visible ? Math.max(-9, Math.min(9, (mediaRect.top - window.innerHeight * .45) * .025)) : 0;
      media.style.setProperty('--media-shift', `${shift.toFixed(2)}px`);
    }
  };
  const requestMotion = () => { if (!motionFrame) motionFrame = requestAnimationFrame(refreshMotion); };
  window.addEventListener('scroll', requestMotion, { passive: true });
  window.addEventListener('resize', requestMotion, { passive: true });
  window.addEventListener('pageshow', requestMotion);
  document.addEventListener('visibilitychange', requestMotion);
  reducedMotion.addEventListener('change', requestMotion);
  finePointer.addEventListener('change', requestMotion);
  if ('ResizeObserver' in window) new ResizeObserver(requestMotion).observe(document.body);
  requestMotion();
  if (hero && scene) {
    let heroFrame = 0, pointerX = 0, pointerY = 0;
    hero.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - .5) * -8;
      pointerY = ((event.clientY - rect.top) / rect.height - .5) * -6;
      if (!heroFrame) heroFrame = requestAnimationFrame(() => {
        heroFrame = 0;
        scene.style.setProperty('--scene-x', `${pointerX.toFixed(2)}px`);
        scene.style.setProperty('--scene-y', `${pointerY.toFixed(2)}px`);
      });
    }, { passive: true });
    const resetHero = () => {
      cancelAnimationFrame(heroFrame); heroFrame = 0;
      scene.style.removeProperty('--scene-x');scene.style.removeProperty('--scene-y');
    };
    hero.addEventListener('pointerleave', resetHero);
    reducedMotion.addEventListener('change', resetHero);
    finePointer.addEventListener('change', resetHero);
  }
  document.querySelectorAll('.service-tile').forEach(card => {
    let frame = 0, rect, x = 0, y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);frame = 0;rect = null;
      ['--glow-x','--glow-y','--tilt-x','--tilt-y'].forEach(key => card.style.removeProperty(key));
    };
    card.addEventListener('pointerenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType !== 'mouse' || !rect) return;
      x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        card.style.setProperty('--glow-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--glow-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--tilt-x', `${((.5-y/rect.height)*2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${((x/rect.width-.5)*2).toFixed(2)}deg`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    reducedMotion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);
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
