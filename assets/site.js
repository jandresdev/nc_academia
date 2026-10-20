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

  // Protección de contenido (disuasión): sin selección, copia, corte, arrastre, menú contextual, guardar, imprimir, ver código ni
  // herramientas de desarrollo. Los campos del formulario quedan libres para escribir y pegar. Ninguna medida del lado del navegador
  // es infalible; esto frena el copiado habitual y el curioseo, no a quien sabe saltarlo.
  const NOTICE = 'Contenido protegido. © NC AcademIA. Todos los derechos reservados.';
  const inField = target => !!(target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]'));
  const stop = event => { event.preventDefault(); event.stopPropagation(); return false; };
  document.addEventListener('contextmenu', event => { if (!inField(event.target)) stop(event); });
  document.addEventListener('selectstart', event => { if (!inField(event.target)) stop(event); });
  document.addEventListener('dragstart', event => { if (!inField(event.target)) stop(event); });
  ['copy', 'cut'].forEach(type => document.addEventListener(type, event => {
    if (inField(event.target)) return;
    stop(event);
    if (event.clipboardData) event.clipboardData.setData('text/plain', NOTICE); // si algo llega a copiarse, el portapapeles lleva este aviso
  }));
  document.addEventListener('keydown', event => {
    const key = String(event.key || '').toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    if (event.key === 'F12') return stop(event);
    if (ctrl && event.shiftKey && ['i', 'j', 'c', 'k'].includes(key)) return stop(event); // Ctrl/Cmd+Shift+I, J, C, K
    if (event.metaKey && event.altKey && ['i', 'j', 'c', 'u'].includes(key)) return stop(event); // Mac: Cmd+Opt+I, J, C, U
    if (ctrl && ['u', 's', 'p'].includes(key)) return stop(event); // ver código, guardar, imprimir
    if (ctrl && ['c', 'x', 'a'].includes(key) && !inField(event.target)) return stop(event); // copiar, cortar, seleccionar todo
  }, true);

  // Detección de herramientas de desarrollo: con el panel abierto, la instrucción debugger se detiene y el retraso lo delata.
  // Sin el panel abierto no hace nada, así que no hay falsos positivos por zoom ni paneles laterales. Se omite en navegadores automatizados
  // (Lighthouse, pruebas) y los buscadores no la activan. Al detectarla se oculta la página; al cerrar el panel y recargar, vuelve.
  if (!navigator.webdriver) {
    let guard = 0;
    const lock = () => {
      clearInterval(guard);
      document.body.innerHTML = '<main style="min-height:100vh;display:grid;place-content:center;gap:12px;padding:24px;text-align:center;background:#000;color:#fff;font:600 18px/1.5 sans-serif"><strong style="font-size:26px">Contenido protegido</strong><span>Cierra las herramientas de desarrollo y recarga la página.</span></main>';
    };
    const probe = () => { const t = performance.now(); (function () { debugger; })(); if (performance.now() - t > 120) lock(); };
    window.addEventListener('load', () => setTimeout(() => { guard = setInterval(probe, 1500); }, 3000));
  }

  // Botón flotante de WhatsApp y "Hablar con un asesor": enlaces directos (funcionan sin JS); aquí solo se mide el clic.
  document.querySelectorAll('.wa-float, .wa-advisor').forEach(link => link.addEventListener('click', () => {
    emit('whatsapp_click', { course_id: link.dataset.course || 'unknown', placement: link.dataset.placement || 'float', page_path: location.pathname });
  }));

  // Compra: la tienda de Negocios Creativos no tiene enlaces de pago por curso; "Inscribirme ahora" guarda el curso en el carrito del
  // navegador (localStorage "shopping-cart", formato de la tienda) y abre /cart, donde se elige la moneda y se finaliza. Si la landing
  // se sirve desde negocioscreativos.net, se hace lo mismo desde aquí; desde otro dominio no se puede escribir en ese carrito, así que
  // el enlace abre la página de cursos de la tienda con parámetros de seguimiento.
  document.querySelectorAll('.buy-cta').forEach(link => link.addEventListener('click', event => {
    let product = {};
    try { product = JSON.parse(link.dataset.product || '{}'); } catch (e) { product = {}; }
    emit('buy_click', { course_id: link.dataset.course || 'unknown', placement: link.dataset.placement || 'unknown', price: product.price, currency: 'USD', page_path: location.pathname });
    const sameStore = /(^|\.)negocioscreativos\.net$/.test(location.hostname);
    if (link.dataset.direct || !sameStore || !product.id) return; // navegación normal al enlace
    event.preventDefault();
    try {
      const saved = JSON.parse(localStorage.getItem('shopping-cart') || 'null') || { state: { cart: [] }, version: 0 };
      saved.state = saved.state || {};
      saved.state.cart = Array.isArray(saved.state.cart) ? saved.state.cart : [];
      if (!saved.state.cart.some(item => item.id === product.id)) {
        saved.state.cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, description: product.description, type: 'course' });
      }
      localStorage.setItem('shopping-cart', JSON.stringify(saved));
      localStorage.setItem('currency-storage', JSON.stringify({ state: { currency: 'USD' }, version: 0 })); // la landing muestra dólares
    } catch (e) { /* si el almacenamiento falla, el pago se abre igual y la persona elige el curso allí */ }
    window.location.href = '/cart'; // carrito de la tienda con el curso agregado y el botón "Finalizar Compra" (su checkout guarda los datos del cliente que luego usa la confirmación)
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
