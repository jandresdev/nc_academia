# Micrositio de landings NC AcademIA

Micrositio estático de diez landings y un catálogo, todavía no publicado. El contenido está pre-renderizado en HTML para que sea legible sin JavaScript. Los HTML finales llevan CSS, JavaScript básico, logotipo y favicon incrustados. Las fotografías y el clip de video están en `dist/assets/media/`: para verlos al abrir los HTML locales hay que conservar esa carpeta junto a las páginas o extraer el ZIP completo.

Cada curso tiene un hero fotográfico de ancho completo, una escena visual en “Para quién”, una franja de práctica con imagen y tarjetas fotográficas en el catálogo y los cursos relacionados. Automatización y Agentes de IA incluye un clip silencioso en la sección de público, con imagen de respaldo y respeto por la preferencia de movimiento reducido. Las escenas se generaron con Higgsfield para este proyecto y se exportaron en WebP para reducir el peso de carga.

## Compilar

Desde esta carpeta, ejecutar `npm run build` con Node.js 18 o superior. La salida queda en `dist/`: un catálogo y una carpeta por URL de curso (`dist/<slug>/index.html`).

## Sistema visual

Sigue el **Manual de marca NC AcademIA 2026** (resumen en `../Identidad visual NC Academia.md`): rojo institucional `#F30206`, negro y blanco; tipografías Amaranth y Muli (en Google Fonts, Mulish); nombre siempre **NC AcademIA**. Tema oscuro único con "liquid glass" (aproximación web con `backdrop-filter`; no es un paquete oficial de Apple), tramas de hexágonos y circuitos, y el personaje GUIA.

Los activos de marca están en `assets/brand/`: `logos/` (las cuatro firmas y el isotipo, con fondo transparente), `guia/` (imágenes del manual) y el favicon. Se generan desde los archivos oficiales con `python scripts/prepare-brand-assets.py "<carpeta MANUAL DE MARCA ACADEMIA_>"` (requiere Pillow). El logo se usa tal cual: sin redibujar, recolorear ni añadir sombras. Los archivos de origen son PNG/JPG de 500 px; para impresión hacen falta los vectoriales.

Cada curso tiene su propia personalidad visual en el bloque `[data-theme="<slug>"]` de `assets/site.css`: motivo de fondo, intensidad del resplandor rojo y luminosidad del cristal, siempre con rojo, negro y neutros. Para ajustar un curso, edita solo ese bloque. Con `prefers-reduced-transparency` o sin soporte de `backdrop-filter`, el cristal pasa a un fondo sólido.

`assets/media/` es el origen de las imágenes y el generador la copia a `dist/`. No la borres: `npm run build` limpia `dist/` en cada compilación.

## Publicación en el dominio de la tienda

Las landings se compilan por defecto en **modo tienda**: `dist/ncacademia/cursos/<curso>/index.html` y `dist/ncacademia/cursos/assets/...`, con rutas absolutas, canonical `https://www.negocioscreativos.net/ncacademia/cursos/<curso>` (sin barra final) y `vercel.json` con `trailingSlash: false`. Así la tienda (Next.js) puede reenviar esas rutas con un rewrite y el botón de compra funciona directo en su dominio. **La guía para el equipo de la tienda, con el código del rewrite y la lista de verificación, está en [PUBLICAR-EN-TIENDA.md](PUBLICAR-EN-TIENDA.md).** La raíz del despliegue (por ejemplo `ncacademia.vercel.app/`) muestra el catálogo como **vista previa**, con `noindex` y un `robots.txt` que bloquea indexar ese dominio; las URL públicas son las de la tienda. Para generar la versión autónoma (catálogo en la raíz y rutas relativas): `PUBLISH_BASE="" npm run build` (en Git Bash de Windows, anteponer `MSYS_NO_PATHCONV=1` si se pasa una ruta). Si el sitio se publica en otro dominio, definir también `SITE_URL`.

## Embudo de ventas y precios

Cada landing es una página de venta: precio en dólares (USD) en el hero, ficha con horas, modalidad y cupo, botón **Inscribirme ahora** en cada punto de decisión y **Hablar con un asesor** (WhatsApp) como apoyo. El formulario queda como canal secundario.

- **La tienda no tiene enlaces de pago por curso.** El enlace de pago se genera al final del checkout: la página `/checkout` de la tienda toma el carrito del navegador (`localStorage`, clave `shopping-cart`), pide nombre, correo y teléfono, el método de pago, y llama a su servidor (`/api/pyments/create-payment-link`) que devuelve el enlace de pago y redirige. Ese servidor no acepta llamadas desde otros dominios (sin CORS).
- **Cómo lo resuelven las landings:** el botón de compra lleva el id de producto, el precio y la imagen del curso (`data-product`). Si la landing se sirve desde `negocioscreativos.net` (por ejemplo `/ncacademia/cursos/<curso>/`), el clic agrega ese curso al carrito, pone la moneda en COP y abre **el carrito de la tienda** (`/cart`) con ese curso, listo para pulsar Finalizar Compra (validado contra la tienda real). Desde otro dominio (Vercel, pruebas) no se puede escribir en el almacenamiento de otro sitio, y el botón abre la página de cursos de la tienda con parámetros UTM.
- **Enlace directo desde cualquier dominio:** si el equipo de la tienda habilita una URL que reciba el curso (por ejemplo `/cart?add=<id>`), compilar con `BUY_URL_TEMPLATE="https://www.negocioscreativos.net/cart?add={id}" npm run build` (admite `{id}` y `{slug}`).
- **Enlace de pago directo por curso:** si el equipo obtiene un enlace de pago por curso (por ejemplo un enlace de Bold), se pega en `assets/payment-links.json` (clave = slug del curso, debe empezar por `https://`). Cuando está lleno, ese curso lleva directo a su pago en todos los dominios y tiene prioridad sobre el carrito. Luego `npm run build`.
- **Datos comerciales:** `assets/commerce.json` (precios, horas, cupo, descripción, id de producto) y las imágenes `assets/media/card-*.webp` se generan con `python scripts/fetch-products.py`, que lee la página pública de cursos. Vuelve a ejecutarlo cuando cambien precios o imágenes y recompila con `npm run build`. Las horas y los precios de la tienda mandan sobre los del PDF.
- **Analítica:** el clic en compra emite `buy_click` (curso, ubicación, precio, moneda) y el de asesor `whatsapp_click`.

## Configuración y CTA

- El número oficial de WhatsApp es **+57 311 209 3653** (`573112093653`) y está en `assets/config.js` y en la constante `WHATSAPP` de `generate.mjs` (mantenerlos iguales; los HTML llevan la configuración incrustada). Si cambia, usar solo dígitos con prefijo internacional. No completar con un número tomado del PDF o de la web porque las fuentes disponibles discrepan.
- Todas las páginas llevan un botón flotante de WhatsApp (abajo a la derecha) con mensaje precargado según el curso; en móvil se sitúa sobre la barra fija de CTA. Los CTA "Pedir información" y el formulario también abren WhatsApp con ese número.
- Mientras el número esté vacío, los CTA abren un correo a `direccion@negocioscreativos.net` con curso y URL de origen.
- La URL canónica se define en `generate.mjs`; ahora supone `https://www.negocioscreativos.net/ncacademia/cursos/`. Ajustarla al destino real antes de indexar.
- El micrositio no tiene checkout, píxel ni propiedad de analítica configurados.

## SEO, IA y medición

Incluye HTML estático, metadatos por página, canonicals, JSON-LD `Course`/`ItemList`, enlaces internos, sitemap y eventos custom para vistas, profundidad de scroll y CTA. La sección `Analisis de referentes y SEO-SXO.md` documenta decisiones SEO, GEO, AEO, AIO y SXO con límites y fuentes.

El sitemap se debe enviar en Search Console o referenciar desde el `robots.txt` raíz del dominio. No se promete ranking, indexación o presencia en respuestas de IA.

## Antes de publicar

Confirmar inversión y unidad de cobro, fechas, modalidad/sesiones, duración de Finanzas, certificado, cupos, herramientas/licencias, docentes, teléfono y ruta de despliegue. Los metadatos `og:image` apuntan a las nuevas imágenes del curso en la URL canónica prevista; revisar esas rutas al desplegar.
