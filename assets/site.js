(() => {
  const config = window.NC_LANDING_CONFIG || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const emit = (eventName, detail) => {
    window.dispatchEvent(new CustomEvent(`nc:${eventName}`, { detail }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: `nc_${eventName}`, ...detail });
  };

  // Abre WhatsApp si hay número oficial; si no, un correo con el mensaje precargado.
  const openContact = (course, message) => {
    const number = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (number.length >= 10) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }
    const subject = encodeURIComponent(`Información sobre ${course === 'orientacion' ? 'cursos NC AcademIA' : course}`);
    const body = encodeURIComponent(`${message}\n\nPágina de origen: ${location.href}`);
    window.location.href = `mailto:${config.email || 'direccion@negocioscreativos.net'}?subject=${subject}&body=${body}`;
  };

  // CTA: llevan al formulario de contacto de la misma página.
  document.querySelectorAll('.wa-cta').forEach(link => {
    link.addEventListener('click', event => {
      emit('cta_click', { course_id: link.dataset.course || 'unknown', placement: link.dataset.placement || 'unknown', page_path: location.pathname });
      const target = document.querySelector('#contacto');
      if (target && link.getAttribute('href') === '#contacto') {
        event.preventDefault();
        // Movimiento suave solo en distancias cortas: en una página larga, llegar rápido al formulario pesa más que animar el viaje.
        const far = Math.abs(target.getBoundingClientRect().top) > window.innerHeight * 2;
        target.scrollIntoView({ behavior: reduceMotion || far ? 'instant' : 'smooth', block: 'start' });
        target.querySelectorAll('[data-r]').forEach(el => el.classList.add('in'));
        const first = target.querySelector('input, select, textarea');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), reduceMotion || far ? 0 : 600);
      }
    });
  });

  // Disuasión ligera: sin menú contextual ni arrastre sobre imágenes y video. El texto sigue siendo seleccionable (accesibilidad, copiar el WhatsApp o el correo).
  document.addEventListener('contextmenu', event => { if (event.target.closest && event.target.closest('img, video')) event.preventDefault(); });
  document.addEventListener('dragstart', event => { if (event.target.tagName === 'IMG') event.preventDefault(); });

  // Botón flotante de WhatsApp: enlace directo (funciona sin JS); aquí solo se mide el clic.
  document.querySelectorAll('.wa-float').forEach(link => link.addEventListener('click', () => {
    emit('whatsapp_click', { course_id: link.dataset.course || 'unknown', placement: 'float', page_path: location.pathname });
  }));

  // Formulario de captación: valida, arma el mensaje y abre WhatsApp o correo para que la persona lo revise y lo envíe.
  document.querySelectorAll('form[data-lead]').forEach(form => {
    const setError = (input, text) => {
      const err = form.querySelector(`#${input.id}-err`);
      input.setAttribute('aria-invalid', text ? 'true' : 'false');
      if (err) err.textContent = text || '';
    };
    form.addEventListener('submit', event => {
      event.preventDefault();
      const f = form.elements;
      let ok = true;
      setError(f.nombre, ''); setError(f.contacto, '');
      if (!f.nombre.value.trim()) { setError(f.nombre, 'Escribe tu nombre.'); ok = false; }
      const contact = f.contacto.value.trim();
      const looksEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      const looksPhone = contact.replace(/\D/g, '').length >= 7;
      if (!looksEmail && !looksPhone) { setError(f.contacto, 'Escribe un correo o un teléfono válido.'); ok = false; }
      if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
      const course = form.dataset.course || 'orientacion';
      const courseName = form.dataset.courseName || 'los cursos de NC AcademIA';
      const lines = [
        `Hola, soy ${f.nombre.value.trim()} y quiero información sobre ${courseName}.`,
        `Es ${f.perfil.value}.`,
        `Mi contacto: ${contact}.`,
        f.mensaje.value.trim() ? `Mensaje: ${f.mensaje.value.trim()}` : '',
        '¿Me comparten próximas fechas, modalidad y condiciones?'
      ].filter(Boolean);
      emit('lead_submit', { course_id: course, audience: f.perfil.value, page_path: location.pathname });
      openContact(course, lines.join('\n'));
    });
    form.querySelectorAll('input').forEach(input => input.addEventListener('input', () => setError(input, '')));
  });

  document.querySelectorAll('.menu-toggle').forEach(button => button.addEventListener('click', () => {
    const nav = button.closest('.site-header').querySelector('nav');
    const open = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }));
  document.querySelectorAll('.site-header nav a').forEach(a => a.addEventListener('click', () => {
    const nav = a.closest('nav'); nav.classList.remove('is-open');
    const t = nav.closest('.site-header').querySelector('.menu-toggle');
    if (t) { t.setAttribute('aria-expanded', 'false'); t.setAttribute('aria-label', 'Abrir menú'); }
  }));

  // Entrada de secciones: feedback de jerarquía al llegar a cada bloque.
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-r]').forEach(el => reveal.observe(el));

  // Brillo especular del cristal que sigue al puntero (variables CSS, sin re-render).
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    let frame = 0, last = null;
    document.addEventListener('pointermove', event => {
      last = event;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const glass = last.target.closest && last.target.closest('.glass');
        if (!glass) return;
        const rect = glass.getBoundingClientRect();
        glass.style.setProperty('--mx', `${last.clientX - rect.left}px`);
        glass.style.setProperty('--my', `${last.clientY - rect.top}px`);
      });
    }, { passive: true });
  }

  // Barra fija de CTA en móvil: aparece al salir del hero y se oculta al llegar al formulario.
  const sticky = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contacto');
  if (sticky && hero) {
    let heroGone = false, atForm = false;
    const sync = () => { const on = heroGone && !atForm; sticky.classList.toggle('on', on); document.body.classList.toggle('has-sticky', on); };
    new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; sync(); }, { threshold: 0 }).observe(hero);
    if (contact) new IntersectionObserver(([e]) => { atForm = e.isIntersecting; sync(); }, { threshold: 0.2 }).observe(contact);
  }

  // Medición: vista y profundidad de scroll (50 % y 90 %).
  const seen = new Set();
  const depth = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const percent = entry.target.dataset.scrollDepth;
    if (seen.has(percent)) return;
    seen.add(percent);
    emit(`scroll_${percent}`, { course_id: document.body.dataset.course || 'catalog', page_path: location.pathname });
  }), { threshold: 0.15 });
  const placeMarkers = () => {
    document.querySelectorAll('[data-scroll-depth]').forEach(m => m.remove());
    [50, 90].forEach(percent => {
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true'); marker.dataset.scrollDepth = String(percent);
      marker.style.cssText = `position:absolute;width:1px;height:1px;pointer-events:none;top:${document.documentElement.scrollHeight * percent / 100}px;left:0;`;
      document.body.append(marker); depth.observe(marker);
    });
  };
  window.addEventListener('load', placeMarkers);
  emit('view_landing', { course_id: document.body.dataset.course || 'catalog', page_path: location.pathname, source: new URLSearchParams(location.search).get('utm_source') || 'direct' });
})();
