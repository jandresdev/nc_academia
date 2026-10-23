# Micrositio de landings NC AcademIA

Micrositio estático de diez landings y un catálogo, todavía no publicado. El contenido está pre-renderizado en HTML para que sea legible sin JavaScript. Los HTML finales llevan CSS, JavaScript básico, logotipo y favicon incrustados. Las fotografías y el clip de video se copian a la carpeta `assets/media/` de cada compilación. Para recorrer las páginas desde el disco local, abrir `preview/index.html` y conservar toda la carpeta `preview/`.

Cada curso tiene un hero fotográfico de ancho completo, una escena visual en “Para quién”, una franja de práctica con imagen y tarjetas fotográficas en el catálogo y los cursos relacionados. Automatización y Agentes de IA incluye un clip silencioso en la sección de público, con imagen de respaldo y respeto por la preferencia de movimiento reducido. Las escenas se generaron con Higgsfield para este proyecto y se exportaron en WebP para reducir el peso de carga.

## Compilar

Desde esta carpeta, ejecutar `npm run build` con Node.js 18 o superior. La salida de publicación queda en `dist/ncacademia/cursos/`. Para generar una vista local independiente con rutas relativas, ejecutar en PowerShell: `$env:PUBLISH_BASE=''; $env:NC_OUTPUT_DIR='preview'; npm run build`. Después, limpiar esas variables y volver a compilar la salida de publicación. El generador acepta `NC_OUTPUT_DIR=preview` solo para esa vista local.

## Sistema visual

Sigue el **Manual de marca NC AcademIA 2026** (resumen en `../Identidad visual NC Academia.md`): rojo institucional `#F30206`, negro y blanco; tipografías Amaranth y Muli (en Google Fonts, Mulish); nombre siempre **NC AcademIA**. Tema oscuro único con "liquid glass" (aproximación web con `backdrop-filter`; no es un paquete oficial de Apple), tramas de hexágonos y circuitos, y el personaje GUIA.

Los activos de marca están en `assets/brand/`: `logos/` (las cuatro firmas y el isotipo, con fondo transparente), `guia/` (imágenes del manual) y el favicon. Se generan desde los archivos oficiales con `python scripts/prepare-brand-assets.py "<carpeta MANUAL DE MARCA ACADEMIA_>"` (requiere Pillow). El logo se usa tal cual: sin redibujar, recolorear ni añadir sombras. Los archivos de origen son PNG/JPG de 500 px; para impresión hacen falta los vectoriales.

Cada curso tiene su propia personalidad visual en el bloque `[data-theme="<slug>"]` de `assets/site.css`: motivo de fondo, intensidad del resplandor rojo y luminosidad del cristal, siempre con rojo, negro y neutros. Para ajustar un curso, edita solo ese bloque. Con `prefers-reduced-transparency` o sin soporte de `backdrop-filter`, el cristal pasa a un fondo sólido.

`assets/media/` es el origen de las imágenes y el generador la copia a `dist/`. No la borres: `npm run build` limpia `dist/` en cada compilación.

## Publicación en el dominio de la tienda

Las landings se compilan por defecto en **modo tienda**: `dist/ncacademia/cursos/<curso>/index.html` y `dist/ncacademia/cursos/assets/...`, con rutas absolutas, canonical `https://www.negocioscreativos.net/ncacademia/cursos/<curso>` (sin barra final) y `vercel.json` con `trailingSlash: false`. La tienda (Next.js) puede reenviar esas rutas con un rewrite. **La guía de publicación está en [PUBLICAR-EN-TIENDA.md](PUBLICAR-EN-TIENDA.md).** El botón de compra abre el checkout de Hotmart del curso desde cualquier dominio. La raíz del despliegue (por ejemplo `ncacademia.vercel.app/`) muestra el catálogo como **vista previa**, con `noindex` y un `robots.txt` que bloquea indexar ese dominio; las URL públicas son las de la tienda. Para generar la versión autónoma (catálogo en la raíz y rutas relativas): `PUBLISH_BASE="" npm run build` (en Git Bash de Windows, anteponer `MSYS_NO_PATHCONV=1` si se pasa una ruta). Si el sitio se publica en otro dominio, definir también `SITE_URL`.

## Embudo de ventas y precios

Cada landing es una página de venta: precio en dólares (USD) en el hero, ficha con horas, modalidad y cupo, botón **Inscribirme ahora** en cada punto de decisión y **Hablar con un asesor** (WhatsApp) como apoyo. El formulario queda como canal secundario.

- **Ofertas vigentes:** `assets/payment-links.json` guarda el enlace Hotmart y el importe USD de cada curso. Los diez enlaces y la opción USD/PayPal se verificaron el 23 de octubre de 2026 con `python scripts/audit-hotmart.py`. Si el cliente modifica un checkout, hay que actualizar ese archivo y recompilar.
- **Moneda en checkout:** el importe publicado es el de la opción USD que devuelve Hotmart. Los medios locales pueden mostrar COP; la persona debe revisar el total final en Hotmart antes de pagar. No se calcula USD con el tipo de cambio fijo de `commerce.json`.
- **Datos descriptivos:** `assets/commerce.json` aporta horas, cupo y otros datos del catálogo de Negocios Creativos. `scripts/fetch-products.py` puede actualizar ese archivo, pero la oferta USD de Hotmart sigue siendo la fuente de precio para las landings.
- **Analítica:** el clic en compra emite `buy_click` (curso, ubicación, precio, moneda) y el de asesor `whatsapp_click`. La navegación a Hotmart funciona sin JavaScript.

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

Confirmar unidad de cobro y alcance para equipos, fechas, modalidad/sesiones, condiciones del certificado, cupos, herramientas/licencias, docentes y ruta de despliegue. Los precios USD y enlaces de pago están actualizados según los checkouts recibidos el 21 de octubre y verificados el 23 de octubre de 2026. Los metadatos `og:image` apuntan a las imágenes del curso en la URL canónica prevista; revisar esas rutas al desplegar.
