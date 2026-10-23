# Comentarios para las diez landings y el catálogo

La guía `embudo_landing.md` pide testimonios reales, con permiso, sin duplicados y sin calificaciones inventadas. El usuario indicó reutilizar los comentarios de los sitios oficiales sin estrellas. Hay siete comentarios sobre NC AcademIA y capacitación empresarial: uno en `https://www.negocioscreativos.net/ncacademia`, tres en `https://www.negocioscreativos.net/ncacademia/cursos-online` y tres en `https://www.negocioscreativos.net/ncacademia/cursos-empresariales`. Ninguno identifica cuál de estos diez cursos cursó la persona. Aparecen como experiencias generales con la academia o con capacitación empresarial, con autor y fuente, en el home y las diez landings. El home incluye además una cita sobre NC Marketing de `https://www.negocioscreativos.net/`, identificada como experiencia con otro servicio de Negocios Creativos. Una tarjeta resume fielmente el testimonio original y se señala como síntesis; las demás son extractos textuales.

## Material necesario

Para mostrar ocho comentarios **específicos** de cada curso hacen falta hasta 80 opiniones auténticas asociadas al curso correspondiente. El home y cada landing muestran los mismos ocho comentarios publicados en los sitios oficiales: siete de formación y uno de NC Marketing, con el ámbito de cada opinión identificado. El usuario autorizó que se repitan. `academy` guarda comentarios generales sobre NC AcademIA y `home` admite los de otras líneas. Ninguno puede presentarse como experiencia con un curso específico sin que la fuente lo confirme.

Por cada reseña, recopilar:

- Nombre o forma de atribución que el participante autorizó, y contexto útil (cargo, empresa o ciudad si consintió publicarlos).
- Texto original, curso cursado si se conoce y fecha. La calificación de 1 a 5 es opcional y solo se muestra si existe en la fuente.
- URL pública de la opinión original (por ejemplo, Hotmart o una publicación verificable). Si proviene de WhatsApp, guardar aparte la captura o el registro de origen y usar un `evidenceId` interno con `sourceLabel`: `WhatsApp`. No subir conversaciones privadas al repositorio.
- Permiso para publicar el texto y la atribución en estas páginas.

## Cómo se incorpora

`assets/reviews.json` tiene arreglos `academy`, `home` y uno para cada curso. Cada entrada aprobada usa esta forma; los valores entre corchetes son campos por completar, no un comentario de ejemplo:

```json
{
  "id": "[identificador-unico]",
  "author": "[nombre autorizado]",
  "context": "[cargo o ciudad autorizados]",
  "quote": "[texto original]",
  "sourceUrl": "https://[url-publica-de-la-reseña]",
  "courseSlug": "[slug-del-curso]",
  "approved": true,
  "permissionGranted": true
}
```

Si existe una calificación real, se añade `"rating": 5` con el valor que la persona otorgó. Para una opinión de un canal privado se reemplaza `sourceUrl` por `"sourceLabel": "WhatsApp"` y `"evidenceId": "[referencia-al-registro-conservado-fuera-del-repositorio]"`.

El generador muestra hasta ocho por landing y ocho en el home. Cada landing prioriza comentarios de su curso y completa los espacios disponibles con comentarios generales sobre la academia y la empresa; el texto de la sección deja clara esa diferencia. El home reúne comentarios generales y de cursos sin duplicar una misma `id`. Las entradas sin autorización, atribución, texto o fuente identificada no se muestran. No se publica `aggregateRating` ni datos estructurados de reseñas hasta revisar la evidencia y la elegibilidad para ese marcado.

## Solicitud sugerida a estudiantes

> Gracias por participar en NC AcademIA. ¿Nos cuentas qué tema del curso aplicaste en tu trabajo y qué mejorarías? Si deseas, califica tu experiencia de 1 a 5 estrellas. También indícanos si autorizas publicar tu opinión y tu nombre o cargo en nuestra web. Tu respuesta no afecta el certificado ni el acceso al curso.

Con las respuestas reales se puede seleccionar el testimonio relevante para cada objeción del embudo: claridad para principiantes, utilidad de la práctica, acompañamiento, aplicación en el rol y decisión de compra. Conservar también críticas útiles; no solicitar una calificación predeterminada.
