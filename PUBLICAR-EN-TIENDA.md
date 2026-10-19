# Publicar las landings en negocioscreativos.net/ncacademia/cursos/<curso>

**Objetivo:** que cada landing viva en `https://www.negocioscreativos.net/ncacademia/cursos/<curso>` (el mismo dominio de la tienda). Así el botón **Inscribirme ahora** agrega el curso al carrito de la tienda y abre `/checkout` directo, sin que el cliente tenga que buscar nada.

**Por qué hace falta tocar la tienda:** el carrito y la moneda viven en el `localStorage` del navegador, que es propio de cada dominio. Una landing en otro dominio (por ejemplo `*.vercel.app`) no puede escribir en el carrito de `negocioscreativos.net`, y el servidor de pagos de la tienda (`/api/pyments/create-payment-link`) tampoco acepta llamadas desde otros dominios (no envía CORS). La solución es que la tienda **reenvíe** (rewrite) esas rutas al despliegue de las landings: el navegador sigue viendo `negocioscreativos.net` y todo funciona como una sola web.

## Qué debe hacer el equipo de la tienda (unos 15 minutos)

1. **Obtener la URL de producción de las landings** en Vercel (proyecto `nc_academia`, pestaña Domains). En esta guía se llama `<URL-DE-LAS-LANDINGS>` (por ejemplo `https://nc-academia.vercel.app`).
2. **Agregar los rewrites** al `next.config.js` o `next.config.mjs` de la tienda (código abajo).
3. **Desplegar la tienda** y comprobar con la lista de verificación del final.
4. **Recomendado:** enlazar cada tarjeta del catálogo (`/ncacademia/cursos`) a su landing (`/ncacademia/cursos/<curso>`), y añadir el sitemap de las landings al de la tienda (más abajo).

### Código para `next.config`

```js
// next.config.mjs (o next.config.js): se agrega a la configuración existente
const LANDINGS = '<URL-DE-LAS-LANDINGS>'; // URL de producción del proyecto de landings en Vercel, sin barra final

const CURSOS = [
  'ia-facil-para-todos', 'marketing-total-con-ia', 'diseno-creativo-con-ia', 'publicidad-digital-ads',
  'ia-para-administrativos', 'automatizacion-y-agentes-ia', 'ia-para-comerciales', 'ia-para-finanzas',
  'ia-para-gerentes', 'ia-360-para-empresas',
];

const landings = [
  // Recursos de las landings (imágenes, fuentes, logos, imágenes sociales)
  { source: '/ncacademia/cursos/assets/:path*', destination: `${LANDINGS}/ncacademia/cursos/assets/:path*` },
  // Sitemap y resumen para buscadores e IA
  { source: '/ncacademia/cursos/sitemap-landings.xml', destination: `${LANDINGS}/ncacademia/cursos/sitemap-landings.xml` },
  { source: '/ncacademia/cursos/llms.txt', destination: `${LANDINGS}/ncacademia/cursos/llms.txt` },
  // Una landing por curso (sin barra final, como el resto de la tienda)
  ...CURSOS.map((curso) => ({
    source: `/ncacademia/cursos/${curso}`,
    destination: `${LANDINGS}/ncacademia/cursos/${curso}`,
  })),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...configuración existente...
  async rewrites() {
    // Si la tienda ya define rewrites(), su resultado va en afterFiles y estos en beforeFiles.
    return { beforeFiles: landings, afterFiles: [], fallback: [] };
  },
};

export default nextConfig;
```

Notas:
- La ruta exacta `/ncacademia/cursos` (el catálogo actual de la tienda) **no se toca**: solo se reenvían las 10 landings y sus recursos. Hoy esas rutas devuelven 404, así que no pisan nada.
- Las rutas llevan **sin barra final** porque Next.js de la tienda redirige `/curso/` a `/curso`. Las landings ya generan sus URL, canonical y sitemap sin barra final.
- Cuando se actualicen las landings, la tienda no necesita redeploy: el rewrite lee siempre del despliegue de producción de las landings.

## Qué ya está hecho en las landings

- Se compilan en la estructura exacta de la ruta pública: `dist/ncacademia/cursos/<curso>/index.html` y `dist/ncacademia/cursos/assets/...`.
- Todas las rutas internas son absolutas (`/ncacademia/cursos/assets/...`), el canonical es `https://www.negocioscreativos.net/ncacademia/cursos/<curso>` y los enlaces a "Programas" y "Ver todos los cursos" van al catálogo de la tienda (`/ncacademia/cursos#cursos`).
- `vercel.json` usa `trailingSlash: false` y las cabeceras de seguridad y caché bajo esa ruta: el proxy de la tienda nunca recibe una redirección.
- El botón de compra, al estar en el dominio de la tienda, hace: agregar el curso a `shopping-cart`, poner `currency-storage` en COP y abrir `/checkout` (probado contra la tienda real).
- Para generar la versión autónoma (catálogo en la raíz, rutas relativas): `PUBLISH_BASE="" npm run build`.

## Sitemap y buscadores

- Las landings publican su propio sitemap: `https://www.negocioscreativos.net/ncacademia/cursos/sitemap-landings.xml` (10 URL).
- Opción A (simple): agregar en el `robots.txt` de la tienda una segunda línea `Sitemap: https://www.negocioscreativos.net/ncacademia/cursos/sitemap-landings.xml` y enviarlo en Google Search Console.
- Opción B: incluir esas 10 URL en el generador de sitemap de la tienda.
- El `robots.txt` actual de la tienda ya permite `/` y bloquea solo `/admin`, `/api`, `/auth`, `/cart` y `/checkout`; no hay que cambiarlo para las landings.
- Los rastreadores de entrenamiento de IA (GPTBot, ClaudeBot, CCBot, Google-Extended, etc.) estaban bloqueados en el `robots.txt` de las landings cuando se publicaban solas; ahora que viven en el dominio de la tienda, si se quiere esa política hay que copiarla a su `robots.txt`.

## Detalles técnicos a vigilar

- **Protección de despliegue de Vercel:** el proyecto de landings debe tener acceso público en producción (Settings, Deployment Protection). Si pide autenticación, el rewrite recibirá un 401.
- **Cabeceras:** las landings envían su propia política CSP (scripts en línea permitidos por hash) y otras cabeceras de seguridad. Hoy la tienda no envía CSP; si algún día la añade, debe seguir permitiendo esos scripts en línea de las landings o excluir `/ncacademia/cursos/*`.
- **Analítica:** las landings no incluyen el píxel de Meta ni otros scripts de terceros (la tienda sí carga el suyo). Emiten los eventos `buy_click` y `whatsapp_click` y los envían a `window.dataLayer` si existe; conectarlos a la analítica de la tienda es opcional.
- **Caché:** las imágenes y el video se cachean 30 días y las fuentes 1 año (cabeceras de las landings). Si se reemplaza una imagen con el mismo nombre, hay que renombrarla.
- **Reversión:** quitar los rewrites del `next.config` y desplegar la tienda devuelve todo al estado anterior.

## Lista de verificación (después de desplegar la tienda)

```bash
# 1. El despliegue de las landings responde sin redirecciones (debe ser 200)
curl -sI <URL-DE-LAS-LANDINGS>/ncacademia/cursos/ia-para-finanzas | head -1

# 2. La tienda reenvía bien (200, y content-type text/html)
curl -sI https://www.negocioscreativos.net/ncacademia/cursos/ia-para-finanzas | head -5

# 3. Los recursos cargan desde el dominio de la tienda
curl -sI https://www.negocioscreativos.net/ncacademia/cursos/assets/fonts/amaranth-700.woff2 | head -3

# 4. El sitemap de las landings
curl -s https://www.negocioscreativos.net/ncacademia/cursos/sitemap-landings.xml | head -5
```

En el navegador, con cada uno de los 10 cursos:
1. La página carga con estilos, fuentes, logo e imágenes (sin errores en la consola).
2. **Inscribirme ahora** abre `https://www.negocioscreativos.net/checkout` con el curso correcto en el resumen (en pesos colombianos) y en el primer paso (datos del cliente).
3. El catálogo (`/ncacademia/cursos`) sigue funcionando igual.
4. Ver código fuente: el `canonical` es `https://www.negocioscreativos.net/ncacademia/cursos/<curso>` (sin barra final).
5. Enviar el sitemap en Google Search Console y solicitar la indexación de las 10 URL.

## Alternativa sin proxy

Si prefieren no reenviar a otro despliegue, pueden copiar el contenido de `dist/ncacademia/cursos/` a `public/ncacademia/cursos/` de la tienda y añadir un rewrite por curso hacia `/ncacademia/cursos/<curso>/index.html` (Next.js no sirve `index.html` de carpetas de `public/` por sí solo). Es válido, pero cada cambio de las landings exigiría volver a copiar y desplegar la tienda.

## Mejora a futuro (opcional)

Un enlace directo por curso en la tienda (por ejemplo `/checkout?curso=<id>&moneda=COP`) permitiría que el botón funcione desde cualquier dominio y haría innecesario el proxy. Si lo habilitan, basta compilar con `BUY_URL_TEMPLATE="https://www.negocioscreativos.net/checkout?curso={id}&moneda=COP"`.
