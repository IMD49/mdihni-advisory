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
  const revealElements = [...document.querySelectorAll('.section-heading,.section-head-row,.three-pillar article,.service-tile,.approach-layout,.about-teaser-grid,.cta-inner,.detail-card,.method-list article,.values-grid article,.contact-info,.contact-panel')];
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
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal','reveal-pending');
      revealObserver.observe(element);
    });
  }
  const showAll = () => revealElements.forEach(element => {
    element.classList.remove('reveal-pending'); element.classList.add('is-visible');
  });
  reducedMotion.addEventListener('change', event => { if (event.matches) { showAll(); revealObserver?.disconnect(); } });
  window.addEventListener('beforeprint', showAll);
  const scene = document.querySelector('.perspective-scene');
  if (scene) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => scene.classList.toggle('scene-inactive', !entries[0].isIntersecting)).observe(scene);
    }
    document.addEventListener('visibilitychange', () => scene.classList.toggle('scene-inactive', document.hidden));
  }
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
