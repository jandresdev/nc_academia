import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
// La vista local usa rutas relativas; la salida de publicación conserva /ncacademia/cursos.
const out = path.join(root, process.env.NC_OUTPUT_DIR === 'preview' ? 'preview' : 'dist');
const courses = [
  {
    slug:'ia-facil-para-todos', number:'01', name:'IA fácil para todos', tier:'Emprendedor', category:'Fundamentos', duration:'12 horas',
    audience:'Emprendedores y profesionales que quieren comenzar a usar IA sin conocimientos técnicos previos.',
    title:'Empieza a usar IA con criterio en tu trabajo y negocio.', short:'Una base práctica para organizar, comunicar, investigar y crear con inteligencia artificial, desde cero.',
    pain:'Ves cómo todos hablan de IA, pero no sabes qué herramienta elegir, qué pedirle o cuándo confiar en lo que responde.',
    outcome:'Practica con tareas reales de tu día a día: organiza información, mejora comunicaciones, investiga con fuentes y crea recursos visuales. Aprende también qué revisar y qué información cuidar.',
    modules:[['IA generativa y uso responsable','2 h'],['Prompts, contexto y trabajo diario','4 h'],['Comunicación y productividad','2 h'],['Creación visual y presentaciones','2 h'],['Investigación y aprendizaje continuo','2 h']],
    tools:'ChatGPT, Gemini, Claude, Microsoft Copilot, Gemini Notebook, Canva AI y Nano Banana; disponibilidad y licencias por confirmar.',
    artifact:'Ejercicios aplicados a necesidades reales de los participantes.',
    faqs:[['¿Necesito saber programar?','No. El curso está planteado para comenzar sin conocimientos técnicos previos.'],['¿Qué herramientas se usan?','El programa trabaja con ChatGPT, Gemini, Claude, Microsoft Copilot, Gemini Notebook, Canva AI y Nano Banana. La disponibilidad de funciones cambia; consulta qué cuentas necesitas.'],['¿Cuándo empieza y cuánto cuesta?','Fechas, modalidad exacta y condiciones de inversión están por confirmar. Escríbenos y te compartiremos la información vigente.']]
  },
  {
    slug:'marketing-total-con-ia', number:'02', name:'Marketing Total con IA', tier:'Pro 1', category:'Marketing', duration:'15 horas',
    audience:'Profesionales de marketing, emprendedores y equipos pequeños que gestionan campañas y contenido.',
    title:'Conecta estrategia, contenido y campañas con IA.', short:'Investiga, planea, produce y optimiza marketing digital con un flujo de trabajo asistido por IA.',
    pain:'Investigas, publicas, diseñas y pautas en tareas separadas. Mantener un mensaje coherente y saber qué mejorar se vuelve difícil.',
    outcome:'Trabaja sobre un caso práctico: audiencia, propuesta de valor, calendario editorial, activos web, creatividad, video corto y lectura de resultados.',
    modules:[['Diagnóstico y objetivos','1 h'],['Fundamentos de publicidad digital (pregrabado)','2 h'],['Redes sociales y estrategia de contenido','4 h'],['IA aplicada al marketing y web','2 h'],['Producción visual a escala','2 h'],['Video corto con CapCut e IA','2 h'],['Publicidad y optimización','2 h']],
    tools:'ChatGPT, Gemini, Claude, Canva AI, CapCut, Meta Ads, TikTok Ads y Google Ads; alcance por plataforma y licencias por confirmar.',
    artifact:'Caso práctico de marketing trabajado desde diagnóstico hasta campaña y métricas.',
    faqs:[['¿Es solo un curso de prompts?','No. El programa recorre investigación, estrategia, contenidos, web, creatividad, publicidad y métricas.'],['¿Las clases técnicas son en vivo?','Dos horas de fundamentos de publicidad son pregrabadas. Confirma cómo se integran con el horario de la cohorte.'],['¿En qué plataformas haré campañas?','El programa contempla Meta, TikTok y Google Ads. El alcance práctico de cada plataforma se confirma al solicitar información.']]
  },
  {
    slug:'diseno-creativo-con-ia', number:'03', name:'Diseño Creativo con IA', tier:'Pro 1', category:'Diseño', duration:'14 horas',
    audience:'Diseñadores, creadores de contenido y equipos que producen comunicación visual.',
    title:'Crea un sistema visual coherente, no imágenes sueltas.', short:'Combina fundamentos de diseño, Canva, CapCut y herramientas generativas para crear contenido consistente.',
    pain:'Generar piezas rápido no garantiza que mantengan jerarquía, legibilidad o coherencia con la marca.',
    outcome:'Practica criterios visuales, genera y adapta piezas, edita videos y desarrolla una campaña final en formatos para los canales elegidos.',
    modules:[['Fundamentos de diseño y Canva Pro','2 h'],['Canva AI y diseño eficiente','2 h'],['CapCut Pro y video','4 h'],['Generación visual y consistencia','2 h'],['Proyecto final y optimización','4 h']],
    tools:'Canva Pro, CapCut Pro, Nano Banana, ChatGPT/Gemini/Claude, Affinity o Illustrator y Krea u otras herramientas según el caso. Licencias por confirmar.',
    artifact:'Campaña visual final con piezas estáticas y video, lista para exportación en formatos de destino.',
    faqs:[['¿Debo ser diseñador profesional?','El programa incluye fundamentos visuales, y aún no define un nivel previo requerido. Cuéntanos tu experiencia para orientarte.'],['¿Incluye las licencias de Canva o CapCut?','Las licencias incluidas se confirman por cohorte. Confirma qué cuentas o planes necesitas antes de iniciar.'],['¿Qué programas vectoriales se utilizan?','Se usa Affinity o Illustrator según la necesidad del proyecto.']]
  },
  {
    slug:'publicidad-digital-ads', number:'04', name:'Publicidad Digital para Ads', tier:'Pro 2', category:'Publicidad', duration:'14 horas',
    audience:'Profesionales de pauta, emprendedores y equipos que quieren planear o mejorar campañas digitales.',
    title:'Planea y optimiza campañas con datos, creatividad e IA.', short:'Aprende a estructurar campañas, probar anuncios y leer señales de rendimiento en plataformas digitales.',
    pain:'Activar anuncios no basta: hacen falta objetivos claros, audiencias, presupuesto, medición y un canal de seguimiento.',
    outcome:'Conecta preparación de cuentas, campañas, creatividad, lectura de métricas y un plan de optimización alrededor del caso del participante.',
    modules:[['Fundamentos técnicos y preparación (pregrabado)','2 h'],['Meta Ads e Instagram Ads','4 h'],['TikTok Ads o Google Ads con IA','4 h'],['Optimización y análisis','2 h'],['Estrategia y embudo de conversión','2 h']],
    tools:'Meta Ads, Instagram Ads, TikTok Ads o Google Ads, modelos de IA, Canva AI y herramientas de analítica según el caso.',
    artifact:'Campaña conectada a landing, WhatsApp o canal de cierre y plan de optimización de 30 días.',
    faqs:[['¿Se ven TikTok Ads y Google Ads?','El programa trabaja TikTok Ads o Google Ads según el caso. Confirma la ruta de plataforma antes de inscribirte.'],['¿Necesito presupuesto de pauta?','Si se requiere invertir en anuncios durante la práctica se confirma por cohorte. Consulta las condiciones al solicitar información.'],['¿La preparación es en vivo?','Los fundamentos técnicos son pregrabados. Confirma su integración con las horas programadas.']]
  },
  {
    slug:'ia-para-administrativos', number:'05', name:'IA para Administrativos', tier:'Team', category:'Administración', duration:'14 horas',
    audience:'Asistentes, coordinadores y equipos administrativos.',
    title:'Más orden y capacidad de respuesta en la gestión administrativa.', short:'Aplica IA a documentos, comunicaciones, solicitudes y procesos repetitivos con revisión humana.',
    pain:'Correos, documentos, actas y requerimientos dispersan la información y dejan poco espacio para mejorar los procesos.',
    outcome:'Organiza información, prepara comunicaciones consistentes, diseña criterios de respuesta y prueba una automatización básica con controles.',
    modules:[['Fundamentos de IA para administración','2 h'],['Organización de información y documentos','2 h'],['Comunicación administrativa eficiente','4 h'],['Respuestas y requerimientos','2 h'],['Flujos de trabajo y automatización','4 h']],
    tools:'ChatGPT, Gemini, Claude, Microsoft Copilot, Google Workspace, Workspace Skills y Make. La ruta depende del ecosistema de la empresa.',
    artifact:'Mapeo de un proceso administrativo y prueba de un flujo según las necesidades del cliente.',
    faqs:[['¿Se adapta a Microsoft o Google?','El programa contempla Microsoft Copilot o Google Workspace según el ecosistema del cliente. La ruta se define al conversar.'],['¿Se automatizan procesos de mi empresa?','El programa propone mapear y probar flujos básicos. Las integraciones se acuerdan según las plataformas y políticas de seguridad.'],['¿La inversión es para todo el equipo?','La unidad de cobro se confirma al cotizar. Solicita cotización indicando cuántas personas participarán.']]
  },
  {
    slug:'automatizacion-y-agentes-ia', number:'06', name:'Automatización y Agentes de IA', tier:'PRO', category:'Automatización', duration:'14 horas',
    audience:'Profesionales y equipos con procesos repetitivos que desean explorar automatización con control humano.',
    title:'Diseña automatizaciones y agentes que trabajen contigo.', short:'Conecta contexto, instrucciones, herramientas y acciones para resolver tareas reales con pruebas y supervisión.',
    pain:'Un flujo conectado puede fallar si no tiene permisos, validaciones o una forma segura de escalar cuando algo sale mal.',
    outcome:'Distingue asistentes, workflows y agentes; diseña un flujo conectado, lo prueba y define controles, mantenimiento y supervisión.',
    modules:[['Arquitectura de agentes: contexto y herramientas','2 h'],['Gestión administrativa: el auditor','2 h'],['Gestión comercial: el vendedor técnico','2 h'],['Planeación y producción: el coordinador','2 h'],['Automatización con Make','4 h'],['Despliegue, evaluación y supervisión','2 h']],
    tools:'Make, Google AI Studio/Gemini, ChatGPT Work, Agents API, Claude Cowork, Workspace Skills y asistentes personalizados. Disponibilidad y nombres pueden cambiar.',
    artifact:'Diseño de un flujo real del participante con pruebas, fallback humano y plan de mantenimiento.',
    faqs:[['¿Construiré un agente?','El programa incluye diseño de agentes, automatización y supervisión. El alcance depende del caso y de las herramientas disponibles.'],['¿Debo pagar licencias?','Los planes incluidos se confirman por cohorte. Solicita los requisitos vigentes antes de iniciar.'],['¿Las herramientas del temario siguen vigentes?','Los nombres y las funciones de productos cambian; NC AcademIA debe confirmar el temario y las herramientas de cada cohorte.']]
  },
  {
    slug:'ia-para-comerciales', number:'07', name:'IA para Comerciales', tier:'Team', category:'Ventas', duration:'14 horas',
    audience:'Vendedores, asesores, líderes comerciales y equipos de ventas.',
    title:'Vende mejor con IA sin perder el toque humano.', short:'Investiga, prepara, responde, propone y da seguimiento con un proceso comercial más organizado.',
    pain:'Investigar cuentas, preparar conversaciones, resolver objeciones y registrar seguimientos exige continuidad entre herramientas.',
    outcome:'Practica investigación con fuentes, mensajes adaptados, propuestas, análisis comercial y automatización supervisada del seguimiento.',
    modules:[['Fundamentos comerciales y diagnóstico (pregrabado)','2 h'],['Prospección e investigación con IA','2 h'],['Comunicación, objeciones y propuestas','4 h'],['Análisis comercial con IA','2 h'],['Automatización del seguimiento y CRM','4 h']],
    tools:'ChatGPT, Gemini, Claude, CRM del cliente, Make, Google Workspace/Microsoft 365 y Canva AI si aplica.',
    artifact:'Copiloto comercial y flujo de calificación o seguimiento bajo supervisión.',
    faqs:[['¿Se integra con nuestro CRM?','El programa considera el CRM del cliente, pero una integración depende de la plataforma, los permisos y el alcance acordado.'],['¿Sirve para un profesional individual?','El contenido aborda el ciclo comercial; consulta qué formatos individuales o de equipo están disponibles.'],['¿La inversión de USD 684 es por persona o grupo?','La unidad de cobro se confirma antes de cotizar.']]
  },
  {
    slug:'ia-para-finanzas', number:'08', name:'IA para Finanzas', tier:'Premium', category:'Finanzas', duration:'Por confirmar',
    audience:'Profesionales de finanzas, contabilidad, planeación y gestión.',
    title:'Convierte tus datos financieros en decisiones mejor informadas.', short:'Usa IA para preparar datos, comparar periodos, explorar escenarios e informar hallazgos sin delegar el criterio financiero.',
    pain:'Los datos financieros pueden tener faltantes o inconsistencias y cualquier conclusión necesita supuestos visibles y validación.',
    outcome:'Prepara datos, analiza variaciones, explora presupuestos y escenarios y crea reportes recurrentes con trazabilidad.',
    modules:[['Fundamentos de IA aplicada a finanzas','2 h'],['Herramientas actuales de IA','2 h'],['Preparación y análisis de datos financieros','4 h'],['Planeación y proyección financiera','4 h'],['Reportes, automatización y proyecto aplicado','4 h']],
    tools:'ChatGPT, Gemini, Claude, Microsoft Copilot, Excel, Google Sheets y herramientas de visualización según el caso.',
    artifact:'Proyecto aplicado a una necesidad financiera real, con revisión humana y trazabilidad.',
    faqs:[['¿Cuántas horas dura?','El curso dura 16 horas.'],['¿La IA toma decisiones por mí?','El enfoque descrito es de apoyo al análisis. La validación y el criterio financiero permanecen en las personas responsables.'],['¿Qué datos puedo usar en las prácticas?','No compartas información confidencial con herramientas externas sin autorización de tu organización. El tratamiento de datos se debe acordar antes del curso.']]
  },
  {
    slug:'ia-para-gerentes', number:'09', name:'IA para Gerentes', tier:'Premium', category:'Liderazgo', duration:'15 horas',
    audience:'Gerentes, directivos, líderes de área y propietarios de empresas.',
    title:'Lidera con IA: decide qué delegar y qué supervisar.', short:'Incorpora IA en tareas, análisis y procesos manteniendo criterio ejecutivo y control humano.',
    pain:'No todas las decisiones o procesos se deben delegar a una herramienta; el liderazgo define dónde asistir, automatizar o mantener control.',
    outcome:'Evalúa herramientas, practica rutinas ejecutivas, analiza información y elabora un mapa de delegación y adopción.',
    modules:[['Diagnóstico ejecutivo','1 h'],['IA para líderes: ecosistema, modelos y criterio','4 h'],['Automatización de tareas ejecutivas','2 h'],['Análisis de datos para decisiones','4 h'],['Gestión de conocimiento organizacional','2 h'],['Liderazgo con agentes y hoja de ruta','2 h']],
    tools:'ChatGPT Work, Gemini/Workspace Skills, Claude Cowork, Microsoft Copilot y herramientas de análisis/automatización según la empresa.',
    artifact:'Mapa de delegación entre automatización, asistencia, supervisión humana y una hoja de ruta de adopción a 90 días.',
    faqs:[['¿Es un curso técnico?','El programa se enfoca en liderazgo, criterio, procesos y decisiones; no está descrito como curso de programación.'],['¿Se usan datos de mi empresa?','El trabajo puede considerar retos propios. Acordaremos qué información se puede compartir y qué políticas internas aplicar.'],['¿Qué herramientas están incluidas?','El programa nombra varias plataformas; las licencias incluidas se confirman por cohorte. Confirma acceso y herramientas vigentes.']]
  },
  {
    slug:'ia-360-para-empresas', number:'10', name:'IA 360 para empresas', tier:'President', category:'Empresas', duration:'36 horas',
    audience:'Empresas que quieren formar equipos y explorar IA en varias áreas y procesos.',
    title:'Lleva la IA a distintas áreas de tu empresa.', short:'Un programa integral para explorar productividad, marketing, ventas, datos, automatización y agentes con criterio humano.',
    pain:'La adopción aislada de herramientas puede dejar desconectados los procesos, los datos, los permisos y los criterios de cada área.',
    outcome:'Recorre fundamentos y uso responsable hasta casos por área, automatización y un proyecto de implementación empresarial.',
    modules:[['Fundamentos, uso responsable y prompting','4 h'],['Investigación, conocimiento y documentos','4 h'],['Productividad y administración','4 h'],['Marketing y contenido','4 h'],['Diseño y producción multimedia','4 h'],['Ventas y servicio al cliente','4 h'],['Datos y finanzas','4 h'],['Automatización de procesos','4 h'],['Agentes y proyecto IA 360','4 h']],
    tools:'ChatGPT, Gemini, Claude, Microsoft Copilot, Google Workspace, Canva AI, CapCut, Make, Excel/Sheets y sistemas de la empresa según necesidad.',
    artifact:'Proyecto IA 360 y plan de implementación definidos a partir de necesidades empresariales.',
    faqs:[['¿Qué significa “hasta 3 estudiantes”?','Confirmaremos cómo aplica ese límite a un programa empresarial, además de cupos y opciones para equipos mayores.'],['¿Qué incluye la modalidad híbrida?','La proporción presencial y virtual, y los horarios, se acuerdan con la empresa.'],['¿Cuál es la inversión de USD 2.000?','Se presenta como precio de lanzamiento; la unidad, la vigencia y las condiciones se confirman al solicitar información.'],['¿Se personaliza por área?','El programa contempla herramientas de la empresa según necesidad. El diagnóstico debe definir casos y sistemas posibles.']]
  }
];
const editorial = {
  'ia-facil-para-todos':['De la curiosidad a la primera aplicación útil.','Empieza con tareas que ya tienes.'],
  'marketing-total-con-ia':['Publicar más no equivale a comunicar mejor.','Conecta la estrategia con cada pieza.'],
  'diseno-creativo-con-ia':['Una imagen atractiva necesita una idea detrás.','Diseña una campaña con coherencia.'],
  'publicidad-digital-ads':['Cada anuncio necesita una hipótesis clara.','Planea, prueba y aprende de las señales.'],
  'ia-para-administrativos':['El orden abre espacio para hacer mejor el trabajo.','Convierte tareas dispersas en un flujo claro.'],
  'automatizacion-y-agentes-ia':['Automatizar exige diseñar también el control.','Construye flujos que puedas supervisar.'],
  'ia-para-comerciales':['Vender mejor empieza por entender mejor.','Prepara conversaciones y seguimiento con criterio.'],
  'ia-para-finanzas':['Los datos necesitan contexto antes de decidir.','Analiza con trazabilidad y revisión humana.'],
  'ia-para-gerentes':['La adopción de IA empieza con una decisión de liderazgo.','Traza una ruta clara para delegar y supervisar.'],
  'ia-360-para-empresas':['Una empresa no cambia con herramientas aisladas.','Conecta personas, procesos y oportunidades.']
};

// Una frase corta y verificable por curso: lo que la persona se lleva (viene de la ficha del curso).
const cue = {
  'ia-facil-para-todos':'Sin conocimientos técnicos previos',
  'marketing-total-con-ia':'Un caso práctico de principio a fin',
  'diseno-creativo-con-ia':'Una campaña visual final en varios formatos',
  'publicidad-digital-ads':'Un plan de optimización de 30 días',
  'ia-para-administrativos':'Un proceso real mapeado y probado',
  'automatizacion-y-agentes-ia':'Un flujo con pruebas y respaldo humano',
  'ia-para-comerciales':'Un copiloto comercial con supervisión',
  'ia-para-finanzas':'Un proyecto con revisión y trazabilidad',
  'ia-para-gerentes':'Una hoja de ruta de adopción a 90 días',
  'ia-360-para-empresas':'Un plan de implementación para tu empresa'
};

// URL pública base (canonical, sitemap, Open Graph). Para publicar en otro dominio: SITE_URL=https://mi-dominio.com npm run build
const SITE = (process.env.SITE_URL || 'https://www.negocioscreativos.net/ncacademia/cursos').replace(/\/+$/,'');
// Modo tienda: las landings se publican bajo la misma ruta de la tienda (https://www.negocioscreativos.net/ncacademia/cursos/<curso>, sin barra
// final, como hace su Next.js) mediante un rewrite de la tienda hacia este despliegue. Es el modo por defecto, porque Vercel lee vercel.json del
// repositorio y debe corresponder a esta estructura. Así el navegador ve todo bajo negocioscreativos.net y el botón de compra puede escribir
// en el carrito de la tienda. Para generar la versión autónoma (catálogo en la raíz, rutas relativas): PUBLISH_BASE="" npm run build.
const PUBLISH_BASE = (process.env.PUBLISH_BASE ?? '/ncacademia/cursos').replace(/\/+$/,'');
const SLASH = PUBLISH_BASE ? '' : '/';
const ROOT_URL = `${SITE}${SLASH}`;
// WhatsApp oficial (+57 3112093653): solo dígitos con prefijo. Mantener igual que assets/config.js.
const WHATSAPP = '573112093653';
// Glifo oficial de WhatsApp (Simple Icons, CC0), en blanco; se incrusta en línea para no depender de archivos externos.
const waIcon = fs.readFileSync(path.join(root,'assets','brand','icons','whatsapp.svg'),'utf8').replace('<svg ','<svg aria-hidden="true" focusable="false" ').replace(/<title>.*?<\/title>/,'');
// Botón flotante de WhatsApp: enlace directo a wa.me con mensaje precargado según la página.
const floatWa = c => { const msg = c ? `Estoy interesad@ en curso personalizado de ${c.name}.` : 'Quiero más información de la academia y sus cursos.';
  return `<a class="wa-float" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener noreferrer" data-course="${esc(c?c.slug:'orientacion')}" aria-label="Escribir por WhatsApp" title="Escribir por WhatsApp">${waIcon}<span>Escríbenos por WhatsApp</span></a>`; };
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
// Título con la palabra clave "curso" y el país; "con IA" solo si cabe sin pasar de ~62 caracteres.
const title = c => { const withIA = `${c.name}${/\bIA\b/.test(c.name) ? '' : ' con IA'}: curso en Colombia | NC AcademIA`; return withIA.length <= 62 ? withIA : `${c.name}: curso en Colombia | NC AcademIA`; };
// Descripción de 70-160 caracteres: la frase del curso más un cierre con la intención de búsqueda, si cabe.
const desc = c => { const tail = ' Curso práctico de IA en Colombia.'; return (c.short + tail).length <= 160 ? c.short + tail : c.short; };
const media = (c, prefix='../') => `${prefix}assets/media/${c.slug}.webp`;
const media800 = (c, prefix='../') => `${prefix}assets/media/${c.slug}-800.webp`;
const imgSet = (c, prefix='../') => `srcset="${media800(c,prefix)} 800w, ${media(c,prefix)} 1344w"`;
const lower = s => s.charAt(0).toLowerCase() + s.slice(1);

// ---- Venta: datos descriptivos de la tienda y ofertas vigentes de Hotmart ----
// Los importes USD se leyeron de la opción USD/PayPal de los diez checkouts el 23/10/2026.
// El precio en COP que muestra Hotmart para otros medios puede variar; no se deriva del tipo de cambio de commerce.json.
const commerceFile = JSON.parse(fs.readFileSync(path.join(root,'assets','commerce.json'),'utf8'));
const payLinks = JSON.parse(fs.readFileSync(path.join(root,'assets','payment-links.json'),'utf8'));
for (const c of courses) {
  const offer = payLinks[c.slug];
  if (!commerceFile.products[c.slug] || !offer || !/^https:\/\/pay\.hotmart\.com\/[A-Z0-9]+$/.test(offer.url) || !Number.isFinite(offer.priceUSD) || offer.priceUSD <= 0) {
    throw new Error(`Falta una oferta Hotmart válida para ${c.slug}`);
  }
}
const shop = c => ({...commerceFile.products[c.slug], priceUSD:payLinks[c.slug].priceUSD});
for (const c of courses) { const p = shop(c); if (p && p.hoursLabel) c.duration = p.hoursLabel; } // la página de venta manda en horas
const fmtUSD = n => `USD ${n.toLocaleString('es-CO',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
// Destino de "Programas" y "Ver todos los cursos": por ahora el catálogo de este mismo despliegue; cuando la tienda enlace las landings, cambiarlo al catálogo de la tienda.
const CATALOG_URL = process.env.CATALOG_URL || 'https://ncacademia.vercel.app/';
const directLink = c => payLinks[c.slug].url;
const buyHref = c => directLink(c);
const buy = (c, placement, label='Inscribirme ahora') => `<a class="button button--red buy-cta" href="${buyHref(c)}" target="_blank" rel="noopener noreferrer" data-course="${esc(c.slug)}" data-placement="${esc(placement)}" data-price="${shop(c).priceUSD}">${label} <span aria-hidden="true">↗</span></a>`;
const advisorMsg = c => c ? `Estoy interesad@ en curso personalizado de ${c.name}.` : 'Quiero más información de la academia y sus cursos.';
const advisor = (c, placement) => `<a class="button button--ghost wa-advisor" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(advisorMsg(c))}" target="_blank" rel="noopener noreferrer" data-course="${esc(c?c.slug:'orientacion')}" data-placement="${esc(placement)}">Hablar con un asesor</a>`;
const cardSet = (c, prefix='../') => `src="${prefix}assets/media/card-${c.slug}-480.webp" srcset="${prefix}assets/media/card-${c.slug}-480.webp 480w, ${prefix}assets/media/card-${c.slug}.webp 900w"`;
// Énfasis en las dos últimas palabras del titular, en la misma familia tipográfica (cursiva roja).
const emph = t => { const w = t.split(' '); if (w.length < 4) return esc(t); return `${esc(w.slice(0,-2).join(' '))} <em>${esc(w.slice(-2).join(' '))}</em>`; };

const header = (c, canonical, isIndex=false) => { const a=isIndex?'assets/':'../assets/';
  const ogTitle = isIndex ? 'IA aplicada al trabajo y los negocios | NC AcademIA' : title(c);
  const ogDesc = isIndex ? 'Formación práctica en inteligencia artificial para profesionales y empresas.' : desc(c);
  const ogImage = `${SITE}/assets/og/${isIndex ? 'home' : c.slug}.jpg`;
  const ogAlt = isIndex ? 'GUIA, el personaje de NC AcademIA, junto al logo de NC AcademIA' : `Escena profesional del curso ${c.name} con el logo de NC AcademIA`;
  return `<!doctype html>
<html lang="es-CO"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#000000"><meta name="color-scheme" content="dark">
<title>${esc(isIndex?'Cursos de inteligencia artificial aplicada | NC AcademIA':title(c))}</title>
<meta name="description" content="${esc(isIndex?'Cursos de inteligencia artificial aplicada para profesionales y empresas en Colombia. Encuentra una ruta práctica para tu rol.':desc(c))}">
<meta name="author" content="NC AcademIA"><meta name="copyright" content="NC AcademIA, unidad académica de Negocios Creativos. Todos los derechos reservados."><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="es-CO" href="${canonical}"><link rel="alternate" hreflang="x-default" href="${canonical}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta property="og:type" content="website"><meta property="og:locale" content="es_CO"><meta property="og:site_name" content="NC AcademIA">
<meta property="og:title" content="${esc(ogTitle)}"><meta property="og:description" content="${esc(ogDesc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${ogImage}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(ogAlt)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(ogTitle)}"><meta name="twitter:description" content="${esc(ogDesc)}"><meta name="twitter:image" content="${ogImage}"><meta name="twitter:image:alt" content="${esc(ogAlt)}">
<script>document.documentElement.classList.add('js')</script>
<link rel="preload" href="${a}fonts/amaranth-700.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${a}fonts/mulish-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${a}site.css"><link rel="icon" href="${a}brand/favicon.ico" sizes="16x16 32x32 48x48"><link rel="icon" href="${a}brand/favicon.png" type="image/png" sizes="64x64"><link rel="apple-touch-icon" href="${a}brand/apple-touch-icon.png">
</head>`; };

const cta = (c, placement, label='Pedir información') =>
  `<a class="button button--red wa-cta" href="#contacto" data-course="${esc(c?c.slug:'orientacion')}" data-placement="${esc(placement)}">${label} <span aria-hidden="true">↗</span></a>`;

// Logo de Negocios Creativos (empresa matriz): solo en el home, junto al de NC AcademIA.
const parentLogo = p => `<span class="brand-sep" aria-hidden="true"></span><a class="brand brand-parent" href="https://www.negocioscreativos.net/" aria-label="Negocios Creativos"><img src="${p}brand/logos/negocios-creativos-horizontal-blanco.png" alt="Negocios Creativos" width="117" height="24"></a>`;

const nav = (c, isIndex) => { const home = isIndex ? '' : '../index.html'; const p = isIndex ? 'assets/' : '../assets/';
  return `<header class="site-header"><div class="bar glass"><div class="brands"><a class="brand" href="${isIndex?'index.html':'../index.html'}" aria-label="NC AcademIA, inicio"><img src="${p}brand/logos/nc-academia-horizontal-negativo.png" alt="NC AcademIA" width="150" height="42"></a>${isIndex?parentLogo(p):''}</div><nav id="menu"><a href="${home}#programas">Programas</a><a href="${home}#metodo">Cómo aprendemos</a>${isIndex ? '<a class="button button--red button--sm" href="#programas">Ver cursos</a>' : buy(c,'nav').replace('button--red','button--red button--sm')}</nav><button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span aria-hidden="true">☰</span></button></div></header>`; };

// GUIA: personaje institucional del manual 2026 (embajador visual). Imagen original del manual, sin alterar.
const guiaFigure = p => `<figure class="guia-card glass" data-r><img src="${p}assets/brand/guia/guia-ejecutivo-16x9.webp" width="960" height="540" loading="lazy" alt="GUIA, el personaje de NC AcademIA, trabajando en su computador"><figcaption>GUIA, el embajador de NC AcademIA</figcaption></figure>`;

const leadForm = c => { const slug = c ? c.slug : 'orientacion'; const name = c ? c.name : 'los cursos de NC AcademIA';
  return `<form class="lead-form glass" data-lead data-course="${esc(slug)}" data-course-name="${esc(name)}" novalidate aria-labelledby="lead-title" data-r>
<h3 id="lead-title">${c ? '¿Prefieres hablar con un asesor?' : 'Cuéntanos qué quieres lograr'}</h3>
<div class="field"><label for="f-nombre">Tu nombre</label><input id="f-nombre" name="nombre" autocomplete="name" required aria-describedby="f-nombre-err"><p class="err" id="f-nombre-err" role="alert"></p></div>
<div class="field"><label for="f-contacto">Correo o WhatsApp</label><input id="f-contacto" name="contacto" autocomplete="email" placeholder="nombre@correo.com o tu número" required aria-describedby="f-contacto-err"><p class="err" id="f-contacto-err" role="alert"></p></div>
<div class="field"><label for="f-perfil">¿Para quién es?</label><select id="f-perfil" name="perfil"><option value="para mí">Para mí</option><option value="para mi equipo o empresa">Para mi equipo o empresa</option></select></div>
<div class="field"><label for="f-mensaje">Mensaje (opcional)</label><textarea id="f-mensaje" name="mensaje" rows="2" placeholder="Tu rol, tu reto o lo que quieres resolver"></textarea></div>
<button class="button button--red" type="submit">Pedir información <span aria-hidden="true">↗</span></button>
<p class="privacy">Al enviar se abre tu WhatsApp o tu correo con este mensaje, para que lo revises antes de mandarlo. Esta página no guarda tus datos.</p>
</form>`; };

const footer = (isIndex) => { const p = isIndex ? 'assets/' : '../assets/'; return `<footer class="site-footer"><div class="brands"><a class="brand" href="${isIndex?'index.html':'../index.html'}" aria-label="NC AcademIA, inicio"><img src="${p}brand/logos/nc-academia-horizontal-negativo.png" alt="NC AcademIA" width="150" height="42"></a>${isIndex?parentLogo(p):''}</div><p>Inteligencia artificial aplicada al trabajo real. El futuro se aprende haciendo.</p><div><a href="mailto:direccion@negocioscreativos.net">direccion@negocioscreativos.net</a><a href="https://www.negocioscreativos.net/ncacademia">Negocios Creativos ↗</a></div><small>© 2026 NC AcademIA, unidad académica de Negocios Creativos · Cali, Colombia</small></footer>`; };

// ---- Datos estructurados (schema.org): organización, sitio, ruta de navegación, curso y preguntas frecuentes ----
const ORG_ID = `${SITE}/#organization`;
const orgNode = {"@type":"EducationalOrganization","@id":ORG_ID,name:"NC AcademIA",alternateName:"NC Academia",url:"https://www.negocioscreativos.net/ncacademia",logo:{"@type":"ImageObject",url:`${SITE}/assets/brand/logos/nc-academia-horizontal-color.png`},description:"NC AcademIA es la unidad académica de Negocios Creativos: formación práctica en inteligencia artificial aplicada para profesionales y empresas en Colombia.",slogan:"La IA se aprende aplicándola.",parentOrganization:{"@type":"Organization",name:"Negocios Creativos",url:"https://www.negocioscreativos.net/"},areaServed:{"@type":"Country",name:"Colombia"},address:{"@type":"PostalAddress",addressLocality:"Cali",addressCountry:"CO"},contactPoint:[{"@type":"ContactPoint",contactType:"customer support",telephone:"+573112093653",email:"direccion@negocioscreativos.net",availableLanguage:"es"}]};
const faqNode = items => ({"@type":"FAQPage",mainEntity:items.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))});
const isoHours = d => { const m = /(\d+)\s*horas?/.exec(d); return m ? `PT${m[1]}H` : undefined; };
const certFaq = ['¿Qué certificado entrega el curso?','Se presenta como curso certificado. El emisor y los requisitos del certificado se confirman al inscribirte.'];
const indexFaqs = [
  ['¿Necesito conocimientos técnicos?','Varios cursos están diseñados para aplicar IA a roles de negocio sin aprender programación. Revisa la página del curso elegido y consúltanos si tienes dudas.'],
  ['¿Los cursos son para personas o empresas?','Hay contenidos para profesionales y opciones de capacitación para equipos. La disponibilidad, el tamaño de grupo y la adaptación se confirman según el programa.'],
  ['¿Cuánto cuestan y cómo me inscribo?','Cada curso muestra el importe en USD de su enlace de Hotmart. Pulsa «Inscribirme ahora» para abrir el pago del curso. Según el país y el medio de pago, Hotmart puede mostrar y cobrar en COP. Las fechas de cada grupo se confirman por cohorte.'],
  ['¿Entregan certificado?','Algunos programas se presentan como cursos certificados. El emisor y los requisitos se confirman para cada curso.']
];

function page(c, index){
  const canonical = `${SITE}/${c.slug}${SLASH}`;
  const p = shop(c);
  const price = fmtUSD(p.priceUSD);
  const howFaq = ['¿Cómo me inscribo y pago?','Pulsa «Inscribirme ahora» para abrir el checkout de Hotmart del curso. Allí eliges el medio de pago y verificas el total antes de finalizar. Si prefieres, un asesor te acompaña por WhatsApp.'];
  const priceFaq = [`¿Cuánto cuesta ${c.name}?`,`El enlace de Hotmart muestra ${price} para la opción de pago en USD. Según el país y el medio de pago, el checkout puede mostrar el total en COP. Revisa el importe final antes de pagar.`];
  const faqs = [priceFaq, howFaq, ...c.faqs.filter(f => !/inversi[oó]n|cu[aá]nto cuesta/i.test(f[0]))];
  const schema = {"@context":"https://schema.org","@graph":[orgNode,
    {"@type":"Course","@id":`${canonical}#course`,name:c.name,description:c.short,url:canonical,inLanguage:"es",provider:{"@id":ORG_ID},image:`${SITE}/assets/og/${c.slug}.jpg`,teaches:c.outcome,audience:{"@type":"Audience",audienceType:c.audience},
      offers:{"@type":"Offer",price:p.priceUSD,priceCurrency:"USD",category:"Paid",url:directLink(c)},
      hasCourseInstance:{"@type":"CourseInstance",courseMode:"online",courseWorkload:isoHours(c.duration)}},
    {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Cursos de IA",item:ROOT_URL},{"@type":"ListItem",position:2,name:c.name,item:canonical}]},
    faqNode([...faqs,certFaq])]};
  const related = Array.from({length:3},(_,j)=>courses[(index+j+1)%courses.length]);
  const facts = [
    ['Inversión', price, 'fact--price'],
    ['Duración', c.duration],
    ['Modalidad', 'Online'],
    ['Cupo', p.studentsLabel],
    ['Certificado', 'Curso certificado'],
    ['Fechas y horarios', 'Próxima programación, por cohorte']
  ];
  return `${header(c,canonical)}<body class="course-page" data-course="${esc(c.slug)}" data-theme="${esc(c.slug)}">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
${nav(c,false)}
<main id="contenido">
<section class="hero"><img class="hero-media" src="${media(c)}" ${imgSet(c)} sizes="100vw" width="1344" height="768" alt="${esc(`Profesionales aplicando inteligencia artificial en ${c.category.toLowerCase()}`)}" fetchpriority="high"><div class="hero-shade"></div><div class="hero-inner"><div class="hero-copy"><p class="course-badge glass" style="--i:0"><span class="cb-brand">NC AcademIA · Curso</span><strong>${esc(c.name)}</strong></p><h1 style="--i:1">${emph(c.title)}</h1><p class="hero-lede" style="--i:2">${esc(c.short)}</p><p class="hero-price" style="--i:3"><b>${price}</b><span>Checkout Hotmart</span></p><p class="checkout-note">Hotmart puede mostrar COP según tu país y medio de pago.</p><div class="hero-actions" style="--i:4">${buy(c,'hero')}<a href="#programa" class="text-link">Ver el programa</a></div></div><aside class="fact-panel glass" aria-label="Ficha rápida"><span class="fact-label">Te llevas</span><p class="fact-cue">${esc(cue[c.slug])}</p><ul class="fact-list"><li><span>Duración</span><b>${esc(c.duration)}</b></li><li><span>Modalidad</span><b>Online</b></li><li><span>Cupo</span><b>${esc(p.studentsLabel)}</b></li></ul><p class="fact-for">Para ${esc(lower(c.audience))}</p></aside></div></section>

<section class="section reto"><h2 class="sec-title" data-r>${esc(editorial[c.slug][0])}</h2><div class="bento"><article class="glass tile tile-pain" data-r><h3>El reto</h3><p>${esc(c.pain)}</p></article><article class="glass tile tile-outcome" data-r style="--d:1"><h3>Lo que te llevas</h3><p class="lead">${esc(c.outcome)}</p><p class="sub">${esc(editorial[c.slug][1])}</p></article><article class="glass tile tile-cta" data-r style="--d:2"><div><p class="tile-price"><b>${price}</b></p><p>Asegura tu cupo y empieza a aplicar la IA en tu trabajo.</p></div>${buy(c,'reto')}</article></div></section>

<section class="section program" id="programa"><div class="program-side" data-r><p class="eyebrow">El recorrido</p><h2>Un programa que va <em>de lo concreto</em> a lo aplicable.</h2><p>Un recorrido práctico, paso a paso, con ejercicios sobre casos de tu trabajo.</p><div class="glass tools"><b>Herramientas del temario</b>${esc(c.tools)}</div></div><ol class="mods">${c.modules.map((m,i)=>`<li class="glass" data-r style="--d:${i%4}"><span class="no">${String(i+1).padStart(2,'0')}</span><h3>${esc(m[0])}</h3><span class="time">${esc(m[1])}</span></li>`).join('')}</ol></section>

<section class="banner">${c.slug==='automatizacion-y-agentes-ia'?`<video class="banner-media" autoplay muted loop playsinline preload="none" poster="${media(c)}" aria-hidden="true"><source src="../assets/media/${c.slug}.mp4" type="video/mp4"></video>`:`<img class="banner-media" src="${media(c)}" ${imgSet(c)} sizes="100vw" width="1344" height="768" loading="lazy" alt="">`}<div class="banner-panel glass" data-r><h2>Un caso para trabajar. <em>Un aprendizaje que se conecta.</em></h2><p>${esc(c.artifact)}</p>${buy(c,'artifact')}</div></section>

<section class="section audience"><h2 data-r>Hecho para personas que quieren <em>aplicar.</em></h2><p data-r>${esc(c.audience)}</p><div class="rail"><article class="glass" data-r><span class="dot">1</span><strong>Tu rol</strong><p>Partimos de tareas y decisiones que ya hacen parte de tu trabajo.</p></article><article class="glass" data-r style="--d:1"><span class="dot">2</span><strong>Tu caso</strong><p>La práctica se conecta con un ejercicio o proyecto del programa.</p></article><article class="glass" data-r style="--d:2"><span class="dot">3</span><strong>Tu siguiente paso</strong><p>Te inscribes en línea y, si lo necesitas, un asesor resuelve tus dudas.</p></article></div></section>

<section class="section details"><div class="details-head"><h2 data-r>Todo lo que necesitas saber <em>para inscribirte.</em></h2>${buy(c,'details')}</div><div class="facts">${facts.map((f,i)=>`<div class="glass fact ${f[2]||''}" data-r style="--d:${i%3}"><span>${esc(f[0])}</span><strong>${esc(f[1])}</strong></div>`).join('')}</div></section>

<section class="section"><div class="faq-wrap"><div data-r><h2>Resuelve tus dudas <em>antes de inscribirte.</em></h2><p class="muted">Si algo no queda claro, un asesor te responde por WhatsApp.</p>${advisor(c,'faq')}</div><div class="faq-list">${faqs.map((f,i)=>`<details class="faq-item glass" data-r style="--d:${i%4}" ${i===0?'open':''}><summary>${esc(f[0])}<span aria-hidden="true">+</span></summary><p>${esc(f[1])}</p></details>`).join('')}<details class="faq-item glass" data-r><summary>${esc(certFaq[0])}<span aria-hidden="true">+</span></summary><p>${esc(certFaq[1])}</p></details></div></div></section>

<section class="section"><div class="related-head"><h2 data-r>Tu próximo paso puede ser <em>otro.</em></h2><a href="../index.html#programas" class="text-link">Ver todos los cursos ↗</a></div><div class="track">${related.map(r=>`<a class="rel glass" href="../${r.slug}/"><img ${cardSet(r)} sizes="(max-width: 640px) 78vw, 360px" width="900" height="900" loading="lazy" alt=""><div class="rel-body"><small>${esc(r.category)}</small><h3>${esc(r.name)}</h3><p>${esc(r.short)}</p><span class="rel-price">${fmtUSD(shop(r).priceUSD)}</span></div></a>`).join('')}</div></section>

<section class="final" id="contacto"><div class="final-inner"><div class="final-copy"><h2 data-r>Asegura tu cupo en <em>${esc(c.name)}.</em></h2><p class="final-price" data-r><b>${price}</b><span>Checkout Hotmart</span></p><p data-r>Inscríbete en línea y revisa el total y la moneda en Hotmart antes de pagar.</p><div class="final-cta" data-r>${buy(c,'final')}</div><div class="assure" data-r><span class="chip">Pago en línea</span><span class="chip">Hotmart</span><span class="chip">${esc(p.studentsLabel)}</span></div>${guiaFigure('../')}</div>${leadForm(c)}</div></section>
</main>
${footer(false)}
${floatWa(c)}
<div class="sticky-cta glass">${buy(c,'sticky',`Inscribirme · ${price}`)}</div>
<script type="application/ld+json">${JSON.stringify(schema)}</script><script src="../assets/config.js"></script><script src="../assets/site.js" defer></script></body></html>`;
}

function indexPage(){
  const canonical = ROOT_URL;
  const list = {"@context":"https://schema.org","@graph":[orgNode,
    {"@type":"WebSite","@id":`${SITE}/#website`,url:ROOT_URL,name:"NC AcademIA",inLanguage:"es-CO",publisher:{"@id":ORG_ID}},
    {"@type":"ItemList",name:'Cursos de inteligencia artificial aplicada de NC AcademIA',itemListElement:courses.map((c,i)=>({"@type":"ListItem",position:i+1,url:`${SITE}/${c.slug}${SLASH}`,item:{"@type":"Course",name:c.name,description:c.short,inLanguage:'es',provider:{"@id":ORG_ID}}}))},
    faqNode(indexFaqs)]};
  return `${header(null,canonical,true)}<body class="index-page" data-theme="ia-360-para-empresas">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
${nav(null,true)}
<main id="contenido">
<section class="hero hero-index hero-guia"><img class="hero-media" src="assets/brand/guia/guia-portada-derecha.webp" srcset="assets/brand/guia/guia-portada-derecha-720.webp 720w, assets/brand/guia/guia-portada-derecha.webp 1000w" sizes="(max-width: 960px) 100vw, 68vw" width="1000" height="1125" alt="GUIA, el personaje de NC AcademIA, sentado con su computador entre luces rojas" fetchpriority="high"><div class="hero-shade"></div><div class="hero-inner"><div class="hero-copy"><p class="eyebrow" style="--i:0"><span class="nc-name">NC AcademIA</span> · Colombia</p><h1 style="--i:1">La IA se aprende <em>aplicándola.</em></h1><p class="hero-lede" style="--i:2">Formación práctica en IA para tu profesión y tu empresa. Diez rutas con casos reales y criterio humano.</p><div class="hero-actions" style="--i:3"><a href="#programas" class="button button--red">Explorar los cursos <span aria-hidden="true">↓</span></a><a href="#metodo" class="text-link">Conoce el método</a></div></div></div></section>

<section class="section" id="programas"><div class="cat-head"><h2 data-r>¿Qué parte de tu trabajo quieres <em>transformar?</em></h2><p class="muted" data-r>Elige por tu rol o necesidad y entra a la ruta pensada para ti.</p></div><div class="cat-grid">${courses.map((c,i)=>`<a href="${c.slug}/" class="cc glass" data-theme="${esc(c.slug)}" data-r style="--d:${i%3}"><div class="cc-visual"><img ${cardSet(c,'')} sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw" width="900" height="900" loading="${i<2?'eager':'lazy'}" alt="Curso ${esc(c.name)}"><span class="cc-no">${c.number}</span></div><div class="cc-body"><div class="cc-meta"><span>${esc(c.category)}</span><span>${esc(c.duration)}</span></div><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p><p class="cc-price"><b>${fmtUSD(shop(c).priceUSD)}</b></p><div class="cc-go"><span>${esc(cue[c.slug])}</span><b aria-hidden="true">↗</b></div></div></a>`).join('')}</div></section>

<section class="section" id="metodo"><h2 class="sec-title" data-r>De la pregunta <em>a la práctica.</em></h2><div class="method"><article class="glass step" data-r><small>ENTENDER</small><h3>Ubica el reto</h3><p>Parte de una tarea, decisión o proceso de tu realidad.</p></article><article class="glass step" data-r style="--d:1"><small>EXPLORAR</small><h3>Prueba con criterio</h3><p>Elige herramientas y aprende a revisar sus resultados.</p></article><article class="glass step" data-r style="--d:2"><small>APLICAR</small><h3>Conecta con el trabajo</h3><p>Desarrolla ejercicios y entregables alrededor del caso.</p></article><article class="glass step" data-r style="--d:3"><small>CONTINUAR</small><h3>Define el siguiente paso</h3><p>Identifica cómo seguir practicando en tu rol o equipo.</p></article></div></section>

<section class="section"><div class="duo"><div class="glass" data-r><h2>Una habilidad. <em>Un mejor flujo.</em></h2><p>Si aprendes por tu cuenta: cursos para llevar IA a marketing, diseño, ventas, finanzas, administración o liderazgo.</p></div><div class="glass" data-r style="--d:1"><h2>Un reto compartido. <em>Una ruta común.</em></h2><p>Si aprenden como equipo: conversemos sobre los procesos y los cursos empresariales disponibles.</p></div></div></section>

<section class="section"><div class="glass guia-panel" data-r><div class="guia-copy"><h2>No necesitas dominar toda la IA. <em>Necesitas saber cuál usar y para qué.</em></h2><p>La práctica importa. También la privacidad, la verificación y la supervisión humana. GUIA, el embajador de NC AcademIA, acompaña ese camino.</p></div><img src="assets/brand/guia/guia-ejecutivo-4x3.webp" width="1254" height="945" loading="lazy" alt="GUIA, el personaje de NC AcademIA, trabajando en su computador"></div></section>

<section class="section"><div class="faq-wrap"><div data-r><h2>Empieza por <em>lo que necesitas.</em></h2><p class="muted">Si tienes dudas sobre qué ruta corresponde a tu rol o equipo, podemos orientarte.</p>${cta(null,'index-faq')}</div><div class="faq-list">${indexFaqs.map((f,i)=>`<details class="faq-item glass" data-r ${i===0?'open':''}><summary>${esc(f[0])}<span aria-hidden="true">+</span></summary><p>${esc(f[1])}</p></details>`).join('')}</div></div></section>

<section class="final" id="contacto"><div class="final-inner"><div class="final-copy"><h2 data-r>Cuéntanos qué quieres <em>hacer mejor con IA.</em></h2><p data-r>Te ayudamos a encontrar el curso y te compartimos fechas, modalidad y condiciones confirmadas.</p><div class="assure" data-r><span class="chip">Sin costo</span><span class="chip">Sin compromiso</span><span class="chip">En español</span></div>${guiaFigure('')}</div>${leadForm(null)}</div></section>
</main>
${footer(true)}
${floatWa(null)}
<div class="sticky-cta glass">${cta(null,'sticky')}</div>
<script type="application/ld+json">${JSON.stringify(list)}</script><script src="assets/config.js"></script><script src="assets/site.js" defer></script></body></html>`;
}

fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for (let i=0;i<courses.length;i++) { const dir=path.join(out,courses[i].slug);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),page(courses[i],i)); }
fs.writeFileSync(path.join(out,'index.html'),indexPage());

// ---- Recursos estáticos ----
// Minificación con esbuild si está instalado (npm install); si no, se publica sin minificar. Los saltos de línea se normalizan para que
// los hashes de la política CSP sean idénticos en Windows y Linux.
const lf = s => s.replace(/\r\n/g,'\n');
let minCss = s => s, minJs = s => s;
try { const esb = await import('esbuild'); minCss = s => esb.transformSync(s,{loader:'css',minify:true}).code; minJs = s => esb.transformSync(s,{loader:'js',minify:true}).code; }
catch { console.log('Aviso: esbuild no está instalado; CSS y JS se publican sin minificar (ejecuta npm install).'); }
const cssSrc = minCss(lf(fs.readFileSync(path.join(root,'assets','site.css'),'utf8')));
const jsSrc = minJs(lf(fs.readFileSync(path.join(root,'assets','site.js'),'utf8')));
fs.writeFileSync(path.join(out,'assets','site.css'),cssSrc.replaceAll('__FONTS__','fonts'));
fs.writeFileSync(path.join(out,'assets','site.js'),jsSrc);
fs.copyFileSync(path.join(root,'assets','config.js'),path.join(out,'assets','config.js'));
fs.cpSync(path.join(root,'assets','media'),path.join(out,'assets','media'),{recursive:true,filter:src=>!src.endsWith('.png')&&!src.endsWith('contact-sheet.jpg')});
// Marca NC AcademIA (logos, isotipo, favicon, GUIA), fuentes propias e imágenes sociales 1200x630.
for (const d of ['brand','fonts','og']) fs.cpSync(path.join(root,'assets',d),path.join(out,'assets',d),{recursive:true});
const brandDir=path.join(root,'assets','brand');
// Los navegadores piden /favicon.ico en la raíz del sitio aunque el HTML declare otro icono.
fs.copyFileSync(path.join(brandDir,'favicon.ico'),path.join(out,'favicon.ico'));
const logoFile='brand/logos/nc-academia-horizontal-negativo.png';

// Cada HTML entregado queda visualmente completo al abrirlo directo o previsualizarlo desde un ZIP.
// CSS y JS van en línea (cero peticiones bloqueantes). Logos e iconos NO se incrustan en base64: se duplicaban en cabecera y pie y pesaban más
// que todo el resto del HTML; como archivos se descargan una vez y quedan en caché.
const { createHash } = await import('node:crypto');
const inlineScriptHashes = new Set();
const inline=(file,p)=>{
  let html=lf(fs.readFileSync(file,'utf8'));
  html=html.replace(`<link rel="stylesheet" href="${p}site.css">`,()=>`<style>${cssSrc.replaceAll('__FONTS__',`${p}fonts`)}</style>`);
  html=html.replace(`<script src="${p}config.js"></script><script src="${p}site.js" defer></script>`,()=>`<script>window.NC_LANDING_CONFIG={whatsappNumber:"${WHATSAPP}",email:"direccion@negocioscreativos.net"};</script><script>${jsSrc}</script>`);
  // Hash de cada script en línea ejecutable (los JSON-LD no se ejecutan y no lo necesitan): lo usa la política CSP de vercel.json.
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) inlineScriptHashes.add(`'sha256-${createHash('sha256').update(m[1],'utf8').digest('base64')}'`);
  fs.writeFileSync(file,html);
};
for(const c of courses) inline(path.join(out,c.slug,'index.html'),'../assets/');
inline(path.join(out,'index.html'),'assets/');
if (PUBLISH_BASE) {
  // Las landings se sirven sin barra final (/ncacademia/cursos/<curso>), donde "../" ya no apunta a la raíz del sitio: se pasan a rutas absolutas.
  for (const c of courses) {
    const f = path.join(out, c.slug, 'index.html');
    let html = fs.readFileSync(f, 'utf8');
    html = html.replaceAll('../assets/', `${PUBLISH_BASE}/assets/`)
      .replaceAll('"../index.html#programas"', `"${CATALOG_URL}"`)
      .replaceAll('"../index.html#metodo"', `"${CATALOG_URL}"`)
      .replaceAll('"../index.html"', `"${CATALOG_URL}"`);
    for (const o of courses) html = html.replaceAll(`href="../${o.slug}/"`, `href="${PUBLISH_BASE}/${o.slug}"`);
    fs.writeFileSync(f, html);
  }
  // La raíz del despliegue conserva el catálogo como página de vista previa (la tienda no lo reenvía): rutas absolutas y sin indexar.
  const fi = path.join(out, 'index.html');
  let idx = fs.readFileSync(fi, 'utf8').replace(/(?<![\w/.\-])assets\//g, `${PUBLISH_BASE}/assets/`)
    .replace(/content="index,follow[^"]*"/, 'content="noindex,follow"');
  for (const o of courses) idx = idx.replaceAll(`href="${o.slug}/"`, `href="${PUBLISH_BASE}/${o.slug}"`);
  fs.writeFileSync(fi, idx);
}

// ---- Indexación: sitemap, robots y llms.txt ----
const today = new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...(PUBLISH_BASE?[]:[ROOT_URL]),...courses.map(c=>`${SITE}/${c.slug}${SLASH}`)].map((url,i)=>`  <url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${i===0?'1.0':'0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
// Política para IA: se bloquean los rastreadores de ENTRENAMIENTO (el contenido es propio) y se permiten los de búsqueda y respuestas
// (Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User), que son los que traen visitas y citas.
const trainingBots = ['GPTBot','ClaudeBot','anthropic-ai','CCBot','Google-Extended','Applebot-Extended','Bytespider','Meta-ExternalAgent','cohere-ai','Diffbot','ImagesiftBot'];
fs.writeFileSync(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\n\n# Rastreadores de entrenamiento de IA: no permitidos\n${trainingBots.map(b=>`User-agent: ${b}\nDisallow: /\n`).join('\n')}\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(out,'llms.txt'),`# NC AcademIA\n\n> NC AcademIA es la unidad académica de Negocios Creativos (Cali, Colombia). Ofrece formación práctica en inteligencia artificial aplicada para profesionales y empresas, en español. Idea central: la IA se aprende aplicándola.\n\n## Cursos\n\n${courses.map(c=>`- [${c.name}](${SITE}/${c.slug}${SLASH}): ${c.short} Duración: ${c.duration}. Precio de la opción USD en Hotmart: ${fmtUSD(shop(c).priceUSD)}. [Pago](${directLink(c)}).`).join('\n')}\n\n## Contacto\n\n- WhatsApp: +57 311 209 3653\n- Correo: direccion@negocioscreativos.net\n- Sitio de la academia: https://www.negocioscreativos.net/ncacademia\n\n## Notas\n\n- Precios USD verificados en los checkouts de Hotmart el 23 de octubre de 2026; Hotmart puede mostrar COP según país y medio de pago. El total final se comprueba en el checkout.\n- Fechas, modalidad y condiciones del certificado se confirman por cohorte.\n- Catálogo y rutas por rol: ${ROOT_URL}\n`);

// ---- Seguridad y caché: vercel.json (se regenera en cada compilación; contiene los hashes de los scripts en línea) ----
const csp = ["default-src 'self'",`script-src 'self' ${[...inlineScriptHashes].join(' ')}`,"style-src 'self' 'unsafe-inline'","img-src 'self' data:","font-src 'self'","media-src 'self'","connect-src 'self'","object-src 'none'","base-uri 'none'","form-action 'self'","frame-ancestors 'none'","upgrade-insecure-requests"].join('; ');
const h = (key,value) => ({key,value});
const vercel = {
  "$schema":"https://openapi.vercel.sh/vercel.json",
  trailingSlash: true,
  headers:[
    {source:'/(.*)',headers:[h('Content-Security-Policy',csp),h('Strict-Transport-Security','max-age=63072000; includeSubDomains'),h('X-Content-Type-Options','nosniff'),h('X-Frame-Options','DENY'),h('Referrer-Policy','strict-origin-when-cross-origin'),h('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'),h('Cross-Origin-Opener-Policy','same-origin')]},
    // Fuentes: nunca cambian de nombre, caché de un año. Imágenes y video: 30 días con revalidación; solo el propio sitio puede incrustarlos (anti-hotlinking).
    {source:'/assets/fonts/(.*)',headers:[h('Cache-Control','public, max-age=31536000, immutable'),h('Cross-Origin-Resource-Policy','same-origin')]},
    {source:'/assets/(media|brand)/(.*)',headers:[h('Cache-Control','public, max-age=2592000, stale-while-revalidate=86400'),h('Cross-Origin-Resource-Policy','same-origin')]},
    // Imágenes sociales: las descargan los rastreadores de redes; caché de 30 días.
    {source:'/assets/og/(.*)',headers:[h('Cache-Control','public, max-age=2592000, stale-while-revalidate=86400')]},
    {source:'/(favicon.ico|assets/site.css|assets/site.js|assets/config.js)',headers:[h('Cache-Control','public, max-age=86400, stale-while-revalidate=604800')]},
    {source:'/(robots.txt|sitemap.xml|llms.txt)',headers:[h('Cache-Control','public, max-age=3600')]}
  ]
};
if (PUBLISH_BASE) {
  vercel.trailingSlash = false; // la tienda sirve sin barra final: aquí /curso responde 200 y /curso/ redirige a /curso, así el proxy de la tienda nunca recibe un 308
  vercel.headers = vercel.headers.map(r => r.source === '/(.*)' ? r : { ...r, source: r.source.replace(/^\/\(?/, m => `${PUBLISH_BASE}${m}`) });
  vercel.headers.forEach(r => { if (r.source.includes('robots.txt')) r.source = `${PUBLISH_BASE}/(sitemap-landings.xml|llms.txt)`; });
}
fs.writeFileSync(path.join(root,'vercel.json'),JSON.stringify(vercel,null,2)+'\n');
if (PUBLISH_BASE) {
  // Estructura de salida: dist/ncacademia/cursos/<curso>/index.html y dist/ncacademia/cursos/assets/..., idéntica a la ruta pública.
  const target = path.join(out, ...PUBLISH_BASE.split('/').filter(Boolean));
  fs.mkdirSync(target, { recursive: true });
  for (const name of [...courses.map(c => c.slug), 'assets']) fs.renameSync(path.join(out, name), path.join(target, name));
  fs.renameSync(path.join(out, 'sitemap.xml'), path.join(target, 'sitemap-landings.xml'));
  fs.renameSync(path.join(out, 'llms.txt'), path.join(target, 'llms.txt'));
  // El dominio de este despliegue es de vista previa: no debe indexarse (las URL públicas son las de la tienda, con su propio robots.txt).
  fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}
console.log(`Generated ${courses.length} course pages and index at ${out} (${inlineScriptHashes.size} hashes CSP, dominio ${SITE})`);
